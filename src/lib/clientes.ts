import { prisma } from "@/lib/prisma";

export type ClienteInput = {
  nombre: string;
  nif?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
};

function normalizar(input: ClienteInput) {
  if (!input.nombre.trim()) {
    throw new Error("El nombre del cliente es obligatorio.");
  }
  return {
    nombre: input.nombre.trim(),
    nif: input.nif?.trim() || null,
    direccion: input.direccion?.trim() || null,
    telefono: input.telefono?.trim() || null,
    correo: input.correo?.trim() || null,
  };
}

export async function listarClientes() {
  return prisma.cliente.findMany({ orderBy: { nombre: "asc" } });
}

export async function obtenerCliente(id: string) {
  return prisma.cliente.findUnique({ where: { id } });
}

export async function crearCliente(input: ClienteInput) {
  return prisma.cliente.create({ data: normalizar(input) });
}

export async function actualizarCliente(id: string, input: ClienteInput) {
  return prisma.cliente.update({ where: { id }, data: normalizar(input) });
}
