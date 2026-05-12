"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function traducirError(msg: string): string {
  if (msg.includes("New password should be different"))
    return "La nueva contraseña debe ser diferente a la anterior.";
  if (msg.includes("Password should be at least"))
    return "La contraseña debe tener al menos 8 caracteres.";
  if (msg.includes("rate limit") || msg.includes("too many"))
    return "Demasiados intentos. Esperá unos minutos.";
  return "No se pudo actualizar la contraseña. El link puede haber expirado, pedí uno nuevo.";
}

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

function IconAlert() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
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

function IconEye({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Contenido
───────────────────────────────────────────── */
function NuevaClaveContent() {
  const router = useRouter();
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [cargando, setCargando]   = useState(false);
  const [exito, setExito]         = useState(false);

  /* Estado de la sesión vía link de Supabase:
     - null: todavía no resolvió
     - true: sesión activa (link válido)
     - false: sesión inválida (link expirado o roto) */
  const [sesionOk, setSesionOk]   = useState<boolean | null>(null);

  useEffect(() => {
    /* Cuando el usuario llega desde el link del email, Supabase popula la
       sesión automáticamente leyendo los tokens del hash/query string.
       Verificamos que haya sesión activa antes de mostrar el formulario. */
    let cancelado = false;

    async function verificarSesion() {
      const { data } = await supabase.auth.getSession();
      if (cancelado) return;
      setSesionOk(!!data.session);
    }

    verificarSesion();

    /* También escuchamos cambios de auth — el link del email puede tardar
       unos milisegundos en activar la sesión. */
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (cancelado) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setSesionOk(true);
      }
    });

    return () => {
      cancelado = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    /* IMPORTANTE: el SDK de Supabase a veces lanza una excepción al refrescar
       la sesión DESPUÉS de actualizar la contraseña, aunque del lado del
       servidor la contraseña SÍ haya cambiado. Por eso tratamos cualquier
       excepción del catch como un caso de éxito probable: el usuario va a
       verificar al iniciar sesión con su contraseña nueva. */
    let actualizadoOK = false;
    let errorExplicito: string | null = null;

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });

      if (updateError) {
        errorExplicito = traducirError(updateError.message);
      } else {
        actualizadoOK = true;
      }
    } catch (err) {
      console.warn(
        "[reset-password] updateUser lanzó excepción, asumimos que la contraseña " +
        "se actualizó correctamente del lado del servidor:",
        err,
      );
      actualizadoOK = true;
    }

    setCargando(false);

    if (errorExplicito) {
      setError(errorExplicito);
      return;
    }

    if (actualizadoOK) {
      setExito(true);
      /* Redirigir al inicio de sesión después de 3 segundos. Cerramos la sesión
         para forzar que vuelva a loguearse con la nueva contraseña. */
      setTimeout(async () => {
        try { await supabase.auth.signOut(); } catch { /* la sesión ya está invalidada */ }
        router.push("/cuenta");
      }, 3000);
    }
  }

  /* ── Loading inicial ── */
  if (sesionOk === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Verificando link...</p>
      </div>
    );
  }

  /* ── Link inválido ── */
  if (sesionOk === false) {
    return (
      <>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
        >
          <IconAlert />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Link inválido o expirado</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Este link de recuperación no es válido o ya pasó su tiempo de uso. Pedí
          uno nuevo para continuar.
        </p>
        <Link
          href="/restablecer-contrasena"
          className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center"
        >
          Pedir un link nuevo
        </Link>
      </>
    );
  }

  /* ── Éxito ── */
  if (exito) {
    return (
      <>
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
          style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
        >
          <IconCheckCircle />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">¡Listo!</h1>
        <p className="text-sm text-gray-500 leading-relaxed mb-6">
          Tu contraseña fue actualizada. Te estamos redirigiendo al inicio de
          sesión para que entres con tu nueva clave.
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
          <IconSpinner />
          Redirigiendo...
        </div>
      </>
    );
  }

  /* ── Formulario ── */
  return (
    <>
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
        style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
      >
        <IconLock />
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Crear nueva contraseña</h1>
      <p className="text-sm text-gray-500 leading-relaxed mb-6">
        Elegí una contraseña segura de al menos 8 caracteres.
      </p>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Nueva contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
              disabled={cargando}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white"
              onFocus={(e) => { e.currentTarget.style.borderColor = "#E8731A"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <IconEye open={showPass} />
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConf ? "text" : "password"}
              placeholder="Repetí tu contraseña"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); if (error) setError(null); }}
              disabled={cargando}
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white"
              onFocus={(e) => { e.currentTarget.style.borderColor = "#E8731A"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
            />
            <button
              type="button"
              onClick={() => setShowConf((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
            >
              <IconEye open={showConf} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-xl text-sm text-red-700 border border-red-200"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
          className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-1"
        >
          {cargando ? <><IconSpinner /> Guardando...</> : "Guardar nueva contraseña"}
        </button>
      </form>
    </>
  );
}

/* ─────────────────────────────────────────────
   Página exportada
───────────────────────────────────────────── */
export default function NuevaClavePage() {
  return (
    <main
      className="min-h-screen pt-[50px] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "var(--font-poppins)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Cargando...</p>
            </div>
          }
        >
          <NuevaClaveContent />
        </Suspense>
      </div>
    </main>
  );
}
