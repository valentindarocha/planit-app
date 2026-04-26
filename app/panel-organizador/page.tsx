"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../lib/supabase";

/* ─────────────────────────────────────────────
   Tipos
───────────────────────────────────────────── */
type Seccion = "resumen" | "reservas" | "calendario" | "perfil";
type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

interface Reserva {
  id: string;
  proveedor: string;
  tipoServicio: string;
  inicial: string; // letra avatar
  fecha: string; // "YYYY-MM-DD"
  precio: string;
  sena: string;
  senaPagada: boolean;
  estado: EstadoReserva;
  mensajeProveedor: string;
}

interface UserData {
  nombre: string;
  email: string;
  telefono: string;
  ubicacion: string;
  fotoPerfil: string;
}

/* ─────────────────────────────────────────────
   Datos simulados
───────────────────────────────────────────── */
const RESERVAS_INICIALES: Reserva[] = [
  {
    id: "r1",
    proveedor: "DJ Matías López",
    tipoServicio: "DJ",
    inicial: "M",
    fecha: "2026-05-15",
    precio: "$180.000",
    sena: "$36.000",
    senaPagada: true,
    estado: "confirmada",
    mensajeProveedor:
      "¡Confirmado! Ya agendé la fecha. Nos vemos el 15 de mayo. Cualquier consulta escribime.",
  },
  {
    id: "r2",
    proveedor: "Catering Palazzo",
    tipoServicio: "Catering",
    inicial: "P",
    fecha: "2026-05-15",
    precio: "$450.000",
    sena: "$90.000",
    senaPagada: true,
    estado: "confirmada",
    mensajeProveedor:
      "¡Todo listo! Haremos una degustación previa la semana del 5 de mayo para aprobar el menú.",
  },
  {
    id: "r3",
    proveedor: "Foto+Video Nora",
    tipoServicio: "Fotografía y Video",
    inicial: "N",
    fecha: "2026-05-15",
    precio: "$250.000",
    sena: "$50.000",
    senaPagada: false,
    estado: "pendiente",
    mensajeProveedor:
      "Recibí tu solicitud. Estoy revisando mi disponibilidad y te respondo en las próximas horas.",
  },
  {
    id: "r4",
    proveedor: "Banda Ritmo Vivo",
    tipoServicio: "Banda en vivo",
    inicial: "R",
    fecha: "2026-07-20",
    precio: "$120.000",
    sena: "$24.000",
    senaPagada: false,
    estado: "cancelada",
    mensajeProveedor:
      "Lamentamos que hayas cancelado. Quedamos a disposición para futuros eventos.",
  },
  {
    id: "r5",
    proveedor: "Salón Villa Clara",
    tipoServicio: "Lugar / Salón",
    inicial: "V",
    fecha: "2026-09-10",
    precio: "$800.000",
    sena: "$160.000",
    senaPagada: false,
    estado: "cancelada",
    mensajeProveedor:
      "Entendemos la cancelación. Si en el futuro necesitás el espacio, no dudes en contactarnos.",
  },
];

const USUARIO_INICIAL: UserData = {
  nombre: "Valentín Morales",
  email: "valentin.morales@email.com",
  telefono: "+54 9 11 4523-7891",
  ubicacion: "Palermo, CABA",
  fotoPerfil:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&q=80&fit=crop&crop=face",
};

