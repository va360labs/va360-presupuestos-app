import Link from "next/link";
import { listarPresupuestos } from "@/lib/presupuestos";

export const dynamic = "force-dynamic";

const ESTADO_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  ACEPTADO: "Aceptado",
  RECHAZADO: "Rechazado",
};

function formatoImporte(valor: number) {
  return valor.toLocaleString("es-ES", { style: "currency", currency: "EUR" });
}

function formatoFecha(fecha: Date) {
  return fecha.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default async function Home() {
  const presupuestos = await listarPresupuestos();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Mis presupuestos
          </h1>
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <Link href="/ajustes" className="flex min-h-11 items-center text-sm text-zinc-500 underline">
              Ajustes
            </Link>
            <Link
              href="/nuevo"
              className="flex min-h-11 items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              Nuevo presupuesto
            </Link>
          </div>
        </div>

        {presupuestos.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center text-zinc-500 dark:border-zinc-700">
            Todavía no hay presupuestos. Crea el primero.
          </p>
        ) : (
          <>
            {/* Móvil: tarjetas */}
            <ul className="flex flex-col gap-3 sm:hidden">
              {presupuestos.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/presupuestos/${p.id}`}
                    className="flex flex-col gap-1 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">#{p.numero} · {p.clienteNombre}</span>
                      <span className="text-sm text-zinc-500">{formatoFecha(p.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{formatoImporte(p.importe)}</span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {ESTADO_LABEL[p.estado] ?? p.estado}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Escritorio: tabla */}
            <table className="hidden w-full text-left text-sm sm:table">
              <thead className="text-zinc-500">
                <tr>
                  <th className="py-2 pr-4 font-medium">Nº</th>
                  <th className="py-2 pr-4 font-medium">Cliente</th>
                  <th className="py-2 pr-4 font-medium">Fecha</th>
                  <th className="py-2 pr-4 font-medium">Importe</th>
                  <th className="py-2 font-medium">Estado</th>
                </tr>
              </thead>
              <tbody>
                {presupuestos.map((p) => (
                  <tr key={p.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="py-3 pr-4">{p.numero}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/presupuestos/${p.id}`} className="underline">
                        {p.clienteNombre}
                      </Link>
                    </td>
                    <td className="py-3 pr-4">{formatoFecha(p.createdAt)}</td>
                    <td className="py-3 pr-4">{formatoImporte(p.importe)}</td>
                    <td className="py-3">{ESTADO_LABEL[p.estado] ?? p.estado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}
