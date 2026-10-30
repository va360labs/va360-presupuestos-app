import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const EVIDENCIAS = path.resolve("evidencias/e2e");

// Registra la captura final de cada prueba (también si falla).
// El nombre sale del título: "2.1.1 · ..." -> 2.1.1-escritorio.png, "Criterio 4: ..." -> criterio-4-escritorio.png
export function capturarAlTerminar() {
  test.afterEach(async ({ page }, testInfo) => {
    const codigo = testInfo.title.match(/^(\d+(?:\.\d+)*)\s·/)?.[1];
    const criterio = testInfo.title.match(/^Criterio (\d+)/)?.[1];
    const base = codigo ?? `criterio-${criterio}`;
    fs.mkdirSync(EVIDENCIAS, { recursive: true });
    await page.screenshot({
      path: path.join(EVIDENCIAS, `${base}-${testInfo.project.name}.png`),
      fullPage: true,
    });
  });
}

// Sufijo único por ejecución y tamaño de pantalla, para que los datos de una prueba no choquen con otra.
export function unico(texto: string) {
  return `${texto} ${test.info().project.name} ${Date.now().toString(36)}`;
}

export async function numerosEnLista(page: Page) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Escritorio: tabla (primera celda = nº). Móvil: tarjetas ("#5 · Cliente").
  const filas = await page.locator("tbody tr:visible, ul li:visible").allInnerTexts();
  return filas.map((t) => Number(t.match(/^#?(\d+)/)?.[1]));
}

export async function numeroDe(page: Page, cliente: string) {
  const fila = page.locator("tbody tr:visible, ul li:visible").filter({ hasText: cliente }).first();
  await expect(fila).toBeVisible();
  return Number((await fila.innerText()).match(/^#?(\d+)/)?.[1]);
}

export async function crearPresupuestoSencillo(page: Page, cliente: string) {
  await page.goto("/nuevo");
  await page.getByLabel("Nombre del cliente").fill(cliente);
  await page.getByLabel("Descripción").fill("Reportaje de prueba");
  await page.getByLabel("Precio (€)").fill("100");
  await page.getByRole("button", { name: "Guardar presupuesto" }).click();
  await expect(page).toHaveURL(/\/$/);
}
