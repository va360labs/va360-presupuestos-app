import { expect, test } from "@playwright/test";
import { abrir, capturarAlTerminar, crearCliente, unico } from "./helpers";

capturarAlTerminar();

test.describe("Fase 2 · 2.1 Mis clientes guardados", () => {
  test("2.1.1 · Doy de alta a 'Laura Gómez', la edito para corregirle el teléfono y al volver a entrar veo el teléfono corregido", async ({ page }) => {
    const nombre = unico("Laura Gómez");
    await page.goto("/");
    await page.getByRole("link", { name: "Clientes" }).click();
    await expect(page).toHaveURL(/\/clientes$/);
    await page.getByRole("link", { name: "Nuevo cliente" }).click();

    await page.getByLabel("Nombre", { exact: true }).fill(nombre);
    await page.getByLabel("NIF", { exact: true }).fill("12345678Z");
    await page.getByLabel("Dirección", { exact: true }).fill("Calle Mayor 5, Valencia");
    await page.getByLabel("Teléfono", { exact: true }).fill("600000000");
    await page.getByLabel("Correo", { exact: true }).fill("laura@ejemplo.com");
    await page.getByRole("button", { name: "Guardar cliente" }).click();

    await expect(page).toHaveURL(/\/clientes$/);
    await page.getByRole("link", { name: nombre }).click();
    await page.getByLabel("Teléfono", { exact: true }).fill("611222333");
    await page.getByRole("button", { name: "Guardar cambios" }).click();

    await expect(page).toHaveURL(/\/clientes$/);
    await page.getByRole("link", { name: nombre }).click();
    await expect(page.getByLabel("Teléfono", { exact: true })).toHaveValue("611222333");
  });

  test("2.1.2 · Elijo a 'Laura Gómez' en el desplegable y veo aparecer su NIF y su dirección en el formulario sin teclear", async ({ page }) => {
    const nombre = unico("Laura Gómez");
    await crearCliente(page, { nombre, nif: "12345678Z", direccion: "Calle Mayor 5, Valencia" });

    await abrir(page, "/nuevo");
    await expect(page.getByLabel("NIF")).toHaveValue("");
    await page.getByLabel("Cliente guardado").selectOption({ label: nombre });

    await expect(page.getByLabel("NIF")).toHaveValue("12345678Z");
    await expect(page.getByLabel("Dirección")).toHaveValue("Calle Mayor 5, Valencia");
  });

  test("2.1.3 · Escribo un cliente nuevo en un presupuesto, guardo, empiezo otro presupuesto y ese cliente ya sale en el desplegable", async ({ page }) => {
    const nombre = unico("Cliente nuevo");
    await abrir(page, "/nuevo");
    await expect(page.getByLabel("Cliente guardado").locator("option", { hasText: nombre })).toHaveCount(0);
    await page.getByLabel("Nombre del cliente").fill(nombre);
    await page.getByLabel("NIF").fill("X1234567L");
    await page.getByLabel("Descripción").fill("Sesión de retrato");
    await page.getByLabel("Precio (€)").fill("150");
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);

    await abrir(page, "/nuevo");
    await expect(page.getByLabel("Cliente guardado").locator("option", { hasText: nombre })).toHaveCount(1);
  });

  test("2.1 · Criterio 1: Elijo un cliente que ya me contrató antes y sus datos aparecen puestos en el presupuesto sin que yo los escriba", async ({ page }) => {
    const nombre = unico("Marta Cliente");
    // Cliente que ya contrató: tiene un presupuesto hecho antes.
    await abrir(page, "/nuevo");
    await page.getByLabel("Nombre del cliente").fill(nombre);
    await page.getByLabel("NIF").fill("87654321X");
    await page.getByLabel("Dirección").fill("Plaza del Ayuntamiento 1");
    await page.getByLabel("Teléfono").fill("655443322");
    await page.getByLabel("Correo").fill("cliente@ejemplo.com");
    await page.getByLabel("Descripción").fill("Reportaje anterior");
    await page.getByLabel("Precio (€)").fill("500");
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);

    // Presupuesto nuevo: lo elijo y todo aparece solo.
    await abrir(page, "/nuevo");
    await page.getByLabel("Cliente guardado").selectOption({ label: nombre });
    await expect(page.getByLabel("Nombre del cliente")).toHaveValue(nombre);
    await expect(page.getByLabel("NIF")).toHaveValue("87654321X");
    await expect(page.getByLabel("Dirección")).toHaveValue("Plaza del Ayuntamiento 1");
    await expect(page.getByLabel("Teléfono")).toHaveValue("655443322");
    await expect(page.getByLabel("Correo")).toHaveValue("cliente@ejemplo.com");

    await page.getByLabel("Descripción").fill("Reportaje nuevo");
    await page.getByLabel("Precio (€)").fill("700");
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("tbody tr:visible, ul li:visible").filter({ hasText: nombre })).toHaveCount(2);
  });
});