const FOTOS_PERFIL_POOL = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&q=80&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&q=80&fit=crop&crop=face",
];

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const DIAS_CAL = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function formatearFechaCorta(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1].slice(0, 3)}, ${a}`;
}
function formatearFechaLarga(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconHome() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
function IconList() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconLogOut() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}
function IconCheckCircle() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}
function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}
function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
function IconCalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconChevronLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Toast
───────────────────────────────────────────── */
function Toast({
  mensaje,
  tipo,
  onClose,
}: {
  mensaje: string;
  tipo: "exito" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-lg text-sm font-semibold"
      style={{
        fontFamily: "var(--font-poppins)",
        backgroundColor: tipo === "exito" ? "#DCFCE7" : "#FEE2E2",
        color: tipo === "exito" ? "#15803D" : "#B91C1C",
        minWidth: "240px",
        animation: "toastIn 0.22s ease-out",
      }}
    >
      <span
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white"
        style={{ backgroundColor: tipo === "exito" ? "#15803D" : "#B91C1C" }}
      >
        {tipo === "exito" ? <IconCheck size={14} /> : "✕"}
      </span>
      {mensaje}
      <style jsx>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge de estado de reserva
───────────────────────────────────────────── */
function BadgeEstadoReserva({ estado }: { estado: EstadoReserva }) {
  const map: Record<EstadoReserva, { bg: string; text: string; label: string; dot: string }> = {
    pendiente:  { bg: "#FEF9C3", text: "#854D0E", label: "Pendiente",  dot: "#CA8A04" },
    confirmada: { bg: "#DCFCE7", text: "#15803D", label: "Confirmada", dot: "#16A34A" },
    cancelada:  { bg: "#FEE2E2", text: "#B91C1C", label: "Cancelada",  dot: "#DC2626" },
  };
  const s = map[estado];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
      style={{ backgroundColor: s.bg, color: s.text, fontFamily: "var(--font-poppins)" }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}

/* ─────────────────────────────────────────────
   Modal — Ver detalle de reserva
───────────────────────────────────────────── */
function DetalleReservaModal({
  reserva,
  onClose,
  onCancelar,
}: {
  reserva: Reserva;
  onClose: () => void;
  onCancelar: (id: string) => void;
}) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-poppins)" }}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ animation: "modalIn 0.2s ease-out" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Detalle de reserva</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Proveedor + estado */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
              >
                {reserva.inicial}
              </div>
              <div>
                <p className="text-base font-bold text-gray-800">{reserva.proveedor}</p>
                <p className="text-xs text-gray-500">{reserva.tipoServicio}</p>
              </div>
            </div>
            <BadgeEstadoReserva estado={reserva.estado} />
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Fecha del evento", value: formatearFechaLarga(reserva.fecha) },
              { label: "Precio del servicio", value: reserva.precio },
            ].map((item) => (
              <div key={item.label}
                className="flex flex-col gap-0.5 p-3 rounded-xl bg-gray-50">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
              </div>
            ))}

            {/* Seña */}
            <div className="col-span-2 flex items-center justify-between p-3 rounded-xl"
              style={{ backgroundColor: reserva.senaPagada ? "#DCFCE7" : "#FFF0E6" }}>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wide"
                  style={{ color: reserva.senaPagada ? "#15803D" : "#C25E10" }}>
                  Seña
                </span>
                <span className="text-base font-bold"
                  style={{ color: reserva.senaPagada ? "#15803D" : "#E8731A" }}>
                  {reserva.sena}
                </span>
              </div>
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  backgroundColor: reserva.senaPagada ? "#15803D" : "#E8731A",
                  color: "white",
                }}
              >
                {reserva.senaPagada ? "Pagada ✓" : "Pendiente de pago"}
              </span>
            </div>

            {/* Mensaje del proveedor */}
            <div className="col-span-2 p-3 rounded-xl bg-gray-50">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1.5">
                Mensaje del proveedor
              </span>
              <p className="text-sm text-gray-600 leading-relaxed italic">
                &ldquo;{reserva.mensajeProveedor}&rdquo;
              </p>
            </div>
          </div>

          {/* Acción cancelar */}
          {reserva.estado === "pendiente" && (
            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50"
                style={{ borderColor: "#E5E7EB", color: "#4B5563" }}
              >
                Cerrar
              </button>
              <button
                onClick={() => { onCancelar(reserva.id); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-red-50"
                style={{ borderColor: "#DC2626", color: "#DC2626" }}
              >
                Cancelar reserva
              </button>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes modalIn {
            from { opacity: 0; transform: translateY(8px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Foto de perfil editable (reutilizable)
───────────────────────────────────────────── */
function FotoPerfilEditable({
  foto,
  nombre,
  size = 56,
  onCambiar,
}: {
  foto: string;
  nombre: string;
  size?: number;
  onCambiar: () => void;
}) {
  return (
    <div className="relative flex-shrink-0 group" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={foto}
        alt={nombre}
        className="rounded-full object-cover w-full h-full border-2"
        style={{ borderColor: "#FFF0E6" }}
      />
      {/* Overlay editar */}
      <button
        type="button"
        onClick={onCambiar}
        aria-label="Cambiar foto de perfil"
        className="absolute inset-0 rounded-full flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-200 cursor-pointer"
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-full p-1.5 shadow">
          <IconEdit />
        </span>
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Resumen
───────────────────────────────────────────── */
function SeccionResumen({
  reservas,
  onNavegar,
}: {
  reservas: Reserva[];
  onNavegar: (s: Seccion) => void;
}) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const activas   = reservas.filter((r) => r.estado === "confirmada").length;
  const pendientes = reservas.filter((r) => r.estado === "pendiente").length;
  const proxReserva = reservas
    .filter((r) => r.estado === "confirmada" && new Date(r.fecha + "T00:00:00") >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const metricas = [
    {
      label: "Reservas activas",
      valor: String(activas),
      icono: <IconCheckCircle />,
      color: "#15803D",
      bg: "#DCFCE7",
      accion: () => onNavegar("reservas"),
    },
    {
      label: "Reservas pendientes",
      valor: String(pendientes),
      icono: <IconBell />,
      color: "#E8731A",
      bg: "#FFF0E6",
      accion: () => onNavegar("reservas"),
    },
    {
      label: "Próximo evento",
      valor: proxReserva
        ? `${formatearFechaCorta(proxReserva.fecha)} — ${proxReserva.proveedor}`
        : "Sin eventos próximos",
      icono: <IconClock />,
      color: "#6366F1",
      bg: "#EEF2FF",
      accion: proxReserva ? () => onNavegar("reservas") : null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800">Resumen</h2>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {metricas.map((m) => (
          <button
            key={m.label}
            onClick={m.accion ?? undefined}
            disabled={!m.accion}
            className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 text-left shadow-sm transition-shadow ${m.accion ? "hover:shadow-md cursor-pointer" : "cursor-default"}`}
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: m.bg, color: m.color }}
            >
              {m.icono}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              {m.label === "Próximo evento" ? (
                <span className="text-sm font-bold text-gray-800 leading-snug line-clamp-2">
                  {m.valor}
                </span>
              ) : (
                <span className="text-3xl font-bold text-gray-800 leading-tight">{m.valor}</span>
              )}
              <span className="text-[11px] text-gray-500">{m.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        style={{ fontFamily: "var(--font-poppins)" }}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/servicios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:text-white"
            style={{ borderColor: "#E8731A", color: "#E8731A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E8731A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#E8731A";
            }}
          >
            <IconSearch />
            Explorar servicios
          </Link>
          <Link
            href="/servicios"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all"
            style={{ borderColor: "#E8731A", color: "#E8731A" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#E8731A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#ffffff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLAnchorElement).style.color = "#E8731A";
            }}
          >
            <IconPlus />
            Nueva reserva
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tarjeta de reserva
───────────────────────────────────────────── */
function ReservaCard({
  reserva,
  onCancelar,
  onVerDetalle,
}: {
  reserva: Reserva;
  onCancelar: (id: string) => void;
  onVerDetalle: (r: Reserva) => void;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 transition-shadow hover:shadow-md"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
          >
            {reserva.inicial}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{reserva.proveedor}</p>
            <p className="text-[11px] text-gray-500">{reserva.tipoServicio}</p>
          </div>
        </div>
        <BadgeEstadoReserva estado={reserva.estado} />
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Fecha</span>
          <span className="text-xs font-semibold text-gray-700">{formatearFechaCorta(reserva.fecha)}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Precio</span>
          <span className="text-xs font-semibold text-gray-700">{reserva.precio}</span>
        </div>
        <div className="col-span-2 flex items-center justify-between px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: reserva.senaPagada ? "#DCFCE7" : "#FFF0E6" }}>
          <span className="text-[10px] font-semibold uppercase tracking-wide"
            style={{ color: reserva.senaPagada ? "#15803D" : "#C25E10" }}>
            Seña {reserva.sena}
          </span>
          <span className="text-[10px] font-bold"
            style={{ color: reserva.senaPagada ? "#15803D" : "#E8731A" }}>
            {reserva.senaPagada ? "✓ Pagada" : "Pendiente de pago"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={() => onVerDetalle(reserva)}
          className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-orange-50"
          style={{ borderColor: "#E8731A", color: "#E8731A" }}
        >
          Ver detalle
        </button>
        {reserva.estado === "pendiente" && (
          <button
            onClick={() => onCancelar(reserva.id)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-colors hover:bg-red-50"
            style={{ borderColor: "#DC2626", color: "#DC2626" }}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Mis reservas
───────────────────────────────────────────── */
function SeccionReservas({
  reservas,
  onCancelar,
}: {
  reservas: Reserva[];
  onCancelar: (id: string) => void;
}) {
  const [detalle, setDetalle]   = useState<Reserva | null>(null);
  const [filtro, setFiltro]     = useState<EstadoReserva | "todas">("todas");

  const filtradas =
    filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);

  const cuentas = {
    todas:      reservas.length,
    pendiente:  reservas.filter((r) => r.estado === "pendiente").length,
    confirmada: reservas.filter((r) => r.estado === "confirmada").length,
    cancelada:  reservas.filter((r) => r.estado === "cancelada").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-800">Mis reservas</h2>
        <Link
          href="/servicios"
          className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl transition-colors hover:opacity-80"
          style={{ backgroundColor: "#E8731A", color: "white", fontFamily: "var(--font-poppins)" }}
        >
          <IconPlus />
          Nueva reserva
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "confirmada", "pendiente", "cancelada"] as const).map((f) => {
          const activo = filtro === f;
          const labels: Record<string, string> = {
            todas:      `Todas (${cuentas.todas})`,
            confirmada: `Activas (${cuentas.confirmada})`,
            pendiente:  `Pendientes (${cuentas.pendiente})`,
            cancelada:  `Canceladas (${cuentas.cancelada})`,
          };
          return (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                fontFamily: "var(--font-poppins)",
                backgroundColor: activo ? "#E8731A" : "#F3F4F6",
                color: activo ? "#ffffff" : "#6B7280",
              }}
            >
              {labels[f]}
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtradas.map((r) => (
          <ReservaCard
            key={r.id}
            reserva={r}
            onCancelar={onCancelar}
            onVerDetalle={setDetalle}
          />
        ))}
        {filtradas.length === 0 && (
          <div
            className="col-span-2 bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            No hay reservas en este estado.
          </div>
        )}
      </div>

      {detalle && (
        <DetalleReservaModal
          reserva={detalle}
          onClose={() => setDetalle(null)}
          onCancelar={(id) => { onCancelar(id); setDetalle(null); }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Mi perfil
───────────────────────────────────────────── */
function SeccionPerfil({
  foto,
  onCambiarFoto,
  onToast,
}: {
  foto: string;
  onCambiarFoto: () => void;
  onToast: (msg: string) => void;
}) {
  const [datos, setDatos] = useState<UserData>({ ...USUARIO_INICIAL });

  function actualizar<K extends keyof UserData>(k: K, v: UserData[K]) {
    setDatos((d) => ({ ...d, [k]: v }));
  }

  function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    onToast("Perfil actualizado correctamente");
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white";
  const inputFocus = {
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "#E8731A";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      e.currentTarget.style.borderColor = "#E5E7EB";
    },
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-800">Mi perfil</h2>

      <form
        onSubmit={handleGuardar}
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {/* Foto de perfil */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <FotoPerfilEditable
            foto={foto}
            nombre={datos.nombre}
            size={72}
            onCambiar={onCambiarFoto}
          />
          <div>
            <p className="text-sm font-bold text-gray-800">{datos.nombre}</p>
            <button
              type="button"
              onClick={onCambiarFoto}
              className="text-xs font-semibold mt-1 hover:underline"
              style={{ color: "#E8731A" }}
            >
              Cambiar foto de perfil
            </button>
          </div>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Nombre completo</label>
          <input
            type="text"
            className={inputCls}
            value={datos.nombre}
            onChange={(e) => actualizar("nombre", e.target.value)}
            {...inputFocus}
          />
        </div>

        {/* Email (deshabilitado) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Email</label>
          <input
            type="email"
            className={`${inputCls} bg-gray-50 cursor-not-allowed`}
            value={datos.email}
            disabled
            style={{ borderColor: "#E5E7EB", color: "#9CA3AF" }}
          />
          <p className="text-[10px] text-gray-400">El email no se puede cambiar</p>
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">
            Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
          </label>
          <input
            type="text"
            className={inputCls}
            value={datos.telefono}
            onChange={(e) => actualizar("telefono", e.target.value)}
            placeholder="+54 9 11 0000-0000"
            {...inputFocus}
          />
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Ubicación / Zona</label>
          <input
            type="text"
            className={inputCls}
            value={datos.ubicacion}
            onChange={(e) => actualizar("ubicacion", e.target.value)}
            placeholder="Ej: Palermo, CABA"
            {...inputFocus}
          />
        </div>

        {/* Guardar */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            className="cta-button px-8 py-3 rounded-xl text-white font-semibold text-sm"
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Calendario
───────────────────────────────────────────── */
const ESTADO_DOT: Record<EstadoReserva, string> = {
  confirmada: "#16A34A",
  pendiente:  "#CA8A04",
  cancelada:  "#D1D5DB",
};

function SeccionCalendario({ reservas }: { reservas: Reserva[] }) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const [offset, setOffset]               = useState(0);
  const [diaSeleccionado, setDiaSeleccionado] = useState<string | null>(null);

  const base = new Date(hoy.getFullYear(), hoy.getMonth() + offset, 1);
  const año  = base.getFullYear();
  const mes  = base.getMonth();

  const diasEnMes       = new Date(año, mes + 1, 0).getDate();
  const primerDiaSemana = (new Date(año, mes, 1).getDay() + 6) % 7;

  const celdas: (number | null)[] = [
    ...Array(primerDiaSemana).fill(null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];
  while (celdas.length % 7 !== 0) celdas.push(null);

  function toISO(d: number) {
    return `${año}-${String(mes + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  /* Agrupar reservas por fecha */
  const porFecha = new Map<string, Reserva[]>();
  for (const r of reservas) {
    porFecha.set(r.fecha, [...(porFecha.get(r.fecha) ?? []), r]);
  }

  /* Eventos del mes visible */
  const eventosDelMes = reservas
    .filter((r) => {
      const [a, m] = r.fecha.split("-").map(Number);
      return a === año && m - 1 === mes;
    })
    .sort((a, b) => a.fecha.localeCompare(b.fecha));

  const reservasDelDia = diaSeleccionado ? (porFecha.get(diaSeleccionado) ?? []) : [];

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-800">Mi calendario</h2>

      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Grilla del mes ── */}
        <div
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full max-w-sm flex-shrink-0"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          {/* Navegación */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => { setOffset((o) => o - 1); setDiaSeleccionado(null); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
              style={{ color: "#E8731A" }}
            >
              <IconChevronLeft />
            </button>
            <span className="text-sm font-semibold text-gray-700">
              {MESES[mes]} {año}
            </span>
            <button
              onClick={() => { setOffset((o) => o + 1); setDiaSeleccionado(null); }}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-orange-100 transition-colors"
              style={{ color: "#E8731A" }}
            >
              <IconChevronRight />
            </button>
          </div>

          {/* Cabecera días */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS_CAL.map((d) => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Celdas */}
          <div className="grid grid-cols-7 gap-y-1">
            {celdas.map((day, i) => {
              if (!day) return <div key={i} />;
              const iso          = toISO(day);
              const esFecha      = new Date(año, mes, day);
              const esPasado     = esFecha < hoy;
              const esHoy        = esFecha.getTime() === hoy.getTime();
              const esSeleccionado = diaSeleccionado === iso;
              const reservasHoy  = porFecha.get(iso) ?? [];
              const tieneEventos = reservasHoy.length > 0;

              /* Estados únicos presentes (sin repetir color) */
              const estadosUnicos = [...new Set(reservasHoy.map((r) => r.estado))];

              let ringStyle: React.CSSProperties = {};
              if (esSeleccionado)     ringStyle = { backgroundColor: "#E8731A", color: "#fff" };
              else if (esHoy)         ringStyle = { backgroundColor: "#FFF0E6", color: "#E8731A" };
              else if (esPasado)      ringStyle = { color: "#D1D5DB" };
              else                    ringStyle = { color: "#374151" };

              return (
                <button
                  key={i}
                  onClick={tieneEventos || !esPasado ? () =>
                    setDiaSeleccionado(esSeleccionado ? null : iso) : undefined}
                  className="flex flex-col items-center py-0.5 rounded-xl transition-colors"
                  style={{
                    cursor: tieneEventos ? "pointer" : "default",
                    ...(esSeleccionado ? {} : tieneEventos ? { backgroundColor: esHoy ? "#FFF0E6" : "#F9FAFB" } : {}),
                  }}
                >
                  {/* Número */}
                  <span
                    className="w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors"
                    style={ringStyle}
                  >
                    {day}
                  </span>
                  {/* Dots de estado */}
                  <div className="flex gap-0.5 mt-0.5 h-2 items-center">
                    {estadosUnicos.slice(0, 3).map((est) => (
                      <span
                        key={est}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: ESTADO_DOT[est] }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Leyenda */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4 pt-3 border-t border-gray-100 text-[10px] text-gray-500">
            {[
              { label: "Confirmada", color: "#16A34A" },
              { label: "Pendiente",  color: "#CA8A04" },
              { label: "Cancelada",  color: "#D1D5DB" },
            ].map((l) => (
              <span key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>

        {/* ── Panel lateral ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Día seleccionado */}
          {diaSeleccionado && (
            <div
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {formatearFechaLarga(diaSeleccionado)}
              </p>
              {reservasDelDia.length === 0 ? (
                <p className="text-sm text-gray-400">Sin reservas para este día.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {reservasDelDia.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "#FAFAFA" }}
                    >
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
                      >
                        {r.inicial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{r.proveedor}</p>
                        <p className="text-[11px] text-gray-500">{r.tipoServicio} · {r.precio}</p>
                      </div>
                      <BadgeEstadoReserva estado={r.estado} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Eventos del mes */}
          <div
            className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Eventos en {MESES[mes]}
            </p>
            {eventosDelMes.length === 0 ? (
              <p className="text-sm text-gray-400">No tenés eventos registrados en este mes.</p>
            ) : (
              <div className="flex flex-col divide-y divide-gray-100">
                {eventosDelMes.map((r) => {
                  const esActivo = diaSeleccionado === r.fecha;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setDiaSeleccionado(esActivo ? null : r.fecha)}
                      className="flex items-center gap-3 py-3 text-left transition-colors hover:bg-gray-50 rounded-xl px-2 -mx-2"
                      style={{ backgroundColor: esActivo ? "#FFF0E6" : "transparent" }}
                    >
                      {/* Fecha pill */}
                      <div
                        className="flex-shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center"
                        style={{ backgroundColor: esActivo ? "#E8731A" : "#F3F4F6" }}
                      >
                        <span
                          className="text-[10px] font-semibold leading-none"
                          style={{ color: esActivo ? "#fff" : "#9CA3AF" }}
                        >
                          {MESES[Number(r.fecha.split("-")[1]) - 1].slice(0, 3).toUpperCase()}
                        </span>
                        <span
                          className="text-base font-bold leading-tight"
                          style={{ color: esActivo ? "#fff" : "#374151" }}
                        >
                          {Number(r.fecha.split("-")[2])}
                        </span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{r.proveedor}</p>
                        <p className="text-[11px] text-gray-500">{r.tipoServicio} · {r.precio}</p>
                      </div>
                      <BadgeEstadoReserva estado={r.estado} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Nav items
───────────────────────────────────────────── */
const NAV_ITEMS: { id: Seccion; label: string; icon: React.ReactNode }[] = [
  { id: "resumen",    label: "Resumen",      icon: <IconHome /> },
  { id: "reservas",   label: "Mis reservas", icon: <IconList /> },
  { id: "calendario", label: "Calendario",   icon: <IconCalendarIcon /> },
  { id: "perfil",     label: "Mi perfil",    icon: <IconUser /> },
];

/* ─────────────────────────────────────────────
   Página principal del panel
───────────────────────────────────────────── */
export default function PanelOrganizadorPage() {
  const router = useRouter();
  const [seccion, setSeccion]       = useState<Seccion>("resumen");
  const [reservas, setReservas]     = useState<Reserva[]>(RESERVAS_INICIALES);
  const [toast, setToast]           = useState<{ mensaje: string } | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState(USUARIO_INICIAL.fotoPerfil);
  const [fotoIdx, setFotoIdx]       = useState(0);

  /* ── Protección de ruta: redirigir si no hay sesión ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace("/cuenta");
      }
    });
  }, [router]);

  const pendientesCount = reservas.filter((r) => r.estado === "pendiente").length;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/cuenta");
  }

  function handleCancelar(id: string) {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: "cancelada" } : r)),
    );
    setToast({ mensaje: "Reserva cancelada correctamente" });
  }

  function handleCambiarFoto() {
    const nextIdx = (fotoIdx + 1) % FOTOS_PERFIL_POOL.length;
    setFotoIdx(nextIdx);
    setFotoPerfil(FOTOS_PERFIL_POOL[nextIdx]);
    setToast({ mensaje: "Foto de perfil actualizada" });
  }

  return (
    <div
      className="min-h-screen pt-[50px]"
      style={{ backgroundColor: "#F3F4F6", fontFamily: "var(--font-poppins)" }}
    >
      <div className="flex min-h-[calc(100vh-50px)]">

        {/* ─── Sidebar desktop ─── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-[50px] h-[calc(100vh-50px)] flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
            {/* Avatar + nombre */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <FotoPerfilEditable
                  foto={fotoPerfil}
                  nombre="Valentín Morales"
                  size={40}
                  onCambiar={handleCambiarFoto}
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">Valentín Morales</p>
                  <p className="text-[10px] text-gray-400">Organizador</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <nav className="flex flex-col gap-1 p-3 flex-1">
              {NAV_ITEMS.map((item) => {
                const activo = seccion === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSeccion(item.id)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all"
                    style={{
                      color: activo ? "#E8731A" : "#6B7280",
                      backgroundColor: activo ? "#FFF0E6" : "transparent",
                    }}
                  >
                    {item.icon}
                    {item.label}
                    {item.id === "reservas" && pendientesCount > 0 && (
                      <span
                        className="ml-auto w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: "#E8731A" }}
                      >
                        {pendientesCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Cerrar sesión */}
            <div className="p-3 border-t border-gray-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors text-left"
              >
                <IconLogOut />
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {/* ─── Contenido principal ─── */}
        <div className="flex-1 min-w-0 flex flex-col">

          {/* Tabs mobile */}
          <div className="lg:hidden sticky top-[50px] z-10 bg-white border-b border-gray-200 overflow-x-auto">
            <div className="flex min-w-max">
              {NAV_ITEMS.map((item) => {
                const activo = seccion === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setSeccion(item.id)}
                    className="flex items-center gap-2 px-4 py-3.5 text-xs font-semibold whitespace-nowrap relative transition-colors"
                    style={{ color: activo ? "#E8731A" : "#9CA3AF" }}
                  >
                    {item.icon}
                    {item.label}
                    {item.id === "reservas" && pendientesCount > 0 && (
                      <span
                        className="w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                        style={{ backgroundColor: "#E8731A" }}
                      >
                        {pendientesCount}
                      </span>
                    )}
                    {activo && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ backgroundColor: "#E8731A" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header del panel */}
          <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FotoPerfilEditable
                foto={fotoPerfil}
                nombre="Valentín Morales"
                size={44}
                onCambiar={handleCambiarFoto}
              />
              <div>
                <h1 className="text-lg font-bold text-gray-800">
                  Hola, Valentín 👋
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Panel de organizador</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <IconLogOut />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>

          {/* Sección activa */}
          <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-5xl w-full">
            {seccion === "resumen" && (
              <SeccionResumen reservas={reservas} onNavegar={setSeccion} />
            )}
            {seccion === "reservas" && (
              <SeccionReservas reservas={reservas} onCancelar={handleCancelar} />
            )}
            {seccion === "calendario" && (
              <SeccionCalendario reservas={reservas} />
            )}
            {seccion === "perfil" && (
              <SeccionPerfil
                foto={fotoPerfil}
                onCambiarFoto={handleCambiarFoto}
                onToast={(msg) => setToast({ mensaje: msg })}
              />
            )}
          </main>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          mensaje={toast.mensaje}
          tipo="exito"
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
