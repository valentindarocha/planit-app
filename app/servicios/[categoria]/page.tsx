import Link from "next/link";
import { proveedores, categoriaNombres } from "@/app/data/proveedores";
import { notFound } from "next/navigation";
import ProveedoresClient from "./ProveedoresClient";

export default async function CategoriaPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;

  const nombreCategoria = categoriaNombres[categoria];
  if (!nombreCategoria) notFound();

  const lista = proveedores.filter((p) => p.categoria === categoria);

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
            {lista.length} proveedores disponibles
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
