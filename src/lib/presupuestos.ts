import { prisma } from "@/lib/prisma";

export type LineaInput = {
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
};

export type NuevoPresupuestoInput = {
  clienteNombre: string;
  clienteNif?: string;
  clienteDireccion?: string;
  clienteTelefono?: string;
  clienteCorreo?: string;
  condiciones?: string;
  observaciones?: string;
  lineas: LineaInput[];
};

export function totalDeLineas(lineas: LineaInput[]) {
  return lineas.reduce((acc, l) => acc + l.cantidad * l.precioUnitario, 0);
}

export async function listarPresupuestos() {
  const presupuestos = await prisma.presupuesto.findMany({
    include: { lineas: true },
    orderBy: { numero: "desc" },
  });

  return presupuestos.map((p) => ({
    id: p.id,
    numero: p.numero,
    clienteNombre: p.clienteNombre,
    estado: p.estado,
    createdAt: p.createdAt,
    importe: totalDeLineas(p.lineas),
  }));
}

export async function crearPresupuesto(input: NuevoPresupuestoInput) {
  const lineasValidas = input.lineas.filter((l) => l.descripcion.trim() !== "");

  if (!input.clienteNombre.trim()) {
    throw new Error("El nombre del cliente es obligatorio.");
  }
  if (lineasValidas.length === 0) {
    throw new Error("Añade al menos una línea de concepto.");
  }

  return prisma.$transaction(async (tx) => {
    const ultimo = await tx.presupuesto.findFirst({
      orderBy: { numero: "desc" },
      select: { numero: true },
    });
    const numero = (ultimo?.numero ?? 0) + 1;

    return tx.presupuesto.create({
      data: {
        numero,
        clienteNombre: input.clienteNombre.trim(),
        clienteNif: input.clienteNif?.trim() || null,
        clienteDireccion: input.clienteDireccion?.trim() || null,
        clienteTelefono: input.clienteTelefono?.trim() || null,
        clienteCorreo: input.clienteCorreo?.trim() || null,
        condiciones: input.condiciones?.trim() || null,
        observaciones: input.observaciones?.trim() || null,
        lineas: {
          create: lineasValidas.map((l, i) => ({
            descripcion: l.descripcion.trim(),
            cantidad: l.cantidad,
            precioUnitario: l.precioUnitario,
            orden: i,
          })),
        },
      },
    });
  });
}
