import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";

/* Forzar renderizado dinámico — el webhook NO puede cachear */
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
   POST /api/pagos/webhook

   Endpoint que Mercado Pago llama cuando hay un cambio de estado
   en un pago. Recibe el ID del pago, lo consulta a la API de MP
   para verificar el estado real, y actualiza la reserva en Supabase.

   IMPORTANTE: este endpoint SIEMPRE responde 200 OK (incluso si algo
   falla del lado nuestro), salvo errores graves. Si devolvemos un
   código de error, MP reintenta el webhook 10+ veces durante 48 hs,
   lo cual genera ruido y consume cuota. La lógica de retry tiene
   que ser nuestra, no de MP.
───────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  console.log("=== [MP-WEBHOOK] Notificación recibida ===");

  try {
    /* MP envía notificaciones en DOS formatos según la versión:
       (1) Nuevo "Webhooks": body JSON con { type, data: { id }, action, ... }
       (2) Legacy "IPN":     query string ?topic=payment&id=12345
       Soportamos ambos. */

    let paymentId: string | null = null;
    let tipo: string | null = null;

    // Intentar leer el body
    const bodyText = await request.text();
    if (bodyText) {
      try {
        const body = JSON.parse(bodyText);
        console.log("[MP-WEBHOOK] body:", body);
        tipo = body.type ?? body.topic ?? null;
        paymentId = body.data?.id?.toString() ?? body.resource ?? null;
      } catch {
        console.warn("[MP-WEBHOOK] body no es JSON válido:", bodyText.slice(0, 200));
      }
    }

    // Fallback a query string (formato IPN legacy)
    const url = new URL(request.url);
    if (!tipo)       tipo       = url.searchParams.get("type") ?? url.searchParams.get("topic");
    if (!paymentId)  paymentId  = url.searchParams.get("data.id") ?? url.searchParams.get("id");

    console.log("[MP-WEBHOOK] tipo:", tipo, "paymentId:", paymentId);

    /* Filtrar solo notificaciones de pago. MP también manda notificaciones de
       merchant_order, refunds, etc. — las ignoramos para no procesar. */
    if (tipo && tipo !== "payment" && tipo !== "payment.updated" && tipo !== "payment.created") {
      console.log("[MP-WEBHOOK] Tipo no relacionado a pagos, ignorando.");
      return Response.json({ received: true, ignored: "tipo no relevante" });
    }

    if (!paymentId) {
      console.warn("[MP-WEBHOOK] No se pudo extraer paymentId, ignorando.");
      return Response.json({ received: true, ignored: "sin paymentId" });
    }

    /* Configurar el cliente de MP. Usamos siempre el access token global de
       PLANIT (no el del proveedor) porque la app de MP que recibe el webhook
       es la de PLANIT. */
    const accessToken = process.env.MP_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("[MP-WEBHOOK] MP_ACCESS_TOKEN no configurado, no puedo consultar el pago.");
      // Devolvemos 200 para que MP no reintente — el problema es nuestro, no de MP
      return Response.json({ received: true, error: "config" });
    }

    const client  = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    /* Consultar el pago real en MP para confirmar el estado.
       Esto previene ataques: aunque alguien nos haga un POST falso, el
       endpoint solo confía en lo que dice la API de MP. */
    let mpPayment;
    try {
      mpPayment = await payment.get({ id: paymentId });
    } catch (err) {
      console.error("[MP-WEBHOOK] Error al consultar pago en MP:", err);
      // Si el ID no existe en MP, no hay nada que actualizar
      return Response.json({ received: true, error: "no se pudo consultar el pago" });
    }

    console.log("[MP-WEBHOOK] Pago consultado:", {
      id:                 mpPayment.id,
      status:             mpPayment.status,
      status_detail:      mpPayment.status_detail,
      external_reference: mpPayment.external_reference,
      transaction_amount: mpPayment.transaction_amount,
    });

    const reservaId = mpPayment.external_reference;
    const status    = mpPayment.status;

    if (!reservaId) {
      console.warn("[MP-WEBHOOK] El pago no tiene external_reference, no puedo asociarlo a una reserva.");
      return Response.json({ received: true, ignored: "sin external_reference" });
    }

    /* Solo actualizamos a "confirmada" cuando el pago está aprobado.
       Otros estados (pending, in_process, rejected, cancelled) los logueamos
       pero no cambian el estado de la reserva — el usuario puede reintentar. */
    if (status !== "approved") {
      console.log(`[MP-WEBHOOK] Pago en estado "${status}", no actualizamos reserva ${reservaId}`);
      return Response.json({ received: true, status, no_update: true });
    }

    /* Actualizar reserva en Supabase usando admin (bypasea RLS).
       Si admin no está disponible (env vars faltantes), logueamos pero
       devolvemos 200 — peor caso, el usuario va a tener que ir a /reserva/exito
       para que la página actualice el estado. */
    const admin = getSupabaseAdmin();
    if (!admin) {
      console.error("[MP-WEBHOOK] Admin client no disponible (faltan env vars). " +
                    "La reserva NO se actualizó por webhook. " +
                    "El usuario va a tener que entrar a /reserva/exito.");
      return Response.json({ received: true, warning: "admin no disponible" });
    }

    /* UPDATE idempotente: si la reserva ya está confirmada, no pasa nada.
       Si está pendiente, queda confirmada. */
    const { data: updateData, error: updateError } = await admin
      .from("reservas")
      .update({ estado: "confirmada" })
      .eq("id", reservaId)
      .select("id, estado")
      .single();

    if (updateError) {
      console.error("[MP-WEBHOOK] Error al actualizar reserva:", updateError);
      // Devolvemos 200 igual — si reintenta MP es lo mismo, idempotente
      return Response.json({ received: true, db_error: updateError.message });
    }

    console.log(`[MP-WEBHOOK] ✓ Reserva ${reservaId} actualizada a "confirmada"`, updateData);
    return Response.json({ received: true, updated: true, reserva: updateData });

  } catch (err) {
    console.error("[MP-WEBHOOK] Error inesperado:", err);
    // 200 para no provocar retries en cadena
    return Response.json({ received: true, error: "interno" });
  }
}

/* ─────────────────────────────────────────────
   GET /api/pagos/webhook
   MP a veces hace un GET de healthcheck cuando configurás el webhook
   en su dashboard. Devolvemos 200 para que sepa que el endpoint existe.
───────────────────────────────────────────── */
export async function GET() {
  return Response.json({ status: "ok", endpoint: "webhook MP de PLANIT" });
}
