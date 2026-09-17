"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { crearPresupuestoAction, type CrearPresupuestoState } from "./actions";

type Linea = {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
};

const lineaVacia: Linea = { descripcion: "", cantidad: 1, precioUnitario: 0 };

const initialState: CrearPresupuestoState = {};

export default function NuevoPresupuestoForm() {
  const [state, formAction, pending] = useActionState(crearPresupuestoAction, initialState);
  const [lineas, setLineas] = useState<Linea[]>([{ ...lineaVacia }]);
  const [dirty, setDirty] = useState(false);
  const savedRef = useRef(false);

  const total = useMemo(
    () => lineas.reduce((acc, l) => acc + (l.cantidad || 0) * (l.precioUnitario || 0), 0),
    [lineas],
  );

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (dirty && !savedRef.current) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function marcarSucio() {
    if (!dirty) setDirty(true);
  }

  function actualizarLinea(index: number, cambios: Partial<Linea>) {
    marcarSucio();
    setLineas((prev) => prev.map((l, i) => (i === index ? { ...l, ...cambios } : l)));
  }

  function anadirLinea() {
    marcarSucio();
    setLineas((prev) => [...prev, { ...lineaVacia }]);
  }

  function borrarLinea(index: number) {
    marcarSucio();
    setLineas((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  return (
    <form
      action={formAction}
      onSubmit={() => {
        savedRef.current = true;
      }}
      className="flex w-full max-w-2xl flex-col gap-8"
    >
      <input type="hidden" name="lineas" value={JSON.stringify(lineas)} />

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Datos del cliente
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Nombre del cliente" name="clienteNombre" required onInput={marcarSucio} />
          <Campo label="NIF" name="clienteNif" onInput={marcarSucio} />
          <Campo label="Dirección" name="clienteDireccion" onInput={marcarSucio} />
          <Campo label="Teléfono" name="clienteTelefono" type="tel" onInput={marcarSucio} />
          <Campo label="Correo" name="clienteCorreo" type="email" onInput={marcarSucio} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Conceptos
        </legend>

        <div className="flex flex-col gap-3">
          {lineas.map((linea, i) => (
            <div
              key={i}
              className="grid grid-cols-1 items-end gap-2 rounded-lg border border-zinc-200 p-3 sm:grid-cols-[1fr_5rem_7rem_auto] dark:border-zinc-800"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Descripción</span>
                <input
                  className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  value={linea.descripcion}
                  onChange={(e) => actualizarLinea(i, { descripcion: e.target.value })}
                  placeholder="Reportaje boda día completo"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Cantidad</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  value={linea.cantidad}
                  onChange={(e) => actualizarLinea(i, { cantidad: Number(e.target.value) })}
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Precio (€)</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="any"
                  className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
                  value={linea.precioUnitario}
                  onChange={(e) => actualizarLinea(i, { precioUnitario: Number(e.target.value) })}
                />
              </label>
              <button
                type="button"
                onClick={() => borrarLinea(i)}
                disabled={lineas.length === 1}
                className="h-11 rounded-md border border-zinc-300 px-3 text-sm text-zinc-600 disabled:opacity-40 dark:border-zinc-700 dark:text-zinc-400"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={anadirLinea}
          className="self-start rounded-md border border-dashed border-zinc-400 px-4 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
        >
          + Añadir línea
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Condiciones y observaciones
        </legend>
        <TextArea label="Condiciones" name="condiciones" onInput={marcarSucio} />
        <TextArea label="Observaciones" name="observaciones" onInput={marcarSucio} />
      </fieldset>

      <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-4 py-3 dark:bg-zinc-900">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">Total</span>
        <span className="text-xl font-semibold">
          {total.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </span>
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
          className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Guardar presupuesto"}
        </button>
        <Link
          href="/"
          className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
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
  required,
  onInput,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  onInput?: () => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        onInput={onInput}
        className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  onInput,
}: {
  label: string;
  name: string;
  onInput?: () => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <textarea
        name={name}
        onInput={onInput}
        rows={3}
        className="rounded-md border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
