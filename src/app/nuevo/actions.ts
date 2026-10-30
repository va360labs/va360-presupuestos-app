"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { leerDatosTipo } from "@/lib/tipos";
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
      tipo: String(formData.get("tipo") ?? ""),
      datosTipo: leerDatosTipo(String(formData.get("datosTipo") ?? "")),
      clienteId: String(formData.get("clienteId") ?? ""),
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
