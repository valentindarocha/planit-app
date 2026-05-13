import { Skeleton, SkeletonProveedorCard } from "@/app/components/Skeleton";

/* ─────────────────────────────────────────────
   Loading state del catálogo de proveedores.
   Next.js lo renderiza automáticamente mientras la página
   (Server Component) está esperando los datos de Supabase.

   Replicamos la estructura visual exacta: header, barra de
   filtros, contador, y grilla de 6 cards-placeholder.
   El usuario ve la página "armada" desde el primer frame,
   no una pantalla blanca con un spinner.
───────────────────────────────────────────── */
export default function CategoriaLoading() {
  return (
    <main className="flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      {/* Header */}
      <section className="px-8 sm:px-16 lg:px-24 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-3 w-24" />
          </div>
          {/* Título categoría */}
          <Skeleton className="h-10 w-64 mb-2" />
          {/* Subtítulo "X proveedores disponibles" */}
          <Skeleton className="h-4 w-56" />
        </div>
      </section>

      {/* Barra de filtros */}
      <section className="px-8 sm:px-16 lg:px-24 pb-5">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24 rounded-full" />
          <Skeleton className="h-9 w-28 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-full" />
        </div>
      </section>

      {/* Contador + ordenar */}
      <section className="px-8 sm:px-16 lg:px-24 pb-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-9 w-44 rounded-full" />
        </div>
      </section>

      {/* Grilla de 6 cards placeholder */}
      <section className="flex-1 px-8 sm:px-16 lg:px-24 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonProveedorCard key={i} />
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
