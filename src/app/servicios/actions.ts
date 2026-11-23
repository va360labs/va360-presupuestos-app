"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  actualizarServicio,
  borrarServicio,
  crearServicio,
  type ServicioInput,
} from "@/lib/servicios";

export type ServicioState = {
  error?: string;
};

function leerServicio(formData: FormData): ServicioInput {
  return {
    descripcion: String(formData.get("descripcion") ?? ""),
    precio: Number(String(formData.get("precio") ?? "").replace(",", ".")),
  };
}

export async function crearServicioAction(
  _prev: ServicioState,
  formData: FormData,
): Promise<ServicioState> {
  try {
    await crearServicio(leerServicio(formData));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el servicio." };
  }
  revalidatePath("/servicios");
  redirect("/servicios");
}

export async function actualizarServicioAction(
  id: string,
  _prev: ServicioState,
  formData: FormData,
): Promise<ServicioState> {
  try {
    await actualizarServicio(id, leerServicio(formData));
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el servicio." };
  }
  revalidatePath("/servicios");
  redirect("/servicios");
}

export async function borrarServicioAction(id: string) {
  await borrarServicio(id);
  revalidatePath("/servicios");
  redirect("/servicios");
}
