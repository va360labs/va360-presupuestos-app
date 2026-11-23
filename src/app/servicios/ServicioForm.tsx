"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { ServicioState } from "./actions";

type Valores = {
  descripcion: string;
  precio: string;
};

const vacio: Valores = { descripcion: "", precio: "" };

export default function ServicioForm({
  action,
  inicial = vacio,
  submitLabel,
  borrar,
}: {
  action: (prev: ServicioState, formData: FormData) => Promise<ServicioState>;
  inicial?: Valores;
  submitLabel: string;
  borrar?: () => Promise<void>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [confirmando, setConfirmando] = useState(false);

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <form action={formAction} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_9rem]">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Descripción</span>
            <input
              name="descripcion"
              defaultValue={inicial.descripcion}
              required
              placeholder="Reportaje de boda 8 h"
              className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Precio (€)</span>
            <input
              name="precio"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              defaultValue={inicial.precio}
              required
              className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
            />
          </label>
        </div>

        {state?.error && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300">
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="min-h-12 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
          >
            {pending ? "Guardando…" : submitLabel}
          </button>
          <Link
            href="/servicios"
            className="flex min-h-12 items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
          >
            Cancelar
          </Link>
        </div>
      </form>

      {borrar && (
        <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          {confirmando ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                ¿Borrar este servicio? Los presupuestos que ya lo usan no cambian.
              </span>
              <form action={borrar}>
                <button
                  type="submit"
                  className="min-h-11 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white"
                >
                  Sí, borrar
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="min-h-11 rounded-full border border-zinc-300 px-5 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
              >
                No
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmando(true)}
              className="min-h-11 self-start rounded-full border border-red-300 px-5 py-2 text-sm text-red-700 dark:border-red-800 dark:text-red-400"
            >
              Borrar servicio
            </button>
          )}
        </div>
      )}
    </div>
  );
}
