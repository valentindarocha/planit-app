"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { type Proveedor } from "@/app/data/proveedores";

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function parsePrice(precio: string): number {
  return parseInt(precio.replace("Desde $", "").replace(/\./g, ""));
}

function toggle(arr: string[], value: string): string[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

/* ─────────────────────────────────────────────
   Íconos
───────────────────────────────────────────── */
function IconMapPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0 mt-px">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="flex-shrink-0">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconChevron({ open }: { open: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   Estrellas
───────────────────────────────────────────── */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled  = rating >= star;
          const partial = !filled && rating >= star - 0.5;
          return (
            <svg key={star} xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`h-${star}-${Math.round(rating * 10)}`}>
                  <stop offset="50%" stopColor="#E8731A" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={filled ? "#E8731A" : partial ? `url(#h-${star}-${Math.round(rating * 10)})` : "#D1D5DB"}
                stroke="none"
              />
            </svg>
          );
        })}
      </div>
      <span className="text-xs font-semibold text-gray-500" style={{ fontFamily: "var(--font-poppins)" }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Tarjeta de proveedor
───────────────────────────────────────────── */
function ProveedorCard({ proveedor }: { proveedor: Proveedor }) {
  return (
    <Link
      href={`/proveedores/${proveedor.id}`}
      className="proveedor-card group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
    >
      <div className="relative h-40 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proveedor.imagen}
          alt={proveedor.nombre}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="text-sm font-bold text-gray-800 leading-snug" style={{ fontFamily: "var(--font-poppins)" }}>
          {proveedor.nombre}
        </h3>

        <div className="flex items-center gap-1 text-gray-400 text-xs" style={{ fontFamily: "var(--font-poppins)" }}>
          <IconMapPin />
          {proveedor.ubicacion}
        </div>

        <div className="flex flex-wrap gap-1">
          {proveedor.especialidades.map((esp) => (
            <span key={esp} className="px-2 py-0.5 rounded-full text-[10px] font-medium"
              style={{ fontFamily: "var(--font-poppins)", backgroundColor: "#FFF0E6", color: "#C25E10" }}>
              {esp}
            </span>
          ))}
        </div>

        <StarRating rating={proveedor.rating} />

        <div className="flex items-center gap-1 text-gray-400 text-xs" style={{ fontFamily: "var(--font-poppins)" }}>
          <IconCheck />
          <span>{proveedor.eventosRealizados} eventos realizados</span>
        </div>

        <div className="flex flex-col gap-0.5 mt-auto pt-1" style={{ fontFamily: "var(--font-poppins)" }}>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-[11px] text-gray-500">Servicio:</span>
            <span className="text-xs font-semibold text-gray-700">{proveedor.precioTotal}</span>
          </div>
          <div className="flex items-baseline justify-between gap-2 px-2 py-1 rounded-md"
            style={{ backgroundColor: "#FFF0E6" }}>
            <span className="text-[11px] font-semibold" style={{ color: "#E8731A" }}>Seña:</span>
            <span className="text-sm font-bold" style={{ color: "#E8731A" }}>{proveedor.precioSena}</span>
          </div>
        </div>

        <button className="cta-button w-full mt-1 py-2 rounded-xl text-white text-xs font-semibold text-center"
          style={{ fontFamily: "var(--font-poppins)" }}>
          Ver perfil
        </button>
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Dropdown con checkboxes
───────────────────────────────────────────── */
function FilterDropdown({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const count = selected.length;
  const isActive = count > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-poppins)",
          backgroundColor: isActive ? "#E8731A" : "#ffffff",
          color: isActive ? "#ffffff" : "#374151",
          borderColor: isActive ? "#E8731A" : "#D1D5DB",
        }}
      >
        {label}{count > 0 ? ` (${count})` : ""}
        <IconChevron open={open} />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 z-50 rounded-xl border bg-white shadow-lg py-1 min-w-[180px]"
          style={{ borderColor: "#F0E0D0" }}
        >
          {options.map((opt) => {
            const checked = selected.includes(opt.value);
            return (
              <label
                key={opt.value}
                className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-orange-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(opt.value)}
                  className="w-3.5 h-3.5 rounded accent-[#E8731A] cursor-pointer flex-shrink-0"
                />
                <span
                  className="text-xs text-gray-700"
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Definición de rangos de precio
───────────────────────────────────────────── */
const RANGOS_PRECIO = [
  { value: "hasta100",  label: "Hasta $100.000",      min: 0,      max: 100000  },
  { value: "100a200",   label: "$100.000 – $200.000",  min: 100001, max: 200000  },
  { value: "200a500",   label: "$200.000 – $500.000",  min: 200001, max: 500000  },
  { value: "mas500",    label: "Más de $500.000",      min: 500001, max: Infinity },
];

const RANGOS_RATING = [
  { value: "4.8", label: "5 estrellas"  },
  { value: "4.0", label: "4+ estrellas" },
  { value: "3.0", label: "3+ estrellas" },
];

/* ─────────────────────────────────────────────
   Componente principal
───────────────────────────────────────────── */
export default function ProveedoresClient({
  lista,
  nombreCategoria,
}: {
  lista: Proveedor[];
  nombreCategoria: string;
}) {
  const [zonas,          setZonas]          = useState<string[]>([]);
  const [precios,        setPrecios]        = useState<string[]>([]);
  const [ratings,        setRatings]        = useState<string[]>([]);
  const [especialidades, setEspecialidades] = useState<string[]>([]);
  const [ordenar,        setOrdenar]        = useState("relevancia");

  /* Opciones dinámicas extraídas del mock */
  const opcionesZona = useMemo(() =>
    Array.from(new Set(lista.map((p) => p.ubicacion))).sort(),
  [lista]);

  const opcionesEspecialidad = useMemo(() =>
    Array.from(new Set(lista.flatMap((p) => p.especialidades))).sort(),
  [lista]);

  /* Resultado filtrado y ordenado */
  const resultado = useMemo(() => {
    let f = [...lista];

    if (zonas.length > 0)
      f = f.filter((p) => zonas.includes(p.ubicacion));

    if (precios.length > 0)
      f = f.filter((p) => {
        const n = parsePrice(p.precioBase);
        return RANGOS_PRECIO
          .filter((r) => precios.includes(r.value))
          .some((r) => n >= r.min && n <= r.max);
      });

    if (ratings.length > 0)
      f = f.filter((p) =>
        ratings.some((r) => p.rating >= parseFloat(r))
      );

    if (especialidades.length > 0)
      f = f.filter((p) =>
        especialidades.some((e) => p.especialidades.includes(e))
      );

    f.sort((a, b) => {
      if (ordenar === "rating")      return b.rating - a.rating;
      if (ordenar === "precio-asc")  return parsePrice(a.precioBase) - parsePrice(b.precioBase);
      if (ordenar === "precio-desc") return parsePrice(b.precioBase) - parsePrice(a.precioBase);
      return 0;
    });

    return f;
  }, [lista, zonas, precios, ratings, especialidades, ordenar]);

  const hayFiltros =
    zonas.length > 0 || precios.length > 0 || ratings.length > 0 || especialidades.length > 0;

  function limpiarTodo() {
    setZonas([]); setPrecios([]); setRatings([]); setEspecialidades([]);
  }

  return (
    <>
      {/* ══════════════════════════════════════
          BARRA DE FILTROS HORIZONTAL
      ══════════════════════════════════════ */}
      <section className="px-8 sm:px-16 lg:px-24 pb-5">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center gap-2">

            <FilterDropdown
              label="Zona"
              options={opcionesZona.map((z) => ({ value: z, label: z }))}
              selected={zonas}
              onToggle={(v) => setZonas(toggle(zonas, v))}
            />

            <FilterDropdown
              label="Precio"
              options={RANGOS_PRECIO.map((r) => ({ value: r.value, label: r.label }))}
              selected={precios}
              onToggle={(v) => setPrecios(toggle(precios, v))}
            />

            <FilterDropdown
              label="Puntuación"
              options={RANGOS_RATING.map((r) => ({ value: r.value, label: r.label }))}
              selected={ratings}
              onToggle={(v) => setRatings(toggle(ratings, v))}
            />

            <FilterDropdown
              label="Especialidad"
              options={opcionesEspecialidad.map((e) => ({ value: e, label: e }))}
              selected={especialidades}
              onToggle={(v) => setEspecialidades(toggle(especialidades, v))}
            />

            {hayFiltros && (
              <button
                onClick={limpiarTodo}
                className="px-4 py-2 rounded-full text-xs font-semibold border border-dashed transition-all duration-200 hover:opacity-70"
                style={{
                  fontFamily: "var(--font-poppins)",
                  color: "#E8731A",
                  borderColor: "#E8731A",
                }}
              >
                Limpiar filtros
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BARRA: RESULTADOS + ORDENAR POR
      ══════════════════════════════════════ */}
      <section className="px-8 sm:px-16 lg:px-24 pb-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm text-gray-400" style={{ fontFamily: "var(--font-poppins)" }}>
            Mostrando{" "}
            <span className="font-semibold text-gray-700">{resultado.length}</span>
            {" "}de{" "}
            <span className="font-semibold text-gray-700">{lista.length}</span>
            {" "}{lista.length === 1 ? "proveedor" : "proveedores"} de{" "}
            <span className="font-semibold text-gray-700">{nombreCategoria}</span>
          </p>

          <div className="flex flex-col gap-1">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider text-gray-400"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Ordenar por
            </span>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="text-sm text-gray-700 rounded-full px-4 py-2 border outline-none cursor-pointer appearance-none pr-8 bg-white"
              style={{
                fontFamily: "var(--font-poppins)",
                borderColor: "#E8731A",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23E8731A' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 12px center",
              }}
            >
              <option value="relevancia">Más relevantes</option>
              <option value="rating">Mejor puntuados</option>
              <option value="precio-asc">Menor precio</option>
              <option value="precio-desc">Mayor precio</option>
            </select>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GRILLA
      ══════════════════════════════════════ */}
      <section className="flex-1 px-8 sm:px-16 lg:px-24 pb-16">
        <div className="max-w-6xl mx-auto">
          {resultado.length === 0 ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <p className="text-gray-400 text-base" style={{ fontFamily: "var(--font-poppins)" }}>
                Ningún proveedor coincide con los filtros seleccionados.
              </p>
              <button
                onClick={limpiarTodo}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                style={{ fontFamily: "var(--font-poppins)", backgroundColor: "#E8731A" }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {resultado.map((proveedor) => (
                <ProveedorCard key={proveedor.id} proveedor={proveedor} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
