import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import { crearBaseTemporal } from "./helpers";

const base = crearBaseTemporal("edicion");
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

describe("edición de un presupuesto", () => {
  it("corregir un precio actualiza el importe y el número no cambia", async () => {
    const creado = await lib.crearPresupuesto({
      clienteNombre: "Ana",
      lineas: [
        { descripcion: "Retrato", cantidad: 1, precioUnitario: 100 },
        { descripcion: "Revelado", cantidad: 1, precioUnitario: 50 },
      ],
    });

    await lib.actualizarPresupuesto(creado.id, {
      clienteNombre: "Ana Gil",
      condiciones: "50 % de adelanto",
      lineas: [
        { descripcion: "Retrato", cantidad: 1, precioUnitario: 130 },
        { descripcion: "Revelado", cantidad: 1, precioUnitario: 50 },
      ],
    });

    const guardado = await lib.obtenerPresupuesto(creado.id);
    expect(guardado?.numero).toBe(creado.numero);
    expect(guardado?.clienteNombre).toBe("Ana Gil");
    expect(guardado?.condiciones).toBe("50 % de adelanto");
    expect(guardado?.lineas).toHaveLength(2);
    expect(lib.totalDeLineas(guardado!.lineas)).toBe(180);

    const enLista = (await lib.listarPresupuestos()).find((p) => p.id === creado.id);
    expect(enLista?.importe).toBe(180);
    expect(enLista?.numero).toBe(creado.numero);
  });

  it("editar no consume números: el siguiente presupuesto sigue la secuencia", async () => {
    const a = await lib.crearPresupuesto({
      clienteNombre: "Eva",
      lineas: [{ descripcion: "Boda", cantidad: 1, precioUnitario: 1000 }],
    });
    await lib.actualizarPresupuesto(a.id, {
      clienteNombre: "Eva",
      lineas: [{ descripcion: "Boda", cantidad: 1, precioUnitario: 900 }],
    });
    const b = await lib.crearPresupuesto({
      clienteNombre: "Raúl",
      lineas: [{ descripcion: "Boda", cantidad: 1, precioUnitario: 800 }],
    });
    expect(b.numero).toBe(a.numero + 1);
  });

  it("no deja guardar una edición sin cliente ni sin líneas y no toca lo guardado", async () => {
    const creado = await lib.crearPresupuesto({
      clienteNombre: "Luis",
      lineas: [{ descripcion: "Producto", cantidad: 2, precioUnitario: 40 }],
    });
    await expect(
      lib.actualizarPresupuesto(creado.id, { clienteNombre: "", lineas: [] }),
    ).rejects.toThrow();
    expect(lib.totalDeLineas((await lib.obtenerPresupuesto(creado.id))!.lineas)).toBe(80);
  });
});
