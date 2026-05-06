/**
 * Cliente Supabase con service role key.
 * SOLO para uso en server-side (Route Handlers, Server Actions).
 * NUNCA importar desde componentes "use client".
 *
 * Se instancia de forma lazy para evitar errores en build
 * cuando SUPABASE_SERVICE_ROLE_KEY todavía no está configurado.
 *
 * IMPORTANTE: si las env vars no están definidas, devuelve null
 * en lugar de tirar excepción. El llamador debe manejar este caso
 * y degradarse a un comportamiento sin admin (RLS-aware).
 */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _admin: SupabaseClient | null = null;

/**
 * Devuelve el cliente admin si las env vars están configuradas, null si no.
 * Quien llama debe verificar `if (admin)` antes de usarlo.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (_admin) return _admin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      "[supabase-admin] Faltan env vars: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY. " +
      "El endpoint que llamó a getSupabaseAdmin debe degradarse sin admin.",
    );
    return null;
  }

  _admin = createClient(url, key);
  return _admin;
}
