"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/app/lib/supabase";

/* ─────────────────────────────────────────────
   Tipos
───────────────────────────────────────────── */
interface DatosReserva {
  proveedor_id: string;
  fecha_evento: string;
  tipo_evento:  string;
  monto_sena:   number | null;
  estado:       string;
}

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconCheckCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function formatearFecha(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/* ─────────────────────────────────────────────
   Contenido principal (usa useSearchParams)
───────────────────────────────────────────── */
function ExitoContent() {
  const searchParams  = useSearchParams();
  const reservaId     = searchParams.get("reserva_id");
  const collectionStatus = searchParams.get("collection_status"); // MP lo envía en la URL

  const [reserva,    setReserva]    = useState<DatosReserva | null>(null);
  const [cargando,   setCargando]   = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [provNombre, setProvNombre] = useState<string>("");

  useEffect(() => {
    if (!reservaId) {
      setError("No se encontró el ID de la reserva.");
      setCargando(false);
      return;
    }

    async function procesarPago() {
      try {
        /* 1. Verificar que el pago fue aprobado (collection_status === "approved") */
        const pagoAprobado = !collectionStatus || collectionStatus === "approved";

        /* 2. Actualizar estado en Supabase solo si está aprobado */
        if (pagoAprobado) {
          const { error: updateError } = await supabase
            .from("reservas")
            .update({ estado: "confirmada" })
            .eq("id", reservaId!);

          if (updateError) console.error("Error al actualizar estado:", updateError.message);
        }

        /* 3. Leer datos de la reserva para mostrar */
        const { data, error: fetchError } = await supabase
          .from("reservas")
          .select("proveedor_id, fecha_evento, tipo_evento, monto_sena, estado")
          .eq("id", reservaId!)
          .single();

        if (fetchError || !data) {
          setError("No se pudo cargar la información de la reserva.");
          return;
        }

        setReserva(data as DatosReserva);

        /* 4. Nombre del proveedor */
        const { data: provData } = await supabase
          .from("Profiles")
          .select("Nombre")
          .eq("ID", data.proveedor_id)
          .single();

        setProvNombre(provData?.Nombre ?? "Proveedor");
      } catch (err) {
        console.error(err);
        setError("Ocurrió un error inesperado.");
      } finally {
        setCargando(false);
      }
    }

    procesarPago();
  }, [reservaId, collectionStatus]);

  /* ── Cargando ── */
  if (cargando) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-poppins)" }}>
          Confirmando tu pago…
        </p>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 text-center px-4">
        <p className="text-sm text-red-500">{error}</p>
        <Link href="/" className="text-sm font-semibold underline" style={{ color: "#E8731A" }}>
          Volver al inicio
        </Link>
      </div>
    );
  }

  /* ── Éxito ── */
  return (
    <div
      className="flex flex-col items-center gap-6 py-12 px-6 max-w-md mx-auto text-center"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Ícono */}
      <div
        className="w-24 h-24 rounded-full flex items-center justify-center"
        style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
      >
        <IconCheckCircle />
      </div>

      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">¡Pago realizado con éxito!</h1>
        <p className="text-sm text-gray-500 mt-2 leading-relaxed">
          Tu seña fue procesada correctamente. El proveedor confirmará tu reserva en las próximas horas.
        </p>
      </div>

      {/* Tarjeta resumen */}
      {reserva && (
        <div
          className="w-full rounded-2xl border p-5 flex flex-col gap-3 text-left"
          style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}
        >
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
            Detalle de la reserva
          </h2>

          <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
            <span className="text-xs text-gray-500">Proveedor</span>
            <span className="text-xs font-semibold text-gray-800 text-right">{provNombre}</span>
          </div>

          <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <IconCalendar /> Fecha del evento
            </span>
            <span className="text-xs font-semibold text-gray-800 text-right">
              {reserva.fecha_evento ? formatearFecha(reserva.fecha_evento) : "–"}
            </span>
          </div>

          {reserva.tipo_evento && (
            <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
              <span className="text-xs text-gray-500">Tipo de evento</span>
              <span className="text-xs font-semibold text-gray-800 text-right">{reserva.tipo_evento}</span>
            </div>
          )}

          <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E8731A" }}>
              Seña pagada
            </span>
            <span className="text-base font-bold" style={{ color: "#E8731A" }}>
              {reserva.monto_sena != null ? `$${Number(reserva.monto_sena).toLocaleString("es-AR")}` : "–"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-gray-500">Estado</span>
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold"
              style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
            >
              ✓ Confirmada
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <Link
        href="/panel-organizador"
        className="cta-button w-full py-3.5 rounded-xl text-white font-semibold text-sm text-center"
      >
        Ir a mi panel
      </Link>

      <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
        Volver al inicio
      </Link>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Página exportada (envuelve en Suspense para useSearchParams)
───────────────────────────────────────────── */
export default function ReservaExitoPage() {
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
        <ExitoContent />
      </Suspense>
    </main>
  );
}
