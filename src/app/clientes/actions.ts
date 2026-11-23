"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { actualizarCliente, crearCliente } from "@/lib/clientes";

export type ClienteState = {
  error?: string;
};

function leerCliente(formData: FormData) {
  return {
    nombre: String(formData.get("nombre") ?? ""),
    nif: String(formData.get("nif") ?? ""),
    direccion: String(formData.get("direccion") ?? ""),
    telefono: String(formData.get("telefono") ?? ""),
    correo: String(formData.get("correo") ?? ""),
  };
}

export async function crearClienteAction(
  _prev: ClienteState,
  formData: FormData,
): Promise<ClienteState> {
  try {
    await crearCliente(leerCliente(formData));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el cliente." };
  }
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function actualizarClienteAction(
  id: string,
  _prev: ClienteState,
  formData: FormData,
): Promise<ClienteState> {
  try {
    await actualizarCliente(id, leerCliente(formData));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el cliente." };
  }
  revalidatePath("/clientes");
  redirect("/clientes");
}
