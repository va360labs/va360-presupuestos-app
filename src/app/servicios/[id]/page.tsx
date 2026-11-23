import { notFound } from "next/navigation";
import { obtenerServicio } from "@/lib/servicios";
import ServicioForm from "../ServicioForm";
import { actualizarServicioAction, borrarServicioAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const servicio = await obtenerServicio(id);
  if (!servicio) notFound();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">Editar servicio</h1>
        <ServicioForm
          action={actualizarServicioAction.bind(null, servicio.id)}
          borrar={borrarServicioAction.bind(null, servicio.id)}
          submitLabel="Guardar cambios"
          inicial={{ descripcion: servicio.descripcion, precio: String(servicio.precio) }}
        />
      </div>
    </div>
  );
}
