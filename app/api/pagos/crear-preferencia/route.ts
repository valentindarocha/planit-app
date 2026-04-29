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

    /* 2. Buscar el proveedor_id en la reserva y luego su access_token en Profiles */
    let accessToken = process.env.MP_ACCESS_TOKEN ?? "";   // fallback: cuenta de PLANIT

    const admin = getSupabaseAdmin();

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
        accessToken = profileData.mp_access_token;   // ✅ pago va al proveedor
      }
    }

    if (!accessToken) {
      return Response.json({ error: "Configuración de pago no disponible" }, { status: 500 });
    }

    /* 3. Crear preferencia con el token correspondiente */
    const client     = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);
    const BASE_URL   = getBaseUrl();

    const result = await preference.create({
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

    if (!result.init_point) {
      return Response.json(
        { error: "Mercado Pago no devolvió un link de pago" },
        { status: 502 },
      );
    }

    return Response.json({ init_point: result.init_point });

  } catch (err: unknown) {
    console.error("Error al crear preferencia MP:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return Response.json({ error: message }, { status: 500 });
  }
}
