export const dynamic = "force-dynamic";

import Link from "next/link";
import { proveedores, categoriaNombres, mockToUnificado, type ProveedorUnificado } from "@/app/data/proveedores";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import ProveedoresClient from "./ProveedoresClient";

/* ─────────────────────────────────────────────
   Tipo para las filas crudas de Supabase Profiles
───────────────────────────────────────────── */
type PerfilSupabase = {
  ID: string;
  Nombre: string;
  categoria_servicio: string;
  foto_perfil: string | null;
  ubicacion: string | null;
  precio_base: number | null;
  precio_total: number | null;
  precio_sena: number | null;
  rating: number | null;
  especialidades: string[] | null;
  descripcion: string | null;
  eventos_realizados: number | null;
};

function formatarPrecio(n: number | null, prefijo = "Desde $"): string {
  if (n == null) return "A consultar";
  return `${prefijo}${Number(n).toLocaleString("es-AR")}`;
}

function perfilToUnificado(p: PerfilSupabase): ProveedorUnificado {
  return {
    id:                 p.ID,
    nombre:             p.Nombre,
    categoria:          p.categoria_servicio,
    imagen:             p.foto_perfil ?? null,
    ubicacion:          p.ubicacion ?? "Argentina",
    precioBase:         formatarPrecio(p.precio_base),
    precioTotal:        formatarPrecio(p.precio_total, "$"),
    precioSena:         formatarPrecio(p.precio_sena, "$"),
    rating:             p.rating ?? null,
    especialidades:     p.especialidades ?? [],
    eventosRealizados:  p.eventos_realizados ?? 0,
    descripcion:        p.descripcion ?? "",
    galeria:            p.foto_perfil ? [p.foto_perfil] : [],
    fechasOcupadas:     [],
    isMock:             false,
  };
}

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  const nombreCategoria = categoriaNombres[categoria];
  if (!nombreCategoria) notFound();

  /* Proveedores reales desde Supabase */
  const { data: perfilesReales } = await supabase
    .from("Profiles")
    .select("*")
    .eq("tipo_cuenta", "proveedor")
    .eq("categoria_servicio", categoria);

  const reales: ProveedorUnificado[] = (perfilesReales ?? []).map(
    (p) => perfilToUnificado(p as PerfilSupabase),
  );

  /* Proveedores mock como relleno/demo */
  const mocks: ProveedorUnificado[] = proveedores
    .filter((p) => p.categoria === categoria)
    .map(mockToUnificado);

  /* Reales primero, mocks después */
  const lista: ProveedorUnificado[] = [...reales, ...mocks];

  return (
    <main className="flex flex-col flex-1 min-h-screen pt-[50px] bg-white">

      {/* ── Encabezado ── */}
      <section className="px-8 sm:px-16 lg:px-24 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <nav
            className="flex items-center gap-2 text-xs text-gray-400 mb-4"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            <Link href="/servicios" className="hover:text-orange-500 transition-colors">
              Servicios
            </Link>
            <span>/</span>
            <span className="text-gray-600">{nombreCategoria}</span>
          </nav>

          <h1
            className="text-3xl sm:text-4xl font-bold"
            style={{ fontFamily: "var(--font-poppins)", color: "#E8731A" }}
          >
            {nombreCategoria}
          </h1>
          <p
            className="text-gray-400 text-sm mt-1"
            style={{ fontFamily: "var(--font-poppins)" }}
          >
            {lista.length} {lista.length === 1 ? "proveedor disponible" : "proveedores disponibles"}
            {reales.length > 0 && (
              <span className="ml-2 text-orange-400 font-medium">
                · {reales.length} en la plataforma
              </span>
            )}
          </p>
        </div>
      </section>

      {/* ── Filtros + Grilla (Client Component) ── */}
      <ProveedoresClient lista={lista} nombreCategoria={nombreCategoria} />

      {/* ── Footer ── */}
      <footer
        className="py-8 text-center text-white text-sm font-medium"
        style={{ backgroundColor: "#E8731A", fontFamily: "var(--font-poppins)" }}
      >
        © {new Date().getFullYear()} PLANIT — Marketplace de servicios para eventos en Argentina.
      </footer>

    </main>
  );
}
