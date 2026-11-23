import { expect, test } from "@playwright/test";
import { capturarAlTerminar, crearPresupuestoSencillo, numeroDe, numerosEnLista, unico } from "./helpers";

capturarAlTerminar();

test.describe("Historia 1 · Crear", () => {
  test("Criterio 4: Al guardar, el presupuesto recibe el número siguiente al último que hice y ese número no se repite en ningún otro", async ({ page }) => {
    const ultimo = Math.max(0, ...(await numerosEnLista(page)));
    const a = unico("Cliente A");
    const b = unico("Cliente B");

    await crearPresupuestoSencillo(page, a);
    await crearPresupuestoSencillo(page, b);

    expect(await numeroDe(page, a)).toBe(ultimo + 1);
    expect(await numeroDe(page, b)).toBe(ultimo + 2);

    const todos = await numerosEnLista(page);
    expect(new Set(todos).size).toBe(todos.length);
  });
});
