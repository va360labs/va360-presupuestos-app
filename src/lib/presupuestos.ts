import { prisma } from "@/lib/prisma";
import { Prisma, type PrismaClient } from "@/generated/prisma/client";

const CONFIGURACION_ID = "singleton";
const MAX_INTENTOS_NUMERACION = 12;

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

function validarYNormalizar(input: NuevoPresupuestoInput) {
  const lineasValidas = input.lineas.filter((l) => l.descripcion.trim() !== "");

  if (!input.clienteNombre.trim()) {
    throw new Error("El nombre del cliente es obligatorio.");
  }
  if (lineasValidas.length === 0) {
    throw new Error("Añade al menos una línea de concepto.");
  }

  return {
    datos: {
      clienteNombre: input.clienteNombre.trim(),
      clienteNif: input.clienteNif?.trim() || null,
      clienteDireccion: input.clienteDireccion?.trim() || null,
      clienteTelefono: input.clienteTelefono?.trim() || null,
      clienteCorreo: input.clienteCorreo?.trim() || null,
      condiciones: input.condiciones?.trim() || null,
      observaciones: input.observaciones?.trim() || null,
    },
    lineas: lineasValidas.map((l, i) => ({
      descripcion: l.descripcion.trim(),
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
      orden: i,
    })),
  };
}

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

function esReintentable(err: unknown) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) return false;
  // P2002: otro guardado se llevó ese número. P1008/P2034: la base estaba ocupada
  // o la transacción chocó con otra escritura simultánea.
  const colisionDeNumero =
    err.code === "P2002" && (err.meta?.target as string[] | undefined)?.includes("numero");
  return colisionDeNumero || err.code === "P1008" || err.code === "P2034";
}

function esperar(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function crearPresupuesto(input: NuevoPresupuestoInput, client: PrismaClient = prisma) {
  const { datos, lineas } = validarYNormalizar(input);

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
          data: { numero, ...datos, lineas: { create: lineas } },
        });
      });
    } catch (err) {
      if (esReintentable(err) && intento < MAX_INTENTOS_NUMERACION - 1) {
        await esperar(20 * (intento + 1) + Math.random() * 30);
        continue;
      }
      throw err;
    }
  }

  throw new Error("No se pudo asignar un número de presupuesto, inténtalo de nuevo.");
}

export async function obtenerPresupuesto(id: string) {
  return prisma.presupuesto.findUnique({
    where: { id },
    include: { lineas: { orderBy: { orden: "asc" } } },
  });
}

// El número no forma parte de lo editable: se asigna al crear y no cambia nunca.
export async function actualizarPresupuesto(
  id: string,
  input: NuevoPresupuestoInput,
  client: PrismaClient = prisma,
) {
  const { datos, lineas } = validarYNormalizar(input);

  return client.$transaction(async (tx) => {
    await tx.lineaPresupuesto.deleteMany({ where: { presupuestoId: id } });
    return tx.presupuesto.update({
      where: { id },
      data: { ...datos, lineas: { create: lineas } },
    });
  });
}
