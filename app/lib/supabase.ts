import { createClient } from "@supabase/supabase-js";

/* ─────────────────────────────────────────────
   Cliente Supabase para uso general (anon).
   Lee las credenciales de variables de entorno.

   Estas variables tienen que estar definidas en:
   - Local:    .env.local (en la raíz de planit-app/)
   - Vercel:   Project Settings → Environment Variables

   NEXT_PUBLIC_* significa que el valor se embebe en el bundle
   del cliente. Es OK porque la anon key es pública por diseño
   (las protecciones reales vienen de Row Level Security en Supabase).
─────────────────────────────────────────────── */

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error(
    "Falta la variable de entorno NEXT_PUBLIC_SUPABASE_URL. " +
    "En local: agregala a .env.local. En producción: configurala en " +
    "Vercel → Settings → Environment Variables.",
  );
}

if (!supabaseAnonKey) {
  throw new Error(
    "Falta la variable de entorno NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "En local: agregala a .env.local. En producción: configurala en " +
    "Vercel → Settings → Environment Variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
