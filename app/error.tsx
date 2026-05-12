"use client";

import { useEffect } from "react";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconAlert() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Página de Error
   Next.js le pasa los props { error, reset } automáticamente.
   - error: el Error que se lanzó (con un .digest para ID interno)
   - reset: función que intenta re-renderizar el segmento que falló
───────────────────────────────────────────── */
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* Loggear a la consola para que aparezca en Vercel Logs si pasa en prod */
  useEffect(() => {
    console.error("[PLANIT error.tsx]", error);
  }, [error]);

  return (
    <main
      className="min-h-screen pt-[50px] flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: "#F9FAFB", fontFamily: "var(--font-poppins)" }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        {/* Ícono de alerta */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
        >
          <IconAlert />
        </div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Algo salió mal
        </h1>

        {/* Descripción */}
        <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-xs mx-auto">
          Tuvimos un problema al cargar esta página. Probá refrescar; si el error
          persiste, volvé al inicio y contactanos.
        </p>

        {/* ID del error (útil para soporte) */}
        {error.digest && (
          <div
            className="mb-7 px-4 py-2.5 rounded-xl text-[11px]"
            style={{ backgroundColor: "#F3F4F6", color: "#6B7280", fontFamily: "var(--font-poppins)" }}
          >
            <p className="font-semibold uppercase tracking-wider text-gray-400 mb-0.5 text-[10px]">
              Código de error
            </p>
            <p className="font-mono break-all">{error.digest}</p>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            <IconRefresh />
            Intentar de nuevo
          </button>

          <Link
            href="/"
            className="w-full py-3 rounded-xl text-sm font-semibold border-2 transition-colors flex items-center justify-center gap-2 hover:bg-orange-50"
            style={{ borderColor: "#E8731A", color: "#E8731A" }}
          >
            <IconHome />
            Volver al inicio
          </Link>
        </div>

        {/* Soporte */}
        <p className="text-[11px] text-gray-400 leading-relaxed mt-7">
          ¿El problema persiste?{" "}
          <a
            href="mailto:soporte@planit.com.ar"
            className="font-semibold underline hover:text-gray-600 transition-colors"
          >
            Contactá a soporte
          </a>
          .
        </p>

        {/* Marca PLANIT abajo */}
        <p
          className="text-[10px] uppercase tracking-widest text-gray-400 mt-5 font-semibold"
          style={{ letterSpacing: "0.15em" }}
        >
          PLANIT — Marketplace de servicios para eventos
        </p>
      </div>
    </main>
  );
}
