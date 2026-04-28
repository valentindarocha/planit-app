"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconXCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Contenido (usa useSearchParams)
───────────────────────────────────────────── */
function ErrorContent() {
  const searchParams = useSearchParams();
  const reservaId    = searchParams.get("reserva_id");

  return (
    <div
      className="flex flex-col items-center gap-6 py-12 px-6 max-w-md mx-auto text-center"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Ícono */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#FEE2E2", color: "#DC2626" }}
      >
        <IconXCircle />
      </div>

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">El pago no se completó</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
          Hubo un problema al procesar tu pago en Mercado Pago. Tu reserva quedó guardada; podés intentar pagar de nuevo desde tu panel.
        </p>
      </div>

      {/* Info de referencia */}
      {reservaId && (
        <div
          className="w-full rounded-xl border px-4 py-3 text-left"
          style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}
        >
          <p className="text-[11px] text-gray-400">ID de reserva</p>
          <p className="text-xs font-mono text-gray-700 mt-0.5 break-all">{reservaId}</p>
        </div>
      )}

      {/* Acciones */}
      <div className="flex flex-col gap-3 w-full">
        {/* Reintentar: vuelve al panel donde puede ver la reserva */}
        <Link
          href="/panel-organizador"
          className="cta-button w-full py-3.5 rounded-xl text-white font-semibold text-sm text-center"
        >
          Ir a mi panel para reintentar
        </Link>

        <Link
          href="/"
          className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors text-center"
        >
          Volver al inicio
        </Link>
      </div>

      {/* Ayuda */}
      <p className="text-[11px] text-gray-400 leading-relaxed">
        Si el problema persiste, el importe no fue debitado.{" "}
        <a href="mailto:soporte@planit.com.ar" className="underline hover:text-gray-600 transition-colors">
          Contactá a soporte
        </a>
        .
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Página exportada
───────────────────────────────────────────── */
export default function ReservaErrorPage() {
  return (
    <main
      className="min-h-screen pt-[50px] flex flex-col items-center justify-center"
      style={{ backgroundColor: "#F9FAFB" }}
    >
      <Suspense
        fallback={
          <div className="flex items-center gap-3 text-sm text-gray-500" style={{ fontFamily: "var(--font-poppins)" }}>
            <div className="w-6 h-6 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            Cargando…
          </div>
        }
      >
        <ErrorContent />
      </Suspense>
    </main>
  );
}
