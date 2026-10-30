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

// Abre una pantalla y espera a que React termine de hidratarla: si se escribe antes,
// los campos controlados se vacían al hidratar (sobre todo en WebKit).
export async function abrir(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
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
  await abrir(page, "/nuevo");
  await page.getByLabel("Nombre del cliente").fill(cliente);
  await page.getByLabel("Descripción").fill("Reportaje de prueba");
  await page.getByLabel("Precio (€)").fill("100");
  await page.getByRole("button", { name: "Guardar presupuesto" }).click();
  await expect(page).toHaveURL(/\/$/);
}

export type DatosCliente = {
  nombre: string;
  nif?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
};

// Da de alta un cliente desde la pantalla de clientes, como lo haría Marta.
export async function crearCliente(page: Page, c: DatosCliente) {
  await abrir(page, "/clientes/nuevo");
  await page.getByLabel("Nombre", { exact: true }).fill(c.nombre);
  if (c.nif) await page.getByLabel("NIF", { exact: true }).fill(c.nif);
  if (c.direccion) await page.getByLabel("Dirección", { exact: true }).fill(c.direccion);
  if (c.telefono) await page.getByLabel("Teléfono", { exact: true }).fill(c.telefono);
  if (c.correo) await page.getByLabel("Correo", { exact: true }).fill(c.correo);
  await page.getByRole("button", { name: "Guardar cliente" }).click();
  await expect(page).toHaveURL(/\/clientes$/);
}
