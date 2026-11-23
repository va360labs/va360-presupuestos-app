import { prisma } from "@/lib/prisma";

export type ServicioInput = {
  descripcion: string;
  precio: number;
};

function normalizar(input: ServicioInput) {
  if (!input.descripcion.trim()) {
    throw new Error("La descripción del servicio es obligatoria.");
  }
  if (!Number.isFinite(input.precio) || input.precio < 0) {
    throw new Error("El precio tiene que ser un número de 0 o más.");
  }
  return { descripcion: input.descripcion.trim(), precio: input.precio };
}

export async function listarServicios() {
  return prisma.servicio.findMany({ orderBy: { descripcion: "asc" } });
}

export async function obtenerServicio(id: string) {
  return prisma.servicio.findUnique({ where: { id } });
}

export async function crearServicio(input: ServicioInput) {
  return prisma.servicio.create({ data: normalizar(input) });
}

export async function actualizarServicio(id: string, input: ServicioInput) {
  return prisma.servicio.update({ where: { id }, data: normalizar(input) });
}

export async function borrarServicio(id: string) {
  await prisma.servicio.delete({ where: { id } });
}
