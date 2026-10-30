import { listarClientes } from "@/lib/clientes";
import { listarServicios } from "@/lib/servicios";
import NuevoPresupuestoForm from "./NuevoPresupuestoForm";

export const dynamic = "force-dynamic";

export default async function NuevoPresupuestoPage() {
  const [clientes, servicios] = await Promise.all([listarClientes(), listarServicios()]);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">
          Nuevo presupuesto
        </h1>
        <NuevoPresupuestoForm
          clientes={clientes.map(aOpcion)}
          servicios={servicios.map((s) => ({ id: s.id, descripcion: s.descripcion, precio: s.precio }))}
        />
      </div>
    </div>
  );
}

function aOpcion(c: Awaited<ReturnType<typeof listarClientes>>[number]) {
  return {
    id: c.id,
    nombre: c.nombre,
    nif: c.nif ?? "",
    direccion: c.direccion ?? "",
    telefono: c.telefono ?? "",
    correo: c.correo ?? "",
  };
}
