import Link from "next/link";
import { obtenerNumeroBase } from "@/lib/presupuestos";
import AjustesNumeracionForm from "./AjustesNumeracionForm";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const numeroBaseActual = await obtenerNumeroBase();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-8 dark:bg-black sm:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">Ajustes</h1>
          <Link href="/" className="text-sm text-zinc-500 underline">
            Volver a la lista
          </Link>
        </div>

        <AjustesNumeracionForm numeroBaseActual={numeroBaseActual} />
      </div>
    </div>
  );
}
