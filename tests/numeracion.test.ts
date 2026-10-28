import { afterAll, beforeAll, describe, expect, it } from "vitest";
import fs from "node:fs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { crearBaseTemporal } from "./helpers";

const base = crearBaseTemporal("numeracion");
process.env.DATABASE_URL = base.url;

const input = (cliente: string) => ({
  clienteNombre: cliente,
  lineas: [{ descripcion: "Sesión", cantidad: 1, precioUnitario: 100 }],
});

let lib: typeof import("@/lib/presupuestos");
let prisma: typeof import("@/lib/prisma").prisma;
let PrismaClient: typeof import("@/generated/prisma/client").PrismaClient;

beforeAll(async () => {
  lib = await import("@/lib/presupuestos");
  prisma = (await import("@/lib/prisma")).prisma;
  PrismaClient = (await import("@/generated/prisma/client")).PrismaClient;
});

afterAll(async () => {
  await prisma.$disconnect();
  fs.rmSync(base.dir, { recursive: true, force: true });
});

describe("numeración correlativa", () => {
  it("tres guardados seguidos salen 1, 2 y 3", async () => {
    const numeros = [];
    for (const c of ["A", "B", "C"]) numeros.push((await lib.crearPresupuesto(input(c))).numero);
    expect(numeros).toEqual([1, 2, 3]);
  });

  it("respeta el número de partida: si el último fue el 137, el siguiente es el 138", async () => {
    await lib.establecerNumeroBase(137);
    expect((await lib.crearPresupuesto(input("D"))).numero).toBe(138);
  });

  it("rechaza números de partida inválidos", async () => {
    await expect(lib.establecerNumeroBase(-1)).rejects.toThrow();
    await expect(lib.establecerNumeroBase(1.5)).rejects.toThrow();
  });

  it("dos conexiones guardando a la vez (ordenador + móvil) no repiten número", async () => {
    const clienteB = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: base.url }) });
    try {
      const resultados = await Promise.allSettled(
        Array.from({ length: 12 }, (_, i) =>
          lib.crearPresupuesto(input(`Conc ${i}`), i % 2 === 0 ? prisma : clienteB),
        ),
      );
      const ok = resultados.filter((r) => r.status === "fulfilled");
      const numeros = ok.map((r) => r.value.numero);
      expect(new Set(numeros).size).toBe(numeros.length);

      const todos = (await prisma.presupuesto.findMany({ select: { numero: true } }))
        .map((p) => p.numero)
        .sort((a, b) => a - b);
      expect(new Set(todos).size).toBe(todos.length);
      const fallos = resultados
        .filter((r): r is PromiseRejectedResult => r.status === "rejected")
        .map((r) => `${r.reason?.code} ${JSON.stringify(r.reason?.meta)} ${r.reason?.message?.slice(-200)}`);
      expect(fallos).toEqual([]);
    } finally {
      await clienteB.$disconnect();
    }
  });
});
