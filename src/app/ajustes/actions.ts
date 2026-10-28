"use server";

import { revalidatePath } from "next/cache";
import { establecerNumeroBase } from "@/lib/presupuestos";

export type AjustesState = {
  error?: string;
  ok?: boolean;
};

export async function establecerNumeroBaseAction(
  _prevState: AjustesState,
  formData: FormData,
): Promise<AjustesState> {
  const valor = Number(formData.get("ultimoNumero"));

  try {
    establecerNumeroBaseValida(valor);
    await establecerNumeroBase(valor);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "No se pudo guardar el número." };
  }

  revalidatePath("/ajustes");
  return { ok: true };
}

function establecerNumeroBaseValida(valor: number) {
  if (!Number.isFinite(valor) || !Number.isInteger(valor) || valor < 0) {
    throw new Error("Escribe un número entero de 0 o más.");
  }
}
