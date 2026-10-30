"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { crearPresupuestoAction, type CrearPresupuestoState } from "./actions";

export type ClienteOpcion = {
  id: string;
  nombre: string;
  nif: string;
  direccion: string;
  telefono: string;
  correo: string;
};

export type ServicioOpcion = {
  id: string;
  descripcion: string;
  precio: number;
};

export type PresupuestoInicial = {
  clienteId: string;
  clienteNombre: string;
  clienteNif: string;
  clienteDireccion: string;
  clienteTelefono: string;
  clienteCorreo: string;
  condiciones: string;
  observaciones: string;
  lineas: { descripcion: string; cantidad: number; precioUnitario: number }[];
};

type Linea = {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
};

const lineaVacia: Linea = { descripcion: "", cantidad: 1, precioUnitario: 0 };

const initialState: CrearPresupuestoState = {};

export default function NuevoPresupuestoForm({
  action = crearPresupuestoAction,
  inicial,
  submitLabel = "Guardar presupuesto",
  clientes = [],
  servicios = [],
}: {
  action?: (prev: CrearPresupuestoState, formData: FormData) => Promise<CrearPresupuestoState>;
  inicial?: PresupuestoInicial;
  submitLabel?: string;
  clientes?: ClienteOpcion[];
  servicios?: ServicioOpcion[];
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [clienteId, setClienteId] = useState(inicial?.clienteId ?? "");
  const [cliente, setCliente] = useState({
    nombre: inicial?.clienteNombre ?? "",
    nif: inicial?.clienteNif ?? "",
    direccion: inicial?.clienteDireccion ?? "",
    telefono: inicial?.clienteTelefono ?? "",
    correo: inicial?.clienteCorreo ?? "",
  });
  const [lineas, setLineas] = useState<Linea[]>(
    inicial && inicial.lineas.length > 0 ? inicial.lineas : [{ ...lineaVacia }],
  );
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

  function elegirCliente(id: string) {
    marcarSucio();
    const elegido = clientes.find((c) => c.id === id);
    if (elegido) {
      setCliente({
        nombre: elegido.nombre,
        nif: elegido.nif,
        direccion: elegido.direccion,
        telefono: elegido.telefono,
        correo: elegido.correo,
      });
    } else if (clienteId) {
      setCliente({ nombre: "", nif: "", direccion: "", telefono: "", correo: "" });
    }
    setClienteId(id);
  }

  function cambiarCliente(campo: keyof typeof cliente, valor: string) {
    marcarSucio();
    setCliente((prev) => ({ ...prev, [campo]: valor }));
    // Si cambia el nombre, ya no es el cliente guardado que se eligió.
    if (campo === "nombre" && clienteId) {
      const elegido = clientes.find((c) => c.id === clienteId);
      if (elegido && elegido.nombre !== valor) setClienteId("");
    }
  }

  function actualizarLinea(index: number, cambios: Partial<Linea>) {
    marcarSucio();
    setLineas((prev) => prev.map((l, i) => (i === index ? { ...l, ...cambios } : l)));
  }

  // El servicio entra como una línea nueva con su precio; después es una línea más del
  // presupuesto, así que retocarla no toca el catálogo.
  function anadirServicio(id: string) {
    const servicio = servicios.find((s) => s.id === id);
    if (!servicio) return;
    marcarSucio();
    const nueva = { descripcion: servicio.descripcion, cantidad: 1, precioUnitario: servicio.precio };
    setLineas((prev) =>
      prev.length === 1 && !prev[0].descripcion && !prev[0].precioUnitario ? [nueva] : [...prev, nueva],
    );
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
        <input type="hidden" name="clienteId" value={clienteId} />
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">Cliente guardado</span>
          <select
            value={clienteId}
            onChange={(e) => elegirCliente(e.target.value)}
            className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
          >
            <option value="">Cliente nuevo (escríbelo abajo)</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo label="Nombre del cliente" name="clienteNombre" value={cliente.nombre} required onChange={(v) => cambiarCliente("nombre", v)} />
          <Campo label="NIF" name="clienteNif" value={cliente.nif} onChange={(v) => cambiarCliente("nif", v)} />
          <Campo label="Dirección" name="clienteDireccion" value={cliente.direccion} onChange={(v) => cambiarCliente("direccion", v)} />
          <Campo label="Teléfono" name="clienteTelefono" type="tel" value={cliente.telefono} onChange={(v) => cambiarCliente("telefono", v)} />
          <Campo label="Correo" name="clienteCorreo" type="email" value={cliente.correo} onChange={(v) => cambiarCliente("correo", v)} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Conceptos
        </legend>

        {servicios.length > 0 && (
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">Añadir servicio guardado</span>
            <select
              value=""
              onChange={(e) => anadirServicio(e.target.value)}
              className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
            >
              <option value="">Elige un servicio…</option>
              {servicios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.descripcion}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex flex-col gap-3">
          {lineas.map((linea, i) => (
            <div
              key={i}
              className="grid grid-cols-1 items-end gap-2 rounded-lg border border-zinc-200 p-3 sm:grid-cols-[1fr_5rem_7rem_auto] dark:border-zinc-800"
            >
              <label className="flex flex-col gap-1 text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Descripción</span>
                <input
                  className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
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
                  className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
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
                  className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
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
          className="self-start min-h-11 rounded-md border border-dashed border-zinc-400 px-4 py-2 text-sm text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
        >
          + Añadir línea
        </button>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Condiciones y observaciones
        </legend>
        <TextArea label="Condiciones" name="condiciones" defaultValue={inicial?.condiciones} onInput={marcarSucio} />
        <TextArea label="Observaciones" name="observaciones" defaultValue={inicial?.observaciones} onInput={marcarSucio} />
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
          className="min-h-12 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background disabled:opacity-60"
        >
          {pending ? "Guardando…" : submitLabel}
        </button>
        <Link
          href="/"
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
  value,
  required,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  onChange: (valor: string) => void;
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
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  onInput,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  onInput?: () => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        onInput={onInput}
        rows={3}
        className="min-h-11 rounded-md border border-zinc-300 px-3 py-2 text-base dark:border-zinc-700 dark:bg-zinc-900"
      />
    </label>
  );
}
