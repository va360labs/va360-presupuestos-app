"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ClienteState } from "./actions";

type Valores = {
  nombre: string;
  nif: string;
  direccion: string;
  telefono: string;
  correo: string;
};

const vacio: Valores = { nombre: "", nif: "", direccion: "", telefono: "", correo: "" };

export default function ClienteForm({
  action,
  inicial = vacio,
  submitLabel,
}: {
  action: (prev: ClienteState, formData: FormData) => Promise<ClienteState>;
  inicial?: Valores;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="flex w-full max-w-2xl flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Campo label="Nombre" name="nombre" defaultValue={inicial.nombre} required />
        <Campo label="NIF" name="nif" defaultValue={inicial.nif} />
        <Campo label="Dirección" name="direccion" defaultValue={inicial.direccion} />
        <Campo label="Teléfono" name="telefono" type="tel" defaultValue={inicial.telefono} />
        <Campo label="Correo" name="correo" type="email" defaultValue={inicial.correo} />
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
          href="/clientes"
          className="flex min-h-12 items-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
        >
          Cancelar
        </Link>
      </div>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
