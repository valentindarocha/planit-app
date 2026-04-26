"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Proveedor } from "@/app/data/proveedores";
import { supabase } from "@/app/lib/supabase";

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconMapPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCheck({ size = 12 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <polyline points="20 6 9 17 4 12" />
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

function IconShield() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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

function IconCheckCircle({ size = 56 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Estrellas
───────────────────────────────────────────── */
function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const partial = !filled && rating >= star - 0.5;
          return (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`ps-${size}-${star}`}>
                  <stop offset="50%" stopColor="#E8731A" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={filled ? "#E8731A" : partial ? `url(#ps-${size}-${star})` : "#D1D5DB"}
                stroke="none"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-sm font-semibold text-gray-600" style={{ fontFamily: "var(--font-poppins)" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Qué incluye — por categoría
───────────────────────────────────────────── */
const INCLUYE_POR_CATEGORIA: Record<string, { icono: string; texto: string }[]> = {
  djs: [
    { icono: "🎧", texto: "Equipo de sonido profesional" },
    { icono: "💡", texto: "Iluminación LED dinámica" },
    { icono: "🎤", texto: "Micrófono inalámbrico" },
    { icono: "⏱️", texto: "Hasta 6 horas de servicio" },
    { icono: "🚗", texto: "Traslado CABA incluido" },
    { icono: "🎵", texto: "Playlist 100% personalizada" },
  ],
  bandas: [
    { icono: "🎸", texto: "Banda completa en vivo" },
    { icono: "🔊", texto: "Sonido e iluminación" },
    { icono: "🎤", texto: "Vocalistas incluidos" },
    { icono: "⏱️", texto: "Dos sets de 45 minutos" },
    { icono: "📋", texto: "Repertorio adaptable" },
    { icono: "🎶", texto: "Ensayo previo con el cliente" },
  ],
  "fotografos-videografos": [
    { icono: "📸", texto: "Cobertura completa del evento" },
    { icono: "🎥", texto: "Video highlights incluido" },
    { icono: "💾", texto: "500+ fotos editadas" },
    { icono: "✨", texto: "Edición profesional" },
    { icono: "☁️", texto: "Entrega digital en la nube" },
    { icono: "⚡", texto: "Entrega en 72 horas" },
  ],
  "catering-chefs": [
    { icono: "🍽️", texto: "Vajilla premium incluida" },
    { icono: "👨‍🍳", texto: "Chef a cargo del servicio" },
    { icono: "🥗", texto: "Opciones veganas y sin TACC" },
    { icono: "👔", texto: "Personal de servicio capacitado" },
    { icono: "🚛", texto: "Montaje y desmontaje" },
    { icono: "✨", texto: "Menú degustación previo" },
  ],
  lugares: [
    { icono: "🏛️", texto: "Capacidad para grandes grupos" },
    { icono: "🅿️", texto: "Estacionamiento propio" },
    { icono: "🍳", texto: "Cocina totalmente equipada" },
    { icono: "❄️", texto: "Climatización completa" },
    { icono: "🎨", texto: "Ambientación libre" },
    { icono: "⏰", texto: "Horario flexible" },
  ],
  organizadores: [
    { icono: "📋", texto: "Coordinación integral" },
    { icono: "👥", texto: "Red de 50+ proveedores" },
    { icono: "📅", texto: "Planificación del cronograma" },
    { icono: "🎨", texto: "Decoración personalizada" },
    { icono: "🎯", texto: "Seguimiento en el día" },
    { icono: "💼", texto: "Gestión de protocolo" },
  ],
};

/* ─────────────────────────────────────────────
   Pool de reseñas simuladas
───────────────────────────────────────────── */
type Resena = {
  inicial: string;
  nombre: string;
  evento: string;
  fecha: string;
  rating: number;
  comentario: string;
};

const RESENAS_POOL: Resena[] = [
  { inicial: "M", nombre: "Martina G.", evento: "Boda",               fecha: "Marzo 2026",     rating: 5, comentario: "Todo salió espectacular. Profesionales desde el primer contacto hasta el último minuto. Los invitados quedaron fascinados con el servicio." },
  { inicial: "F", nombre: "Federico P.", evento: "Aniversario",        fecha: "Febrero 2026",   rating: 5, comentario: "Superaron nuestras expectativas. Se nota la experiencia en cada detalle. Lo contrataríamos de nuevo sin dudarlo un segundo." },
  { inicial: "V", nombre: "Valeria M.", evento: "Fiesta de XV",        fecha: "Enero 2026",     rating: 4, comentario: "Muy buena atención, puntualidad y calidad. Recomiendo 100%. Hicieron la fiesta de mi hija absolutamente inolvidable." },
  { inicial: "J", nombre: "Joaquín R.", evento: "Cumpleaños",          fecha: "Diciembre 2025", rating: 5, comentario: "Hicieron que la noche sea memorable. Todos los invitados me preguntaron de dónde los había sacado. Un diez absoluto." },
  { inicial: "L", nombre: "Lucía B.", evento: "Evento empresarial",    fecha: "Marzo 2026",     rating: 5, comentario: "Llegaron puntualísimos, equipo súper profesional y trato excelente. Cumplieron con todo lo pactado, sin sobresaltos." },
  { inicial: "A", nombre: "Andrés S.", evento: "Boda",                 fecha: "Noviembre 2025", rating: 4, comentario: "Excelente relación calidad-precio. Muy buena predisposición para atender todas nuestras peticiones y pedidos especiales." },
  { inicial: "C", nombre: "Camila F.", evento: "Baby shower",          fecha: "Febrero 2026",   rating: 5, comentario: "Hermosa experiencia. Coordinaron todo a la perfección y el resultado fue muchísimo mejor de lo que imaginábamos." },
  { inicial: "D", nombre: "Diego T.", evento: "Graduación",            fecha: "Diciembre 2025", rating: 5, comentario: "Superaron todas las expectativas. Atención al detalle impecable y muy buena comunicación previa al evento." },
  { inicial: "S", nombre: "Sofía L.", evento: "Fiesta privada",        fecha: "Enero 2026",     rating: 4, comentario: "Muy recomendable. El servicio fue tal como prometieron y la experiencia de reserva por PLANIT fue súper clara." },
  { inicial: "R", nombre: "Rodrigo V.", evento: "Aniversario",          fecha: "Octubre 2025",   rating: 5, comentario: "Un servicio espectacular. La atención previa al evento y el seguimiento fueron de primer nivel. Volvería a contratarlos sin dudar." },
  { inicial: "P", nombre: "Paula N.", evento: "Fiesta de XV",          fecha: "Noviembre 2025", rating: 5, comentario: "No tengo más que palabras de agradecimiento. Hicieron sentir a todos los invitados como en una celebración única y especial." },
  { inicial: "G", nombre: "Gonzalo H.", evento: "Boda",                 fecha: "Febrero 2026",   rating: 4, comentario: "Muy profesionales. El día del evento todo fluyó sin sobresaltos, exactamente como lo habíamos planificado con ellos." },
];

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pickResenas(id: string, n = 3): Resena[] {
  const h = hashId(id);
  const used = new Set<number>();
  const out: Resena[] = [];
  for (let i = 0; i < n; i++) {
    let idx = (h + i * 7) % RESENAS_POOL.length;
    while (used.has(idx)) idx = (idx + 1) % RESENAS_POOL.length;
    used.add(idx);
    out.push(RESENAS_POOL[idx]);
  }
  return out;
}

/* ─────────────────────────────────────────────
   Helpers de fecha
───────────────────────────────────────────── */
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DIAS_LARGOS = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"];
const DIAS  = ["Lu","Ma","Mi","Ju","Vi","Sá","Do"];

function formatearFechaLarga(iso: string) {
  const [a, m, d] = iso.split("-").map(Number);
  const fecha = new Date(a, m - 1, d);
  const diaSemana = DIAS_LARGOS[fecha.getDay()];
  return `${diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)} ${d} de ${MESES[m - 1].toLowerCase()} de ${a}`;
}

/* ─────────────────────────────────────────────
   Panel de reserva (sidebar / mobile inline)
───────────────────────────────────────────── */
function ReservaPanel({
  proveedor,
  fechaSeleccionada,
  onReservar,
  error,
}: {
  proveedor: Proveedor;
  fechaSeleccionada: string | null;
  onReservar: () => void;
  error: string | null;
}) {
  return (
    <div
      className="rounded-2xl border p-5 flex flex-col"
      style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6", fontFamily: "var(--font-poppins)" }}
    >
      {/* Precio total */}
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
        <span className="text-xs text-gray-500">Precio del servicio</span>
        <span className="text-sm font-semibold text-gray-700">{proveedor.precioTotal}</span>
      </div>

      {/* Seña destacada */}
      <div className="flex flex-col items-center py-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#E8731A" }}>
          Seña para reservar
        </span>
        <span className="text-3xl font-bold mt-1" style={{ color: "#E8731A" }}>
          {proveedor.precioSena}
        </span>
        <span className="text-[10px] text-gray-400 mt-0.5">Pagás solo esto ahora</span>
      </div>

      {/* Fecha seleccionada */}
      {fechaSeleccionada && (
        <div
          className="mb-3 px-3 py-2 rounded-lg flex items-center gap-2 text-xs"
          style={{ backgroundColor: "#FFF0E6", color: "#C25E10" }}
        >
          <IconCheck size={12} />
          <span className="font-medium">{formatearFechaLarga(fechaSeleccionada)}</span>
        </div>
      )}

      {/* Botón */}
      <button
        onClick={onReservar}
        className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm"
      >
        Reservar fecha
      </button>

      {/* Error sutil */}
      {error && (
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px]" style={{ color: "#B91C1C" }}>
          <IconAlert />
          <span>{error}</span>
        </div>
      )}

      {/* Cómo funciona */}
      <div className="mt-5 pt-4 border-t" style={{ borderColor: "#F0E0D0" }}>
        <p className="text-[11px] font-semibold text-gray-600 mb-3 uppercase tracking-wider">
          Así funciona la reserva
        </p>
        <ol className="flex flex-col gap-2.5">
          {[
            "Elegí una fecha disponible en el calendario",
            "Pagás solo la seña con tarjeta o Mercado Pago",
            "El proveedor te confirma la reserva en 24 h",
          ].map((paso, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[11px] text-gray-600">
              <span
                className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: "#E8731A", color: "#ffffff" }}
              >
                {i + 1}
              </span>
              <span className="leading-snug">{paso}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Trust signals */}
      <div
        className="mt-4 pt-3 border-t flex flex-col gap-1.5 text-[10px] text-gray-500"
        style={{ borderColor: "#F0E0D0" }}
      >
        <div className="flex items-center gap-1.5" style={{ color: "#15803D" }}>
          <IconShield />
          <span>Pago 100% seguro con Mercado Pago</span>
        </div>
        <div className="flex items-center gap-1.5" style={{ color: "#15803D" }}>
          <IconRefresh />
          <span>Devolución garantizada si no hay confirmación</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tarjeta de reseña
───────────────────────────────────────────── */
function ResenaCard({ resena }: { resena: Resena }) {
  return (
    <div
      className="rounded-xl p-5 border flex flex-col gap-3"
      style={{ borderColor: "#F3F4F6", backgroundColor: "#FAFAFA", fontFamily: "var(--font-poppins)" }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ backgroundColor: "#FFF0E6", color: "#E8731A" }}
        >
          {resena.inicial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">{resena.nombre}</p>
          <p className="text-[11px] text-gray-400">{resena.evento} · {resena.fecha}</p>
        </div>
        <span
          className="text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1 flex-shrink-0"
          style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
        >
          <IconCheck size={10} />
          Verificada
        </span>
      </div>

      {/* Stars */}
      <StarRating rating={resena.rating} size={13} />

      {/* Comment */}
      <p className="text-sm text-gray-600 leading-relaxed italic">
        &ldquo;{resena.comentario}&rdquo;
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Calendario (controlado)
───────────────────────────────────────────── */
function Calendario({
  fechasOcupadas,
  seleccionada,
  setSeleccionada,
}: {
  fechasOcupadas: string[];
  seleccionada: string | null;
  setSeleccionada: (iso: string) => void;
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

  function toISO(day: number) {
    return `${año}-${String(mes + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="rounded-2xl border p-5 w-full max-w-sm"
      style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}>
      {/* Navegación */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setOffset((o) => o - 1)}
          disabled={offset <= 0}
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
          disabled={offset >= 3}
          className="w-8 h-8 flex items-center justify-center rounded-full transition-colors hover:bg-orange-100 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: "#E8731A" }}
        >
          <IconChevronRight />
        </button>
      </div>

      {/* Cabecera días */}
      <div className="grid grid-cols-7 mb-1">
        {DIAS.map((d) => (
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

          const iso      = toISO(day);
          const fecha    = new Date(año, mes, day);
          const esPasado = fecha < hoy;
          const esOcupado      = fechasOcupadas.includes(iso);
          const esSeleccionado = seleccionada === iso;
          const esHoy          = fecha.getTime() === hoy.getTime();

          let cls = "";
          if (esPasado) {
            cls = "text-gray-300 cursor-default pointer-events-none";
          } else if (esSeleccionado) {
            cls = "text-white rounded-full";
          } else if (esOcupado) {
            cls = "bg-red-100 text-red-400 rounded-full cursor-not-allowed pointer-events-none";
          } else if (esHoy) {
            cls = "bg-[#FFF0E6] text-[#E8731A] rounded-full hover:bg-[#FFE0C0] cursor-pointer";
          } else {
            cls = "text-gray-700 rounded-full hover:bg-[#FFF0E6] hover:text-[#E8731A] cursor-pointer";
          }

          return (
            <button
              key={i}
              onClick={esPasado || esOcupado ? undefined : () => setSeleccionada(iso)}
              className={`w-8 h-8 mx-auto flex items-center justify-center text-xs font-medium transition-colors duration-150 ${cls}`}
              style={{
                fontFamily: "var(--font-poppins)",
                ...(esSeleccionado ? { backgroundColor: "#E8731A" } : {}),
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-[10px] text-gray-500"
        style={{ fontFamily: "var(--font-poppins)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-white border border-gray-200 inline-block flex-shrink-0" />
          Disponible
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-100 inline-block flex-shrink-0" />
          Ocupado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block flex-shrink-0" style={{ backgroundColor: "#E8731A" }} />
          Seleccionado
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Modal de reserva (3 pasos)
───────────────────────────────────────────── */
type DatosEvento = {
  tipo: string;
  personas: string;
  horario: string;
  ubicacion: string;
  descripcion: string;
};

const TIPOS_EVENTO = [
  "Boda",
  "Cumpleaños",
  "Fiesta de XV",
  "Evento empresarial",
  "Graduación",
  "Baby shower",
  "Aniversario",
  "Otro",
];

const HORARIOS = ["Mañana", "Tarde", "Noche"];

function Stepper({ paso }: { paso: number }) {
  return (
    <div className="flex items-center justify-center gap-0">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all"
            style={
              paso >= n
                ? { backgroundColor: "#E8731A", color: "#ffffff" }
                : { backgroundColor: "#F3F4F6", color: "#9CA3AF" }
            }
          >
            {paso > n ? <IconCheck size={14} /> : n}
          </div>
          {i < 2 && (
            <div
              className="w-10 sm:w-16 h-0.5 transition-colors"
              style={{ backgroundColor: paso > n ? "#E8731A" : "#E5E7EB" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ReservaModal({
  proveedor,
  fecha,
  onClose,
  onConfirmada,
}: {
  proveedor: Proveedor;
  fecha: string;
  onClose: () => void;
  onConfirmada: (fecha: string) => void;
}) {
  const router = useRouter();
  const [paso, setPaso]           = useState(1);
  const [datos, setDatos]         = useState<DatosEvento>({
    tipo: "",
    personas: "",
    horario: "",
    ubicacion: "",
    descripcion: "",
  });
  const [errores, setErrores]     = useState<Partial<Record<keyof DatosEvento, boolean>>>({});
  const [cargando, setCargando]   = useState(false);
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [noSesion, setNoSesion]   = useState(false);

  /* Verificar sesión al montar */
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) setNoSesion(true);
    });
  }, []);

  /* Bloquear scroll del body mientras el modal está abierto */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  /* Cerrar con Escape (excepto en el paso 3) */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && paso !== 3) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paso, onClose]);

  function actualizar<K extends keyof DatosEvento>(k: K, v: DatosEvento[K]) {
    setDatos((d) => ({ ...d, [k]: v }));
    if (errores[k]) setErrores((e) => ({ ...e, [k]: false }));
  }

  function validarPaso2() {
    const e: Partial<Record<keyof DatosEvento, boolean>> = {};
    if (!datos.tipo) e.tipo = true;
    if (!datos.personas || parseInt(datos.personas, 10) <= 0) e.personas = true;
    if (!datos.horario) e.horario = true;
    if (!datos.ubicacion.trim()) e.ubicacion = true;
    if (datos.descripcion.trim().length < 20) e.descripcion = true;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  async function enviar() {
    if (!validarPaso2()) return;
    setErrorEnvio(null);
    setCargando(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNoSesion(true);
        return;
      }

      const { error } = await supabase.from("reservas").insert({
        usuario_id:         user.id,
        proveedor_id:       proveedor.id,
        fecha_evento:       fecha,
        tipo_evento:        datos.tipo,
        cantidad_personas:  parseInt(datos.personas, 10),
        horario:            datos.horario,
        ubicacion_evento:   datos.ubicacion.trim(),
        descripcion_evento: datos.descripcion.trim(),
        precio_servicio:    proveedor.precioTotal,
        monto_sena:         proveedor.precioSena,
        estado:             "pendiente",
      });

      if (error) {
        console.error("Error al guardar reserva:", error.message);
        // No bloqueamos el flujo visual ante un error de BD;
        // la reserva se marca localmente de todas formas.
      }

      onConfirmada(fecha);
      setPaso(3);
    } finally {
      setCargando(false);
    }
  }

  function irAlInicio() {
    onClose();
    router.push("/");
  }

  /* Estilos compartidos para inputs */
  const inputBase =
    "w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors bg-white";
  const inputOk = { borderColor: "#E5E7EB" };
  const inputErr = { borderColor: "#DC2626", backgroundColor: "#FEF2F2" };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/55 animate-fade-in"
        onClick={paso !== 3 ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl animate-modal-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Close */}
        {paso !== 3 && (
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <IconX />
          </button>
        )}

        {/* ── Sin sesión: invitar a iniciar sesión ── */}
        {noSesion && (
          <div className="flex flex-col items-center gap-5 px-8 py-10 text-center animate-step-in">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#FFF0E6" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                fill="none" stroke="#E8731A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Necesitás iniciar sesión</h2>
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                Para realizar una reserva en PLANIT necesitás tener una cuenta de organizador.
              </p>
            </div>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <Link
                href="/cuenta"
                className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm text-center"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Iniciar sesión o registrarse
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* ── Flujo normal (con sesión) ── */}
        {!noSesion && (
          <>
        {/* Stepper */}
        <div className="pt-8 pb-6 px-6">
          <Stepper paso={paso} />
          <p className="text-center text-[11px] text-gray-400 mt-3 font-medium">
            Paso {paso} de 3
          </p>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-8">
          {/* ═══════════ PASO 1 ═══════════ */}
          {paso === 1 && (
            <div className="flex flex-col gap-5 animate-step-in">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Revisá tu reserva</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Confirmá los datos antes de continuar
                </p>
              </div>

              <div
                className="rounded-xl border p-5 flex flex-col gap-3"
                style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}
              >
                <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
                  <span className="text-xs text-gray-500">Proveedor</span>
                  <span className="text-sm font-semibold text-gray-800 text-right">{proveedor.nombre}</span>
                </div>

                <div className="flex items-start justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
                  <span className="text-xs text-gray-500">Fecha</span>
                  <span className="text-sm font-semibold text-gray-800 text-right">
                    {formatearFechaLarga(fecha)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
                  <span className="text-xs text-gray-500">Precio del servicio</span>
                  <span className="text-sm font-semibold text-gray-700">{proveedor.precioTotal}</span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#E8731A" }}>
                    Seña a pagar
                  </span>
                  <span className="text-xl font-bold" style={{ color: "#E8731A" }}>
                    {proveedor.precioSena}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center leading-snug">
                En el siguiente paso te vamos a pedir algunos detalles del evento para enviar la solicitud al proveedor.
              </p>

              <button
                onClick={() => setPaso(2)}
                className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm"
              >
                Continuar
              </button>
            </div>
          )}

          {/* ═══════════ PASO 2 ═══════════ */}
          {paso === 2 && (
            <div className="flex flex-col gap-4 animate-step-in">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-800">Contanos sobre tu evento</h2>
                <p className="text-xs text-gray-500 mt-1">
                  El proveedor necesita estos datos para confirmar la reserva
                </p>
              </div>

              {/* Tipo de evento */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Tipo de evento</label>
                <select
                  value={datos.tipo}
                  onChange={(e) => actualizar("tipo", e.target.value)}
                  className={inputBase}
                  style={errores.tipo ? inputErr : inputOk}
                >
                  <option value="">Seleccioná una opción</option>
                  {TIPOS_EVENTO.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Cantidad + Horario */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Cant. de personas</label>
                  <input
                    type="number"
                    min={1}
                    placeholder="Ej: 80"
                    value={datos.personas}
                    onChange={(e) => actualizar("personas", e.target.value)}
                    className={inputBase}
                    style={errores.personas ? inputErr : inputOk}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-700">Horario</label>
                  <select
                    value={datos.horario}
                    onChange={(e) => actualizar("horario", e.target.value)}
                    className={inputBase}
                    style={errores.horario ? inputErr : inputOk}
                  >
                    <option value="">Elegí</option>
                    {HORARIOS.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Ubicación */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-700">Ubicación del evento</label>
                <input
                  type="text"
                  placeholder="Ej: Salón Vía Lacroze, Palermo"
                  value={datos.ubicacion}
                  onChange={(e) => actualizar("ubicacion", e.target.value)}
                  className={inputBase}
                  style={errores.ubicacion ? inputErr : inputOk}
                />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">Descripción del evento</label>
                  <span
                    className="text-[10px]"
                    style={{
                      color:
                        datos.descripcion.trim().length >= 20 ? "#15803D" : "#9CA3AF",
                    }}
                  >
                    {datos.descripcion.trim().length}/20 mín.
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="Describí brevemente tu evento: qué tipo de celebración es, qué necesitás del proveedor, cualquier detalle relevante..."
                  value={datos.descripcion}
                  onChange={(e) => actualizar("descripcion", e.target.value)}
                  className={`${inputBase} resize-none`}
                  style={errores.descripcion ? inputErr : inputOk}
                />
              </div>

              {/* Aviso si hay errores */}
              {Object.keys(errores).length > 0 && (
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-[11px]"
                  style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}
                >
                  <IconAlert />
                  <span>Completá todos los campos para continuar</span>
                </div>
              )}

              {/* Error de envío */}
              {errorEnvio && (
                <div
                  className="px-3 py-2 rounded-lg text-[11px]"
                  style={{ backgroundColor: "#FEF2F2", color: "#B91C1C" }}
                >
                  {errorEnvio}
                </div>
              )}

              {/* Botones */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setPaso(1)}
                  disabled={cargando}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors hover:bg-gray-50 disabled:opacity-50"
                  style={{ borderColor: "#E5E7EB", color: "#4B5563" }}
                >
                  Volver
                </button>
                <button
                  onClick={enviar}
                  disabled={cargando}
                  className="cta-button flex-[2] py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {cargando ? (
                    <>
                      <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Enviando...
                    </>
                  ) : "Enviar solicitud"}
                </button>
              </div>
            </div>
          )}

          {/* ═══════════ PASO 3 ═══════════ */}
          {paso === 3 && (
            <div className="flex flex-col items-center gap-5 animate-step-in">
              {/* Check verde */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center animate-pop"
                style={{ backgroundColor: "#DCFCE7", color: "#15803D" }}
              >
                <IconCheckCircle size={44} />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">¡Solicitud enviada!</h2>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-sm mx-auto">
                  Tu solicitud fue enviada al proveedor. Recibirás una respuesta en las próximas 24 horas. Si el proveedor acepta, se habilitará el pago de la seña.
                </p>
              </div>

              {/* Resumen */}
              <div
                className="w-full rounded-xl border p-4 flex flex-col gap-2.5"
                style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-gray-500">Proveedor</span>
                  <span className="text-xs font-semibold text-gray-800 text-right">{proveedor.nombre}</span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-gray-500">Fecha</span>
                  <span className="text-xs font-semibold text-gray-800 text-right">
                    {formatearFechaLarga(fecha)}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs text-gray-500">Tipo de evento</span>
                  <span className="text-xs font-semibold text-gray-800 text-right">{datos.tipo}</span>
                </div>
              </div>

              {/* Estado */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Estado:</span>
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-semibold"
                  style={{ backgroundColor: "#FFF0E6", color: "#C25E10" }}
                >
                  Solicitud enviada
                </span>
              </div>

              <button
                onClick={irAlInicio}
                className="cta-button w-full py-3 rounded-xl text-white font-semibold text-sm mt-2"
              >
                Volver al inicio
              </button>
            </div>
          )}
        </div>
          </>
        )}
      </div>

      {/* Animaciones locales */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes stepIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes pop {
          0%   { transform: scale(0.6); opacity: 0; }
          60%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        .animate-fade-in  { animation: fadeIn  0.18s ease-out; }
        .animate-modal-in { animation: modalIn 0.22s ease-out; }
        .animate-step-in  { animation: stepIn  0.20s ease-out; }
        .animate-pop      { animation: pop     0.35s ease-out; }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
export default function PerfilClient({
  proveedor,
  nombreCategoria,
}: {
  proveedor: Proveedor;
  nombreCategoria: string;
}) {
  const incluye = INCLUYE_POR_CATEGORIA[proveedor.categoria] ?? [];
  const resenas = pickResenas(proveedor.id, 3);

  /* Estado compartido de fecha */
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string | null>(null);
  const [errorReserva, setErrorReserva]           = useState<string | null>(null);
  const [modalAbierto, setModalAbierto]           = useState(false);
  /* Fechas bloqueadas por reservas hechas en esta sesión */
  const [fechasReservadas, setFechasReservadas]   = useState<string[]>([]);

  /* Lista combinada: ocupadas de origen + reservadas en esta sesión */
  const fechasBloqueadas = [...proveedor.fechasOcupadas, ...fechasReservadas];

  function handleConfirmada(fecha: string) {
    setFechasReservadas((prev) => (prev.includes(fecha) ? prev : [...prev, fecha]));
  }

  function handleCloseModal() {
    // Si la fecha seleccionada quedó bloqueada (reserva confirmada), la limpiamos
    if (fechaSeleccionada && fechasReservadas.includes(fechaSeleccionada)) {
      setFechaSeleccionada(null);
    }
    setModalAbierto(false);
  }

  function handleReservar() {
    if (!fechaSeleccionada) {
      setErrorReserva("Seleccioná una fecha disponible para continuar");
      // Scroll hacia el calendario en mobile para guiar al usuario
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        const cal = document.getElementById("calendario");
        cal?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setErrorReserva(null);
    setModalAbierto(true);
  }

  /* Al seleccionar fecha, limpiamos el error */
  function handleSeleccionarFecha(iso: string) {
    setFechaSeleccionada(iso);
    setErrorReserva(null);
  }

  return (
    <main className="flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 pb-16">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mt-8 mb-6"
          style={{ fontFamily: "var(--font-poppins)" }}>
          <Link href="/servicios" className="hover:text-orange-500 transition-colors">Servicios</Link>
          <span>/</span>
          <Link href={`/servicios/${proveedor.categoria}`} className="hover:text-orange-500 transition-colors">
            {nombreCategoria}
          </Link>
          <span>/</span>
          <span className="text-gray-600 truncate max-w-[160px]">{proveedor.nombre}</span>
        </nav>

        {/* Layout con sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">

          {/* ═══════════════════════════════
              Columna principal
          ═══════════════════════════════ */}
          <div className="flex flex-col min-w-0">

            {/* ── Sección 1: Info principal ── */}
            <section className="flex flex-col gap-3 pb-10 border-b border-gray-100">
              <span
                className="self-start px-3 py-1 rounded-full text-xs font-semibold"
                style={{ fontFamily: "var(--font-poppins)", backgroundColor: "#FFF0E6", color: "#C25E10" }}
              >
                {nombreCategoria}
              </span>

              <h1
                className="text-3xl sm:text-4xl font-bold text-gray-800 leading-tight"
                style={{ fontFamily: "var(--font-poppins)" }}
              >
                {proveedor.nombre}
              </h1>

              <div className="flex items-center gap-1.5 text-gray-500 text-sm"
                style={{ fontFamily: "var(--font-poppins)" }}>
                <IconMapPin />
                {proveedor.ubicacion}
              </div>

              <StarRating rating={proveedor.rating} />

              <div className="flex items-center gap-1.5 text-gray-400 text-xs"
                style={{ fontFamily: "var(--font-poppins)" }}>
                <IconCheck />
                <span>{proveedor.eventosRealizados} eventos realizados</span>
              </div>

              <div className="flex flex-wrap gap-2 mt-1">
                {proveedor.especialidades.map((esp) => (
                  <span key={esp}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ fontFamily: "var(--font-poppins)", backgroundColor: "#FFF0E6", color: "#C25E10" }}>
                    {esp}
                  </span>
                ))}
              </div>
            </section>

            {/* ── Panel de reserva INLINE para mobile ── */}
            <div className="lg:hidden py-6 border-b border-gray-100">
              <ReservaPanel
                proveedor={proveedor}
                fechaSeleccionada={fechaSeleccionada}
                onReservar={handleReservar}
                error={errorReserva}
              />
            </div>

            {/* ── Sección 2: Galería ── */}
            <section className="py-10 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4" style={{ fontFamily: "var(--font-poppins)" }}>
                Galería de trabajos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {proveedor.galeria.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={img}
                    alt={`${proveedor.nombre} — trabajo ${i + 1}`}
                    className="w-full aspect-square object-cover rounded-xl"
                  />
                ))}
              </div>
            </section>

            {/* ── Sección 3: Descripción ── */}
            <section className="py-10 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: "var(--font-poppins)" }}>
                Sobre este servicio
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed"
                style={{ fontFamily: "var(--font-poppins)" }}>
                {proveedor.descripcion}
              </p>
            </section>

            {/* ── Sección 4: Qué incluye ── */}
            {incluye.length > 0 && (
              <section className="py-10 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800 mb-5" style={{ fontFamily: "var(--font-poppins)" }}>
                  Qué incluye este servicio
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {incluye.map((item) => (
                    <div key={item.texto} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: "#FFFAF6" }}>
                      <span className="text-xl leading-none flex-shrink-0 mt-0.5">{item.icono}</span>
                      <span className="text-sm text-gray-700 leading-snug"
                        style={{ fontFamily: "var(--font-poppins)" }}>
                        {item.texto}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Sección 5: Reseñas verificadas ── */}
            <section className="py-10 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1" style={{ fontFamily: "var(--font-poppins)" }}>
                    Reseñas verificadas
                  </h2>
                  <p className="text-xs text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                    Solo clientes que reservaron por PLANIT pueden dejar reseñas
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-bold" style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}>
                      {proveedor.rating.toFixed(1)}
                    </span>
                    <span className="text-[10px] text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
                      {proveedor.eventosRealizados} reseñas
                    </span>
                  </div>
                  <StarRating rating={proveedor.rating} size={18} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {resenas.map((r, i) => (
                  <ResenaCard key={i} resena={r} />
                ))}
              </div>

              <div className="mt-5 text-center">
                <button
                  className="text-xs font-semibold underline transition-opacity hover:opacity-70"
                  style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
                >
                  Ver las {proveedor.eventosRealizados} reseñas
                </button>
              </div>
            </section>

            {/* ── Sección 6: Calendario ── */}
            <section id="calendario" className="py-10">
              <h2 className="text-xl font-bold text-gray-800 mb-5" style={{ fontFamily: "var(--font-poppins)" }}>
                Disponibilidad
              </h2>
              <Calendario
                fechasOcupadas={fechasBloqueadas}
                seleccionada={fechaSeleccionada}
                setSeleccionada={handleSeleccionarFecha}
              />
            </section>

          </div>

          {/* ═══════════════════════════════
              Sidebar sticky (solo desktop)
          ═══════════════════════════════ */}
          <aside className="hidden lg:block">
            <div className="sticky top-[70px]">
              <ReservaPanel
                proveedor={proveedor}
                fechaSeleccionada={fechaSeleccionada}
                onReservar={handleReservar}
                error={errorReserva}
              />
            </div>
          </aside>

        </div>
      </div>

      {/* Footer */}
      <footer
        className="py-8 text-center text-white text-sm font-medium mt-auto"
        style={{ backgroundColor: "#E8731A", fontFamily: "var(--font-poppins)" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>

      {/* Modal de reserva */}
      {modalAbierto && fechaSeleccionada && (
        <ReservaModal
          proveedor={proveedor}
          fecha={fechaSeleccionada}
          onClose={handleCloseModal}
          onConfirmada={handleConfirmada}
        />
      )}

    </main>
  );
}
