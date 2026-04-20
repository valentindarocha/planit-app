import { proveedores, categoriaNombres } from "@/app/data/proveedores";
import { notFound } from "next/navigation";
import PerfilClient from "./PerfilClient";

export default async function PerfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proveedor = proveedores.find((p) => p.id === id);
  if (!proveedor) notFound();

  const nombreCategoria = categoriaNombres[proveedor.categoria] ?? proveedor.categoria;

  return <PerfilClient proveedor={proveedor} nombreCategoria={nombreCategoria} />;
}
