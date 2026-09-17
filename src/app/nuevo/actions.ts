"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { crearPresupuesto, type LineaInput } from "@/lib/presupuestos";

export type CrearPresupuestoState = {
  error?: string;
};

export async function crearPresupuestoAction(
  _prevState: CrearPresupuestoState,
  formData: FormData,
): Promise<CrearPresupuestoState> {
  const lineasJson = formData.get("lineas");
  let lineas: LineaInput[] = [];
  try {
    lineas = JSON.parse(String(lineasJson ?? "[]"));
  } catch {
    return { error: "Las líneas del presupuesto no son válidas." };
  }

  try {
    await crearPresupuesto({
      clienteNombre: String(formData.get("clienteNombre") ?? ""),
      clienteNif: String(formData.get("clienteNif") ?? ""),
      clienteDireccion: String(formData.get("clienteDireccion") ?? ""),
      clienteTelefono: String(formData.get("clienteTelefono") ?? ""),
      clienteCorreo: String(formData.get("clienteCorreo") ?? ""),
      condiciones: String(formData.get("condiciones") ?? ""),
      observaciones: String(formData.get("observaciones") ?? ""),
      lineas,
    });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el presupuesto." };
  }

  revalidatePath("/");
  redirect("/");
}
