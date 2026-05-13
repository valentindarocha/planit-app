/* ─────────────────────────────────────────────
   Componentes skeleton reutilizables.
   Usan la clase .skeleton-shimmer definida en globals.css.
───────────────────────────────────────────── */

/* Primitivo: un bloque gris animado con shimmer.
   Pasale tamaño y forma vía className/style. */
export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden
      className={`skeleton-shimmer rounded ${className}`}
      style={style}
    />
  );
}

/* Tarjeta-placeholder que imita la ProveedorCard del catálogo.
   Misma altura visual y proporciones para que cuando llegue la data
   no haya "salto" de layout. */
export function SkeletonProveedorCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Imagen */}
      <div className="h-40 skeleton-shimmer" />

      {/* Body */}
      <div className="p-4 flex flex-col gap-2">
        {/* Nombre */}
        <Skeleton className="h-4 w-3/4" />
        {/* Ubicación */}
        <Skeleton className="h-3 w-1/2" />
        {/* Tags de especialidades */}
        <div className="flex gap-1 my-0.5">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        {/* Rating */}
        <Skeleton className="h-3.5 w-28" />
        {/* Eventos */}
        <Skeleton className="h-3 w-32" />
        {/* Precio servicio */}
        <div className="flex items-center justify-between gap-2 mt-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        {/* Seña — naranja sutil */}
        <div className="px-2 py-1 rounded-md skeleton-shimmer-orange flex items-center justify-between">
          <div className="h-3 w-12 bg-orange-200/60 rounded" />
          <div className="h-4 w-16 bg-orange-200/60 rounded" />
        </div>
        {/* CTA */}
        <Skeleton className="h-8 w-full rounded-xl mt-1" />
      </div>
    </div>
  );
}

/* Spinner unificado — reemplazo del SVG inline.
   Tamaño "lg" para pantallas de carga, "sm" para inline. */
export function Spinner({
  size = "lg",
  label,
}: {
  size?: "lg" | "sm";
  label?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3" aria-busy="true" aria-live="polite">
      <div className={size === "lg" ? "planit-spinner" : "planit-spinner-sm"} />
      {label && (
        <p className="text-sm text-gray-500" style={{ fontFamily: "var(--font-poppins)" }}>
          {label}
        </p>
      )}
    </div>
  );
}
