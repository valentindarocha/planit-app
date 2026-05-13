import { Skeleton } from "@/app/components/Skeleton";

/* ─────────────────────────────────────────────
   Loading state del perfil de proveedor.
   Replica el layout real (header + galería + descripción
   + sidebar de reserva) para que la transición a la página
   real sea fluida.
───────────────────────────────────────────── */
export default function ProveedorLoading() {
  return (
    <main className="flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      <div className="max-w-6xl mx-auto w-full px-6 sm:px-8 pb-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mt-8 mb-6">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3" />
          <Skeleton className="h-3 w-32" />
        </div>

        {/* Layout principal con sidebar */}
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-10">

          {/* ═══════════════════════════════
              Columna principal
          ═══════════════════════════════ */}
          <div className="flex flex-col min-w-0">

            {/* Sección 1: Info principal */}
            <section className="flex flex-col gap-3 pb-10 border-b border-gray-100">
              {/* Badge categoría */}
              <Skeleton className="h-6 w-28 rounded-full" />
              {/* Título grande */}
              <Skeleton className="h-10 w-2/3" />
              {/* Ubicación */}
              <Skeleton className="h-4 w-40" />
              {/* Rating */}
              <Skeleton className="h-5 w-32" />
              {/* Tags de especialidades */}
              <div className="flex flex-wrap gap-2 mt-1">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </section>

            {/* Sección 2: Galería */}
            <section className="py-10 border-b border-gray-100">
              <Skeleton className="h-6 w-48 mb-4" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="w-full aspect-square rounded-xl" />
                ))}
              </div>
            </section>

            {/* Sección 3: Descripción */}
            <section className="py-10 border-b border-gray-100">
              <Skeleton className="h-6 w-44 mb-3" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </section>

            {/* Sección 4: Qué incluye */}
            <section className="py-10 border-b border-gray-100">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 5: Reseñas */}
            <section className="py-10 border-b border-gray-100">
              <Skeleton className="h-6 w-28 mb-4" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="rounded-xl border p-5 flex flex-col gap-3" style={{ borderColor: "#F3F4F6", backgroundColor: "#FAFAFA" }}>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-2.5 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                ))}
              </div>
            </section>

            {/* Sección 6: Calendario */}
            <section className="py-10">
              <Skeleton className="h-6 w-40 mb-5" />
              <div className="rounded-2xl border p-5 max-w-sm" style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}>
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="w-8 h-8 rounded-full mx-auto" />
                  ))}
                </div>
              </div>
            </section>

          </div>

          {/* ═══════════════════════════════
              Sidebar sticky (solo desktop)
          ═══════════════════════════════ */}
          <aside className="hidden lg:block">
            <div
              className="rounded-2xl border p-5 flex flex-col gap-4 sticky top-[70px]"
              style={{ borderColor: "#F0E0D0", backgroundColor: "#FFFAF6" }}
            >
              <div className="flex justify-between pb-3 border-b" style={{ borderColor: "#F0E0D0" }}>
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex flex-col items-center gap-2 py-3">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-2.5 w-28" />
              </div>
              <Skeleton className="h-12 rounded-xl" />
              <div className="pt-4 border-t flex flex-col gap-3" style={{ borderColor: "#F0E0D0" }}>
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-44" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
