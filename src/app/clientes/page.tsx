import Link from "next/link";
import { listarClientes } from "@/lib/clientes";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  const clientes = await listarClientes();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Mis clientes</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 self-start sm:self-auto">
            <Link href="/" className="flex min-h-11 items-center text-sm text-zinc-500 underline">
              Volver a la lista
            </Link>
            <Link
              href="/clientes/nuevo"
              className="flex min-h-11 items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Nuevo cliente
            </Link>
          </div>
        </div>

        {clientes.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center text-zinc-500 dark:border-zinc-700">
            Todavía no hay clientes guardados.
          </p>
        ) : (
          <ul className="flex flex-col gap-3">
            {clientes.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/clientes/${c.id}`}
                  className="flex min-h-11 flex-col gap-1 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                >
                  <span className="font-semibold">{c.nombre}</span>
                  <span className="text-sm text-zinc-500">
                    {[c.nif, c.telefono, c.correo].filter(Boolean).join(" · ") || "Sin más datos"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
