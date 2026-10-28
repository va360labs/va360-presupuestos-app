import { notFound } from "next/navigation";
import { obtenerPresupuesto } from "@/lib/presupuestos";
import NuevoPresupuestoForm from "@/app/nuevo/NuevoPresupuestoForm";
import { actualizarPresupuestoAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function EditarPresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presupuesto = await obtenerPresupuesto(id);
  if (!presupuesto) notFound();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">
          Presupuesto nº {presupuesto.numero}
        </h1>
        <NuevoPresupuestoForm
          action={actualizarPresupuestoAction.bind(null, presupuesto.id)}
          submitLabel="Guardar cambios"
          inicial={{
            clienteNombre: presupuesto.clienteNombre,
            clienteNif: presupuesto.clienteNif ?? "",
            clienteDireccion: presupuesto.clienteDireccion ?? "",
            clienteTelefono: presupuesto.clienteTelefono ?? "",
            clienteCorreo: presupuesto.clienteCorreo ?? "",
            condiciones: presupuesto.condiciones ?? "",
            observaciones: presupuesto.observaciones ?? "",
            lineas: presupuesto.lineas.map((l) => ({
              descripcion: l.descripcion,
              cantidad: l.cantidad,
              precioUnitario: l.precioUnitario,
            })),
          }}
        />
      </div>
    </div>
  );
}
