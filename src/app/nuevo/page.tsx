import NuevoPresupuestoForm from "./NuevoPresupuestoForm";

export default function NuevoPresupuestoPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-10 dark:bg-black sm:px-8">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-2xl font-semibold text-black dark:text-zinc-50">
          Nuevo presupuesto
        </h1>
        <NuevoPresupuestoForm />
      </div>
    </div>
  );
}
