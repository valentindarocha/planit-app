import { proveedores, categoriaNombres } from "@/app/data/proveedores";
import { notFound } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import PerfilClient from "./PerfilClient";
import type { Proveedor } from "@/app/data/proveedores";

function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  /* ── Proveedor real en Supabase (UUID) ── */
  if (isUUID(id)) {
    const { data: perfil } = await supabase
      .from("Profiles")
      .select("*")
      .eq("ID", id)
      .eq("tipo_cuenta", "proveedor")
      .single();

    if (perfil) {
      const proveedor: Proveedor = {
        id:                perfil.ID,
        nombre:            perfil.Nombre,
        categoria:         perfil.categoria_servicio ?? "otros",
        imagen:            perfil.foto_perfil ?? "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80&auto=format&fit=crop",
        ubicacion:         perfil.ubicacion ?? "Argentina",
        precioBase:        perfil.precio_base != null ? `Desde $${Number(perfil.precio_base).toLocaleString("es-AR")}` : "A consultar",
        precioTotal:       perfil.precio_total != null ? `$${Number(perfil.precio_total).toLocaleString("es-AR")}` : "A consultar",
        precioSena:        perfil.precio_sena != null ? `$${Number(perfil.precio_sena).toLocaleString("es-AR")}` : "A consultar",
        rating:            perfil.rating ?? 5.0,
        especialidades:    perfil.especialidades ?? [],
        eventosRealizados: perfil.eventos_realizados ?? 0,
        descripcion:       perfil.descripcion ?? "Proveedor de servicios para eventos en PLANIT.",
        galeria:           perfil.foto_perfil ? [perfil.foto_perfil] : [],
        fechasOcupadas:    [],
      };

      const nombreCategoria = categoriaNombres[proveedor.categoria] ?? proveedor.categoria;
      return <PerfilClient proveedor={proveedor} nombreCategoria={nombreCategoria} />;
    }
  }

  /* ── Fallback: proveedor mock por slug ── */
  const proveedor = proveedores.find((p) => p.id === id);
  if (!proveedor) notFound();

  const nombreCategoria = categoriaNombres[proveedor.categoria] ?? proveedor.categoria;
  return <PerfilClient proveedor={proveedor} nombreCategoria={nombreCategoria} />;
}
