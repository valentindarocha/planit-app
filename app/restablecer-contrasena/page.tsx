"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function traducirError(msg: string): string {
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Demasiados intentos. Esperá unos minutos e intentá de nuevo.";
  if (msg.includes("Unable to validate email"))
    return "El email ingresado no es válido.";
  return "Ocurrió un error. Intentá de nuevo en unos minutos.";
}

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function IconCheckCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconSpinner() {
  return (
    <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}

function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Página
───────────────────────────────────────────── */
export default function RestablecerContrasenaPage() {
  const [email, setEmail]         = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [cargando, setCargando]   = useState(false);
  const [enviado, setEnviado]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Ingresá tu email para continuar.");
      return;
    }
    if (!validarEmail(email)) {
      setError("Ingresá un email válido.");
      return;
    }

    setCargando(true);
    try {
      /* Calculamos la URL de redirección al hacer click en el link del email.
         Usamos window.location.origin para que ande igual en local que en prod. */
      const redirectTo = `${window.location.origin}/restablecer-contrasena/nueva-clave`;

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo },
      );

      if (resetError) {
        setError(traducirError(resetError.message));
        return;
      }

      /* Por seguridad, Supabase devuelve "ok" incluso si el email no existe.
         Eso es lo que queremos: no revelar si una cuenta existe o no. */
      setEnviado(true);
    } catch (err) {
      console.error(err);
      setError("Ocurrió un error inesperado. Intentá de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <main
      className="min-h-screen pt-[50px] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "var(--font-poppins)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Link volver */}
        <Link
          href="/cuenta"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-6"
        >
          <IconArrowLeft />
          Volver a iniciar sesión
        </Link>

        {!enviado ? (
          /* ── Formulario inicial ── */
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
            >
              <IconMail />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Ingresá el email con el que te registraste y te vamos a enviar un
              link para crear una nueva contraseña.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (error) setError(null); }}
                  disabled={cargando}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white"
                  style={error ? { borderColor: "#DC2626", backgroundColor: "#FEF2F2" } : undefined}
                  onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = "#E8731A"; }}
                  onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = "#E5E7EB"; }}
                />
                {error && (
                  <p className="text-xs font-semibold mt-0.5" style={{ color: "#DC2626" }}>
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={cargando}
                className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {cargando ? (
                  <>
                    <IconSpinner /> Enviando...
                  </>
                ) : (
                  "Enviar email de recuperación"
                )}
              </button>
            </form>
          </>
        ) : (
          /* ── Confirmación de email enviado ── */
          <>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
            >
              <IconCheckCircle />
            </div>

            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Revisá tu email
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Si existe una cuenta asociada a <strong className="text-gray-700">{email}</strong>,
              te enviamos un link para crear una nueva contraseña.
            </p>
            <p className="text-xs text-gray-400 leading-relaxed mb-6">
              Si no lo ves en tu bandeja de entrada, revisá la carpeta de spam o
              promociones. El link tiene una duración limitada.
            </p>

            <Link
              href="/cuenta"
              className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center"
            >
              Volver al inicio de sesión
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
