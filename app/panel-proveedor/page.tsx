"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase";
import AvatarUpload from "../components/AvatarUpload";

/* ─────────────────────────────────────────────
   Tipos
───────────────────────────────────────────── */
type Seccion = "resumen" | "solicitudes" | "calendario" | "perfil";
type EstadoSolicitud = "pendiente" | "confirmada" | "rechazada";

interface Solicitud {
  id: string;
  cliente: string;
  tipoEvento: string;
  fecha: string; // "YYYY-MM-DD"
  servicio: string;
  precio: string;
  mensaje: string;
  estado: EstadoSolicitud;
}

interface PerfilData {
  nombre:       string;
  descripcion?: string;
  categoria:    string;
  precioTotal:  string;
  precioSena:   string;
  ubicacion?:   string;
  especialidades: string[];
  fotoPerfil?:  string;
}

/* ─────────────────────────────────────────────
   Helpers de mapeo DB → UI
───────────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSolicitudDB(row: any, clienteNombre: string): Solicitud {
  return {
    id:         row.id,
    cliente:    clienteNombre,
    tipoEvento: row.tipo_evento         ?? "–",
    fecha:      row.fecha_evento        ?? "",
    servicio:   row.descripcion_evento  ?? "–",
    precio:     row.precio_servicio     ? `$${row.precio_servicio}` : "–",
    mensaje:    row.descripcion_evento  ?? "–",
    estado:     (row.estado ?? "pendiente") as EstadoSolicitud,
  };
}

const FECHAS_BLOQUEADAS_INICIALES: string[] = [];

const FOTOS_INICIALES_PROVEEDOR: string[] = [];

const FOTOS_NUEVAS_POOL: string[] = [];

const TODAS_ESPECIALIDADES = [
  "Bodas",
  "Fiestas de XV",
  "Eventos empresariales",
  "Cumpleaños",
  "Fiestas privadas",
  "Graduaciones",
  "Baby showers",
  "Aniversarios",
];

const CATEGORIAS = [
  { value: "djs", label: "DJs" },
  { value: "bandas", label: "Bandas" },
  { value: "fotografos-videografos", label: "Fotógrafos / Videógrafos" },
  { value: "catering-chefs", label: "Catering / Chefs" },
  { value: "lugares", label: "Lugares" },
  { value: "organizadores", label: "Organizadores de eventos" },
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
function IconClipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
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
function IconBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
function IconTrendingUp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
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
function IconX() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
function IconLock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}
function IconCamera() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
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
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Badge de estado
───────────────────────────────────────────── */
function BadgeEstado({ estado }: { estado: EstadoSolicitud }) {
  const map: Record<EstadoSolicitud, { bg: string; text: string; label: string; dot: string }> = {
    pendiente:  { bg: "#FEF9C3", text: "#854D0E", label: "Pendiente",  dot: "#CA8A04" },
    confirmada: { bg: "#DCFCE7", text: "#15803D", label: "Confirmada", dot: "#16A34A" },
    rechazada:  { bg: "#FEE2E2", text: "#B91C1C", label: "Rechazada",  dot: "#DC2626" },
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
   Modal — Ver detalle de solicitud
───────────────────────────────────────────── */
function DetalleModal({
  solicitud,
  onClose,
  onAceptar,
  onRechazar,
}: {
  solicitud: Solicitud;
  onClose: () => void;
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
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
      <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ animation: "modalIn 0.2s ease-out" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Detalle de solicitud</h3>
          <button onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
            <IconX />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-800">{solicitud.cliente}</p>
              <p className="text-xs text-gray-500 mt-0.5">{solicitud.tipoEvento}</p>
            </div>
            <BadgeEstado estado={solicitud.estado} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Fecha", value: formatearFechaLarga(solicitud.fecha) },
              { label: "Servicio", value: solicitud.servicio },
              { label: "Precio acordado", value: solicitud.precio },
            ].map((item) => (
              <div key={item.label}
                className="col-span-2 sm:col-span-1 flex flex-col gap-0.5 p-3 rounded-xl bg-gray-50">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{item.label}</span>
                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
              </div>
            ))}
            <div className="col-span-2 p-3 rounded-xl bg-gray-50">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide block mb-1">Mensaje del cliente</span>
              <p className="text-sm text-gray-600 leading-relaxed italic">&ldquo;{solicitud.mensaje}&rdquo;</p>
            </div>
          </div>

          {/* Actions */}
          {solicitud.estado === "pendiente" && (
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { onRechazar(solicitud.id); onClose(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-red-50"
                style={{ borderColor: "#DC2626", color: "#DC2626" }}>
                Rechazar
              </button>
              <button
                onClick={() => { onAceptar(solicitud.id); onClose(); }}
                className="flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
                style={{ backgroundColor: "#15803D" }}>
                Aceptar solicitud
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
   Sección — Resumen (Overview)
───────────────────────────────────────────── */
function SeccionResumen({
  solicitudes,
  onNavegar,
}: {
  solicitudes: Solicitud[];
  onNavegar: (s: Seccion) => void;
}) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const pendientes   = solicitudes.filter((s) => s.estado === "pendiente").length;
  const confirmadas  = solicitudes.filter((s) => s.estado === "confirmada").length;
  const proxEvento   = solicitudes
    .filter((s) => s.estado === "confirmada" && new Date(s.fecha + "T00:00:00") >= hoy)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))[0];

  const metricas = [
    {
      label: "Solicitudes pendientes",
      valor: String(pendientes),
      icono: <IconBell />,
      color: "#E8731A",
      bg: "#FFF0E6",
      accion: () => onNavegar("solicitudes"),
    },
    {
      label: "Reservas confirmadas",
      valor: String(confirmadas),
      icono: <IconCheckCircle />,
      color: "#15803D",
      bg: "#DCFCE7",
      accion: null,
    },
    {
      label: "Próximo evento",
      valor: proxEvento ? formatearFechaCorta(proxEvento.fecha) : "—",
      icono: <IconClock />,
      color: "#6366F1",
      bg: "#EEF2FF",
      accion: proxEvento ? () => onNavegar("calendario") : null,
    },
    {
      label: "Ingresos del mes",
      valor: "$420.000",
      icono: <IconTrendingUp />,
      color: "#0EA5E9",
      bg: "#E0F2FE",
      accion: null,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-800">Resumen</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metricas.map((m) => (
          <button
            key={m.label}
            onClick={m.accion ?? undefined}
            disabled={!m.accion}
            className={`bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4 text-left shadow-sm transition-shadow ${m.accion ? "hover:shadow-md cursor-pointer" : "cursor-default"}`}
          >
            <span
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: m.bg, color: m.color }}
            >
              {m.icono}
            </span>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-2xl font-bold text-gray-800 leading-tight truncate"
                style={{ fontFamily: "var(--font-poppins)" }}>
                {m.valor}
              </span>
              <span className="text-[11px] text-gray-500 leading-snug"
                style={{ fontFamily: "var(--font-poppins)" }}>
                {m.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Acceso rápido */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Acciones rápidas
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => onNavegar("solicitudes")}
            className="cta-button px-5 py-2.5 rounded-xl text-white font-semibold text-sm flex items-center gap-2"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <IconClipboard />
            Ver solicitudes
          </button>
          <button
            onClick={() => onNavegar("calendario")}
            className="px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 border-2 transition-colors hover:bg-gray-50"
            style={{ fontFamily: "var(--font-poppins)", borderColor: "#E5E7EB", color: "#374151" }}
          >
            <IconCalendarIcon />
            Gestionar calendario
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tarjeta de solicitud
───────────────────────────────────────────── */
function SolicitudCard({
  solicitud,
  onAceptar,
  onRechazar,
  onVerDetalle,
}: {
  solicitud: Solicitud;
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
  onVerDetalle: (s: Solicitud) => void;
}) {
  const inicial = solicitud.cliente.charAt(0).toUpperCase();

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 transition-shadow hover:shadow-md"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
          >
            {inicial}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{solicitud.cliente}</p>
            <p className="text-[11px] text-gray-500">{solicitud.tipoEvento}</p>
          </div>
        </div>
        <BadgeEstado estado={solicitud.estado} />
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Fecha", value: formatearFechaCorta(solicitud.fecha) },
          { label: "Precio", value: solicitud.precio },
        ].map((item) => (
          <div key={item.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
              {item.label}
            </span>
            <span className="text-xs font-semibold text-gray-700">{item.value}</span>
          </div>
        ))}
        <div className="col-span-2 flex flex-col gap-0.5">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
            Servicio
          </span>
          <span className="text-xs font-semibold text-gray-700 truncate">{solicitud.servicio}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-gray-100">
        <button
          onClick={() => onVerDetalle(solicitud)}
          className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-orange-50"
          style={{ borderColor: "#E8731A", color: "#E8731A" }}
        >
          Ver detalle
        </button>
        {solicitud.estado === "pendiente" && (
          <>
            <button
              onClick={() => onRechazar(solicitud.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold border transition-colors hover:bg-red-50"
              style={{ borderColor: "#DC2626", color: "#DC2626" }}
            >
              Rechazar
            </button>
            <button
              onClick={() => onAceptar(solicitud.id)}
              className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition-colors"
              style={{ backgroundColor: "#15803D" }}
            >
              Aceptar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Solicitudes
───────────────────────────────────────────── */
function SeccionSolicitudes({
  solicitudes,
  onAceptar,
  onRechazar,
}: {
  solicitudes: Solicitud[];
  onAceptar: (id: string) => void;
  onRechazar: (id: string) => void;
}) {
  const [detalle, setDetalle] = useState<Solicitud | null>(null);
  const [filtro, setFiltro] = useState<EstadoSolicitud | "todas">("todas");

  const filtradas =
    filtro === "todas" ? solicitudes : solicitudes.filter((s) => s.estado === filtro);

  const cuentas = {
    todas: solicitudes.length,
    pendiente: solicitudes.filter((s) => s.estado === "pendiente").length,
    confirmada: solicitudes.filter((s) => s.estado === "confirmada").length,
    rechazada: solicitudes.filter((s) => s.estado === "rechazada").length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-gray-800">Solicitudes de reserva</h2>
        <span className="text-xs text-gray-500" style={{ fontFamily: "var(--font-poppins)" }}>
          {cuentas.pendiente} pendiente{cuentas.pendiente !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Filtro por estado */}
      <div className="flex gap-2 flex-wrap">
        {(["todas", "pendiente", "confirmada", "rechazada"] as const).map((f) => {
          const activo = filtro === f;
          const labels: Record<string, string> = {
            todas: `Todas (${cuentas.todas})`,
            pendiente: `Pendientes (${cuentas.pendiente})`,
            confirmada: `Confirmadas (${cuentas.confirmada})`,
            rechazada: `Rechazadas (${cuentas.rechazada})`,
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
        {filtradas.map((s) => (
          <SolicitudCard
            key={s.id}
            solicitud={s}
            onAceptar={onAceptar}
            onRechazar={onRechazar}
            onVerDetalle={setDetalle}
          />
        ))}
        {filtradas.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-10 text-center text-sm text-gray-400"
            style={{ fontFamily: "var(--font-poppins)" }}>
            No hay solicitudes en este estado.
          </div>
        )}
      </div>

      {detalle && (
        <DetalleModal
          solicitud={detalle}
          onClose={() => setDetalle(null)}
          onAceptar={(id) => { onAceptar(id); setDetalle(null); }}
          onRechazar={(id) => { onRechazar(id); setDetalle(null); }}
        />
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Calendario del proveedor
───────────────────────────────────────────── */
function CalendarioProveedor({
  fechasConfirmadas,
  fechasPendientes,
  fechasBloqueadasManual,
  onToggle,
}: {
  fechasConfirmadas: string[];
  fechasPendientes: string[];
  fechasBloqueadasManual: string[];
  onToggle: (iso: string) => void;
}) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [offset, setOffset] = useState(0);

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

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full max-w-sm">
      {/* Navegación */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setOffset((o) => o - 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-orange-100 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: "#E8731A" }}
        >
          <IconChevronLeft />
        </button>
        <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "var(--font-poppins)" }}>
          {MESES[mes]} {año}
        </span>
        <button
          onClick={() => setOffset((o) => o + 1)}
          disabled={offset >= 4}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-orange-100 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: "#E8731A" }}
        >
          <IconChevronRight />
        </button>
      </div>

      {/* Cabecera días */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS_CAL.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1"
            style={{ fontFamily: "var(--font-poppins)" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Grilla */}
      <div className="grid grid-cols-7 gap-0.5">
        {celdas.map((day, i) => {
          if (!day) return <div key={i} />;
          const iso           = toISO(day);
          const fecha         = new Date(año, mes, day);
          const esPasado      = fecha < hoy;
          const esHoy         = fecha.getTime() === hoy.getTime();
          const esConfirmada  = fechasConfirmadas.includes(iso);
          const esPendiente   = fechasPendientes.includes(iso);
          const esBloqueada   = fechasBloqueadasManual.includes(iso);
          const noClickable   = esPasado || esConfirmada || esPendiente;

          let cellStyle: React.CSSProperties = {};
          let extraCls = "rounded-full text-xs font-medium w-8 h-8 mx-auto flex items-center justify-center transition-colors duration-150";

          if (esPasado)       { cellStyle = { color: "#D1D5DB" }; extraCls += " cursor-default"; }
          else if (esConfirmada) { cellStyle = { backgroundColor: "#FEE2E2", color: "#EF4444" }; extraCls += " cursor-not-allowed"; }
          else if (esPendiente)  { cellStyle = { backgroundColor: "#FEF9C3", color: "#CA8A04" }; extraCls += " cursor-not-allowed"; }
          else if (esBloqueada)  { cellStyle = { backgroundColor: "#F3F4F6", color: "#9CA3AF" }; extraCls += " cursor-pointer hover:bg-green-100 hover:text-green-700"; }
          else if (esHoy)     { cellStyle = { backgroundColor: "#FFF0E6", color: "#E8731A" }; extraCls += " cursor-pointer hover:bg-red-100 hover:text-red-500"; }
          else                { cellStyle = { color: "#374151" }; extraCls += " cursor-pointer hover:bg-red-100 hover:text-red-500"; }

          return (
            <button
              key={i}
              onClick={noClickable ? undefined : () => onToggle(iso)}
              className={extraCls}
              style={{ fontFamily: "var(--font-poppins)", ...cellStyle }}
              title={
                esConfirmada ? "Reserva confirmada — no editable"
                : esPendiente ? "Solicitud pendiente"
                : esBloqueada ? "Bloqueado — click para desbloquear"
                : esPasado ? ""
                : "Disponible — click para bloquear"
              }
            >
              {day}
              {(esConfirmada || esPendiente) && (
                <span className="sr-only">{esConfirmada ? "confirmada" : "pendiente"}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-4 text-[10px] text-gray-500"
        style={{ fontFamily: "var(--font-poppins)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border border-gray-200 inline-block" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-100 inline-block" />
          Pendiente
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-100 inline-block" />
          Confirmado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          Bloqueado
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Calendario
───────────────────────────────────────────── */
function SeccionCalendario({
  fechasConfirmadas,
  fechasPendientes,
  fechasBloqueadasManual,
  onToggle,
}: {
  fechasConfirmadas: string[];
  fechasPendientes: string[];
  fechasBloqueadasManual: string[];
  onToggle: (iso: string) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Mi calendario</h2>
        <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: "var(--font-poppins)" }}>
          Hacé click en una fecha disponible para bloquearla, o en una bloqueada para desbloquearla.
          Las fechas con reservas confirmadas o pendientes no son editables.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <CalendarioProveedor
          fechasConfirmadas={fechasConfirmadas}
          fechasPendientes={fechasPendientes}
          fechasBloqueadasManual={fechasBloqueadasManual}
          onToggle={onToggle}
        />

        {/* Resumen lateral del calendario */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Estado del mes
            </p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Confirmados",       count: fechasConfirmadas.length,     dot: "#EF4444" },
                { label: "Pendientes",        count: fechasPendientes.length,      dot: "#CA8A04" },
                { label: "Bloqueados manual", count: fechasBloqueadasManual.length, dot: "#9CA3AF" },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm"
                  style={{ fontFamily: "var(--font-poppins)" }}>
                  <span className="flex items-center gap-2 text-gray-600 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: row.dot }} />
                    {row.label}
                  </span>
                  <span className="font-semibold text-gray-700 text-xs">{row.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Recordatorio
            </p>
            <div className="flex items-start gap-2 text-xs text-gray-500"
              style={{ fontFamily: "var(--font-poppins)" }}>
              <span className="flex-shrink-0 mt-0.5" style={{ color: "#E8731A" }}>
                <IconLock />
              </span>
              <span className="leading-snug">
                Las fechas con reservas confirmadas solo se liberan si cancelás la reserva desde Solicitudes.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Sección — Perfil editable
───────────────────────────────────────────── */
function SeccionPerfil({
  onToast,
  initialPerfil,
  userId,
  onAvatarUploaded,
}: {
  onToast: (msg: string) => void;
  initialPerfil: PerfilData;
  userId: string;
  onAvatarUploaded: (url: string) => void;
}) {
  const [perfil, setPerfil]     = useState<PerfilData>(initialPerfil);
  const [fotos, setFotos]       = useState<string[]>(FOTOS_INICIALES_PROVEEDOR);
  const [guardando, setGuardando] = useState(false);

  function actualizar<K extends keyof PerfilData>(k: K, v: PerfilData[K]) {
    setPerfil((p) => ({ ...p, [k]: v }));
  }

  function toggleEspecialidad(esp: string) {
    setPerfil((p) => ({
      ...p,
      especialidades: p.especialidades.includes(esp)
        ? p.especialidades.filter((e) => e !== esp)
        : [...p.especialidades, esp],
    }));
  }

  function eliminarFoto(idx: number) {
    setFotos((prev) => prev.filter((_, i) => i !== idx));
  }

  function agregarFoto() {
    if (FOTOS_NUEVAS_POOL.length === 0) {
      onToast("Subida de fotos no disponible en este momento");
      return;
    }
    const nueva = FOTOS_NUEVAS_POOL[fotos.length % FOTOS_NUEVAS_POOL.length];
    setFotos((prev) => [...prev, nueva]);
    onToast("Foto agregada correctamente");
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    const { error } = await supabase
      .from("Profiles")
      .update({
        Nombre:            perfil.nombre,
        categoria_servicio: perfil.categoria,
        precio_servicio:   perfil.precioTotal,
        monto_sena:        perfil.precioSena,
        especialidades:    perfil.especialidades,
      })
      .eq("ID", userId);
    setGuardando(false);
    onToast(error ? "Error al guardar. Intentá de nuevo." : "Perfil actualizado correctamente");
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none transition-all bg-white";
  const inputFocus = {
    onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "#E8731A";
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      e.currentTarget.style.borderColor = "#E5E7EB";
    },
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-bold text-gray-800">Mi perfil</h2>

      {/* ── Datos del perfil ── */}
      <form
        onSubmit={handleGuardar}
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-5"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        {/* Foto de perfil */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100">
          <AvatarUpload
            userId={userId}
            currentUrl={perfil.fotoPerfil ?? ""}
            nombre={perfil.nombre}
            size={72}
            onUploaded={(url) => {
              actualizar("fotoPerfil", url);
              onAvatarUploaded(url);
            }}
          />
          <div>
            <p className="text-sm font-bold text-gray-800">{perfil.nombre}</p>
            <p className="text-xs text-gray-400 mt-0.5">Hacé clic en la foto para cambiarla</p>
          </div>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Nombre / Marca</label>
          <input
            type="text"
            className={inputCls}
            value={perfil.nombre}
            onChange={(e) => actualizar("nombre", e.target.value)}
            {...inputFocus}
          />
        </div>

        {/* Descripción */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Descripción del servicio</label>
          <textarea
            rows={4}
            className={`${inputCls} resize-none`}
            value={perfil.descripcion}
            onChange={(e) => actualizar("descripcion", e.target.value)}
            {...inputFocus}
          />
        </div>

        {/* Categoría */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Categoría de servicio</label>
          <select
            className={`${inputCls} appearance-none`}
            value={perfil.categoria}
            onChange={(e) => actualizar("categoria", e.target.value)}
            {...inputFocus}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Precios */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Precio total del servicio</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
              <input
                type="text"
                className={`${inputCls} pl-7`}
                value={perfil.precioTotal}
                onChange={(e) => actualizar("precioTotal", e.target.value)}
                placeholder="180.000"
                {...inputFocus}
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700">Monto de la seña</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">$</span>
              <input
                type="text"
                className={`${inputCls} pl-7`}
                value={perfil.precioSena}
                onChange={(e) => actualizar("precioSena", e.target.value)}
                placeholder="36.000"
                {...inputFocus}
              />
            </div>
            <p className="text-[10px] text-gray-400">Mínimo $20.000 ARS</p>
          </div>
        </div>

        {/* Ubicación */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700">Ubicación / Zona</label>
          <input
            type="text"
            className={inputCls}
            value={perfil.ubicacion}
            onChange={(e) => actualizar("ubicacion", e.target.value)}
            placeholder="Ej: CABA y GBA Norte"
            {...inputFocus}
          />
        </div>

        {/* Especialidades */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700">Especialidades</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TODAS_ESPECIALIDADES.map((esp) => {
              const activo = perfil.especialidades.includes(esp);
              return (
                <button
                  key={esp}
                  type="button"
                  onClick={() => toggleEspecialidad(esp)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                  style={{
                    borderColor: activo ? "#E8731A" : "#E5E7EB",
                    backgroundColor: activo ? "#FFF0E6" : "#FFFFFF",
                    color: activo ? "#C25E10" : "#6B7280",
                  }}
                >
                  <span
                    className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors"
                    style={{
                      borderColor: activo ? "#E8731A" : "#D1D5DB",
                      backgroundColor: activo ? "#E8731A" : "transparent",
                      color: "white",
                    }}
                  >
                    {activo && <IconCheck size={10} />}
                  </span>
                  {esp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Guardar */}
        <div className="pt-2 border-t border-gray-100 flex justify-end">
          <button
            type="submit"
            disabled={guardando}
            className="cta-button px-8 py-3 rounded-xl text-white font-semibold text-sm disabled:opacity-70"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </form>

      {/* ── Mis fotos / Portfolio ── */}
      <div
        className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col gap-4"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h3 className="text-base font-bold text-gray-800">Mis fotos / Portfolio</h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Las fotos que subas aparecerán en tu perfil público
            </p>
          </div>
          <button
            type="button"
            onClick={agregarFoto}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: "#E8731A" }}
          >
            <IconCamera />
            Agregar foto
          </button>
        </div>

        {fotos.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-sm text-gray-400">
            No tenés fotos cargadas. ¡Agregá algunas para mostrar tu trabajo!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {fotos.map((url, idx) => (
              <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Foto ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Overlay hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-all duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => eliminarFoto(idx)}
                    aria-label="Eliminar foto"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 shadow-lg"
                  >
                    <IconTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-[10px] text-gray-400">
          {fotos.length} foto{fotos.length !== 1 ? "s" : ""} en tu portfolio · La carga real se habilitará próximamente
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Nav items (sidebar + tabs)
───────────────────────────────────────────── */
const NAV_ITEMS: { id: Seccion; label: string; icon: React.ReactNode }[] = [
  { id: "resumen",      label: "Resumen",    icon: <IconHome /> },
  { id: "solicitudes",  label: "Solicitudes",icon: <IconClipboard /> },
  { id: "calendario",   label: "Calendario", icon: <IconCalendarIcon /> },
  { id: "perfil",       label: "Mi perfil",  icon: <IconUser /> },
];

/* ─────────────────────────────────────────────
   Página principal del panel
───────────────────────────────────────────── */
export default function PanelProveedorPage() {
  const router                    = useRouter();
  const { user, loading, signOut } = useAuth();
  const [seccion, setSeccion]     = useState<Seccion>("resumen");
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [perfilData, setPerfilData]   = useState<PerfilData | null>(null);
  const [dbLoading, setDbLoading]     = useState(true);
  const [fechasBloqueadasManual, setFechasBloqueadasManual] = useState<string[]>(
    FECHAS_BLOQUEADAS_INICIALES,
  );
  const [toast, setToast] = useState<{ mensaje: string } | null>(null);

  /* ── Protección de ruta ── */
  useEffect(() => {
    if (!loading && !user) router.replace("/cuenta");
  }, [user, loading, router]);

  /* ── Carga de datos desde Supabase ── */
  useEffect(() => {
    if (loading || !user) return;

    async function fetchData() {
      setDbLoading(true);
      try {
        // 1. Perfil del proveedor
        const { data: profile } = await supabase
          .from("Profiles")
          .select("Nombre, categoria_servicio, precio_servicio, monto_sena, especialidades, descripcion, ubicacion, foto_perfil")
          .eq("ID", user!.id)
          .single();

        if (profile) {
          setPerfilData({
            nombre:      profile.Nombre        ?? "",
            descripcion: profile.descripcion   ?? "",
            categoria:   profile.categoria_servicio ?? "",
            precioTotal: profile.precio_servicio != null ? String(profile.precio_servicio) : "",
            precioSena:  profile.monto_sena     != null ? String(profile.monto_sena)       : "",
            ubicacion:   profile.ubicacion      ?? "",
            especialidades: Array.isArray(profile.especialidades) ? profile.especialidades : [],
            fotoPerfil:  profile.foto_perfil    ?? "",
          });
        }

        // 2. Reservas donde este usuario es el proveedor
        const { data: rows } = await supabase
          .from("reservas")
          .select("*")
          .eq("proveedor_id", user!.id)
          .order("created_at", { ascending: false });

        if (rows && rows.length > 0) {
          // 3. Resolver nombres de clientes
          const clienteIds = [...new Set(rows.map((r: any) => r.usuario_id).filter(Boolean))];
          const { data: clientes } = await supabase
            .from("Profiles")
            .select("ID, Nombre")
            .in("ID", clienteIds);

          const nombreMap: Record<string, string> = {};
          (clientes ?? []).forEach((c: any) => { nombreMap[c.ID] = c.Nombre ?? "Cliente"; });

          setSolicitudes(rows.map((r: any) => mapSolicitudDB(r, nombreMap[r.usuario_id] ?? "Cliente")));
        }
      } finally {
        setDbLoading(false);
      }
    }

    fetchData();
  }, [user, loading]);

  const fechasConfirmadas = solicitudes
    .filter((s) => s.estado === "confirmada")
    .map((s) => s.fecha);
  const fechasPendientes = solicitudes
    .filter((s) => s.estado === "pendiente")
    .map((s) => s.fecha);

  const pendientesCount = solicitudes.filter((s) => s.estado === "pendiente").length;

  async function handleAceptar(id: string) {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: "confirmada" })
      .eq("id", id);

    if (!error) {
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: "confirmada" } : s)),
      );
      setToast({ mensaje: "Solicitud aceptada — reserva confirmada" });
    } else {
      setToast({ mensaje: "Error al aceptar la solicitud" });
    }
  }

  async function handleRechazar(id: string) {
    const { error } = await supabase
      .from("reservas")
      .update({ estado: "rechazada" })
      .eq("id", id);

    if (!error) {
      setSolicitudes((prev) =>
        prev.map((s) => (s.id === id ? { ...s, estado: "rechazada" } : s)),
      );
      setToast({ mensaje: "Solicitud rechazada" });
    } else {
      setToast({ mensaje: "Error al rechazar la solicitud" });
    }
  }

  function handleToggleFecha(iso: string) {
    if (fechasConfirmadas.includes(iso) || fechasPendientes.includes(iso)) return;
    setFechasBloqueadasManual((prev) =>
      prev.includes(iso) ? prev.filter((f) => f !== iso) : [...prev, iso],
    );
  }

  /* ── Pantalla de carga ── */
  if (loading || dbLoading) {
    return (
      <div className="min-h-screen pt-[50px] flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Cargando tu panel…</p>
        </div>
      </div>
    );
  }

  const nombreMostrar = perfilData?.nombre ?? user?.email ?? "Proveedor";
  const inicialMostrar = nombreMostrar[0]?.toUpperCase() ?? "P";

  return (
    <div
      className="min-h-screen pt-[50px]"
      style={{ backgroundColor: "#F3F4F6", fontFamily: "var(--font-poppins)" }}
    >
      <div className="flex min-h-[calc(100vh-50px)]">

        {/* ─── Sidebar desktop ─── */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div
            className="sticky top-[50px] h-[calc(100vh-50px)] flex flex-col bg-white border-r border-gray-200 overflow-y-auto"
          >
            {/* Avatar + nombre */}
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
                >
                  {inicialMostrar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{nombreMostrar}</p>
                  <p className="text-[10px] text-gray-400">Proveedor verificado</p>
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all relative"
                    style={{
                      color: activo ? "#E8731A" : "#6B7280",
                      backgroundColor: activo ? "#FFF0E6" : "transparent",
                    }}
                  >
                    {item.icon}
                    {item.label}
                    {item.id === "solicitudes" && pendientesCount > 0 && (
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
                onClick={signOut}
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
                    {item.id === "solicitudes" && pendientesCount > 0 && (
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
            <div>
              <h1 className="text-lg font-bold text-gray-800">
                Hola, {nombreMostrar.split(" ")[0]} 🎧
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">{nombreMostrar} · Panel de proveedor</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <IconLogOut />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>

          {/* Sección activa */}
          <main className="flex-1 p-5 sm:p-6 lg:p-8 max-w-5xl w-full">
            {seccion === "resumen" && (
              <SeccionResumen solicitudes={solicitudes} onNavegar={setSeccion} />
            )}
            {seccion === "solicitudes" && (
              <SeccionSolicitudes
                solicitudes={solicitudes}
                onAceptar={handleAceptar}
                onRechazar={handleRechazar}
              />
            )}
            {seccion === "calendario" && (
              <SeccionCalendario
                fechasConfirmadas={fechasConfirmadas}
                fechasPendientes={fechasPendientes}
                fechasBloqueadasManual={fechasBloqueadasManual}
                onToggle={handleToggleFecha}
              />
            )}
            {seccion === "perfil" && perfilData && (
              <SeccionPerfil
                initialPerfil={perfilData}
                userId={user!.id}
                onToast={(msg) => setToast({ mensaje: msg })}
                onAvatarUploaded={(url) =>
                  setPerfilData((prev) => prev ? { ...prev, fotoPerfil: url } : prev)
                }
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
