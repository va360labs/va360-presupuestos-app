import { prisma } from "@/lib/prisma";
import { Prisma, type PrismaClient } from "@/generated/prisma/client";

const CONFIGURACION_ID = "singleton";
const MAX_INTENTOS_NUMERACION = 5;

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

export async function obtenerNumeroBase() {
  const config = await prisma.configuracion.findUnique({
    where: { id: CONFIGURACION_ID },
  });
  return config?.numeroBase ?? 0;
}

export async function establecerNumeroBase(numero: number) {
  if (!Number.isInteger(numero) || numero < 0) {
    throw new Error("El número tiene que ser un entero de 0 o más.");
  }

  await prisma.configuracion.upsert({
    where: { id: CONFIGURACION_ID },
    update: { numeroBase: numero },
    create: { id: CONFIGURACION_ID, numeroBase: numero },
  });
}

function esColisionDeNumero(err: unknown) {
  return (
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === "P2002" &&
    (err.meta?.target as string[] | undefined)?.includes("numero")
  );
}

export async function crearPresupuesto(input: NuevoPresupuestoInput, client: PrismaClient = prisma) {
  const lineasValidas = input.lineas.filter((l) => l.descripcion.trim() !== "");

  if (!input.clienteNombre.trim()) {
    throw new Error("El nombre del cliente es obligatorio.");
  }
  if (lineasValidas.length === 0) {
    throw new Error("Añade al menos una línea de concepto.");
  }

  for (let intento = 0; intento < MAX_INTENTOS_NUMERACION; intento++) {
    try {
      return await client.$transaction(async (tx) => {
        const [ultimo, config] = await Promise.all([
          tx.presupuesto.findFirst({
            orderBy: { numero: "desc" },
            select: { numero: true },
          }),
          tx.configuracion.findUnique({ where: { id: CONFIGURACION_ID } }),
        ]);
        const numero = Math.max(ultimo?.numero ?? 0, config?.numeroBase ?? 0) + 1;

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
    } catch (err) {
      if (esColisionDeNumero(err) && intento < MAX_INTENTOS_NUMERACION - 1) {
        continue;
      }
      throw err;
    }
  }

  throw new Error("No se pudo asignar un número de presupuesto, inténtalo de nuevo.");
}
