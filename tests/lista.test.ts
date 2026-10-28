import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import { crearBaseTemporal } from "./helpers";

const base = crearBaseTemporal("lista");
process.env.DATABASE_URL = base.url;

let lib: typeof import("@/lib/presupuestos");
let prisma: typeof import("@/lib/prisma").prisma;

beforeAll(async () => {
  lib = await import("@/lib/presupuestos");
  prisma = (await import("@/lib/prisma")).prisma;
});

afterAll(async () => {
  await prisma.$disconnect();
  fs.rmSync(base.dir, { recursive: true, force: true });
});

describe("lista de presupuestos", () => {
  it("muestra cliente, fecha, importe sumado y estado pendiente, el más reciente primero", async () => {
    await lib.crearPresupuesto({
      clienteNombre: "Laura",
      lineas: [
        { descripcion: "Reportaje", cantidad: 1, precioUnitario: 900 },
        { descripcion: "Álbum", cantidad: 2, precioUnitario: 75.5 },
      ],
    });
    await lib.crearPresupuesto({
      clienteNombre: "Pedro",
      lineas: [{ descripcion: "Retrato", cantidad: 1, precioUnitario: 120 }],
    });

    const lista = await lib.listarPresupuestos();
    expect(lista.map((p) => p.numero)).toEqual([2, 1]);
    expect(lista[1]).toMatchObject({ clienteNombre: "Laura", importe: 1051, estado: "PENDIENTE" });
    expect(lista[1].createdAt).toBeInstanceOf(Date);
  });
});
