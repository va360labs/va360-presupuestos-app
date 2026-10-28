"use client";

import { useActionState } from "react";
import { establecerNumeroBaseAction, type AjustesState } from "./actions";

const initialState: AjustesState = {};

export default function AjustesNumeracionForm({ numeroBaseActual }: { numeroBaseActual: number }) {
  const [state, formAction, pending] = useActionState(establecerNumeroBaseAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <label htmlFor="ultimoNumero" className="text-sm font-medium">
        ¿Por qué número vas ahora mismo?
      </label>
      <p className="text-sm text-zinc-500">
        Escribe el último número que usaste en tu numeración anterior (por ejemplo, en Word). El
        siguiente presupuesto que crees empezará justo después.
      </p>
      <input
        id="ultimoNumero"
        name="ultimoNumero"
        type="number"
        min={0}
        step={1}
        defaultValue={numeroBaseActual}
        className="w-full max-w-[160px] rounded-md border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-foreground px-5 py-2 text-sm font-medium text-background disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar"}
      </button>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-green-600">Guardado. El siguiente presupuesto que crees continuará esa numeración.</p>}
    </form>
  );
}
