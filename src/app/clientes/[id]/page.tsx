import { notFound } from "next/navigation";
import { obtenerCliente } from "@/lib/clientes";
import ClienteForm from "../ClienteForm";
import { actualizarClienteAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await obtenerCliente(id);
  if (!cliente) notFound();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">Editar cliente</h1>
        <ClienteForm
          action={actualizarClienteAction.bind(null, cliente.id)}
          submitLabel="Guardar cambios"
          inicial={{
            nombre: cliente.nombre,
            nif: cliente.nif ?? "",
            direccion: cliente.direccion ?? "",
            telefono: cliente.telefono ?? "",
            correo: cliente.correo ?? "",
          }}
        />
      </div>
    </div>
  );
}
