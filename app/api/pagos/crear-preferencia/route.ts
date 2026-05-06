import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextRequest } from "next/server";
import { getSupabaseAdmin } from "@/app/lib/supabase-admin";

/* Forzar renderizado dinámico — nunca cachear ni pre-renderizar */
export const dynamic = "force-dynamic";

/* ─────────────────────────────────────────────
   URL base
───────────────────────────────────────────── */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  return "http://localhost:3000";
}

/* ─────────────────────────────────────────────
   POST /api/pagos/crear-preferencia
───────────────────────────────────────────── */
export async function POST(request: NextRequest) {
  try {
    /* 1. Leer body */
    const body = await request.json() as {
      proveedor_nombre: string;
      servicio:         string;
      fecha_evento:     string;
      monto_sena:       number;
      reserva_id:       string;
    };

    const { proveedor_nombre, servicio, fecha_evento, monto_sena, reserva_id } = body;

    if (!proveedor_nombre || !monto_sena || !reserva_id) {
      return Response.json(
        { error: "Faltan campos requeridos: proveedor_nombre, monto_sena, reserva_id" },
        { status: 400 },
      );
    }

    /* 2. Buscar el proveedor_id en la reserva y su access_token en Profiles.
          El admin client es OPCIONAL: si no está disponible (env vars faltantes
          o key inválido), nos degradamos al MP_ACCESS_TOKEN de PLANIT.
          Esto evita que el flujo de pago se rompa por configuración incompleta. */
    let accessToken = process.env.MP_ACCESS_TOKEN ?? "";   // fallback: cuenta de PLANIT

    const admin = getSupabaseAdmin();
    if (admin) {
      try {
        const { data: reservaData } = await admin
          .from("reservas")
          .select("proveedor_id")
          .eq("id", reserva_id)
          .single();

        if (reservaData?.proveedor_id) {
          const { data: profileData } = await admin
            .from("Profiles")
            .select("mp_access_token")
            .eq("ID", reservaData.proveedor_id)
            .single();

          if (profileData?.mp_access_token) {
            accessToken = profileData.mp_access_token;   // pago va al proveedor
          }
        }
      } catch (lookupErr) {
        console.warn("[MP] Lookup admin falló, usando token de PLANIT:", lookupErr);
        // No abortamos: el accessToken ya tiene el fallback de PLANIT
      }
    } else {
      console.warn("[MP] Admin client no disponible. Usando MP_ACCESS_TOKEN de PLANIT.");
    }

    if (!accessToken) {
      return Response.json(
        { error: "MP_ACCESS_TOKEN no configurado en el servidor. Contactá al administrador." },
        { status: 500 },
      );
    }

    /* 3. Crear preferencia con el token correspondiente */
    const client     = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const BASE_URL   = getBaseUrl();

    /* Log de diagnóstico ANTES de llamar a MP */
    console.log("=== [MP] Creando preferencia ===");
    console.log("[MP] BASE_URL:", BASE_URL);
    console.log("[MP] reserva_id:", reserva_id);
    console.log("[MP] monto_sena:", monto_sena, "(tipo:", typeof monto_sena, ")");
    console.log("[MP] accessToken prefix:", accessToken.slice(0, 15), "... length:", accessToken.length);
    console.log("[MP] back_urls.success:", `${BASE_URL}/reserva/exito?reserva_id=${reserva_id}`);

    let result;
    try {
      result = await preference.create({
        body: {
          items: [
            {
              id:          reserva_id,
              title:       `Seña - ${proveedor_nombre} - ${servicio || "Evento"}`,
              quantity:    1,
              unit_price:  Number(monto_sena),
              currency_id: "ARS",
            },
          ],
          back_urls: {
            success: `${BASE_URL}/reserva/exito?reserva_id=${reserva_id}`,
            failure: `${BASE_URL}/reserva/error?reserva_id=${reserva_id}`,
            pending: `${BASE_URL}/reserva/pendiente?reserva_id=${reserva_id}`,
          },
          auto_return:          "approved",
          external_reference:   String(reserva_id),
          statement_descriptor: "PLANIT",
          metadata: { reserva_id, proveedor_nombre, fecha_evento },
        },
      });
      console.log("[MP] Preferencia creada OK. init_point:", result.init_point);
    } catch (mpErr: unknown) {
      /* Capturar específicamente el error que devuelve la API de MP.
         El SDK de mercadopago suele incluir { status, cause, message } */
      console.error("=== [MP] ERROR al crear preferencia ===");
      console.error("[MP] tipo:", typeof mpErr);
      console.error("[MP] err completo:", mpErr);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const e = mpErr as any;
      if (e?.message)  console.error("[MP] message:",  e.message);
      if (e?.status)   console.error("[MP] status:",   e.status);
      if (e?.cause)    console.error("[MP] cause:",    JSON.stringify(e.cause, null, 2));
      if (e?.response) console.error("[MP] response:", JSON.stringify(e.response, null, 2));

      const detalle = e?.cause
        ? JSON.stringify(e.cause)
        : (e?.message ?? "Error desconocido al llamar a Mercado Pago");
      return Response.json(
        { error: `Mercado Pago: ${detalle}` },
        { status: 502 },
      );
    }

    if (!result.init_point) {
      return Response.json(
        { error: "Mercado Pago no devolvió un link de pago" },
        { status: 502 },
      );
    }

    return Response.json({ init_point: result.init_point });

  } catch (err: unknown) {
    console.error("=== [MP] ERROR fuera del bloque MP ===");
    console.error(err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
