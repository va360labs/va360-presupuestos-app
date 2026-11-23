import { expect, test } from "@playwright/test";
import { abrir, capturarAlTerminar, crearServicio, unico } from "./helpers";

capturarAlTerminar();

test.describe("Fase 2 · 2.2 Mis servicios habituales con su precio", () => {
  test("2.2.1 · Doy de alta 'Reportaje de boda 8 h — 1.400 €' y lo veo en mi lista de servicios", async ({ page }) => {
    const servicio = unico("Reportaje de boda 8 h");
    await page.goto("/");
    await page.getByRole("link", { name: "Servicios" }).click();
    await expect(page).toHaveURL(/\/servicios$/);
    await page.getByRole("link", { name: "Nuevo servicio" }).click();

    await page.getByLabel("Descripción").fill(servicio);
    await page.getByLabel("Precio (€)").fill("1400");
    await page.getByRole("button", { name: "Guardar servicio" }).click();

    await expect(page).toHaveURL(/\/servicios$/);
    const fila = page.getByRole("listitem").filter({ hasText: servicio });
    await expect(fila).toBeVisible();
    await expect(fila).toContainText(/1\.?400,00/);

    // Editar el precio y borrar otro servicio también forman parte del catálogo.
    await fila.getByRole("link").click();
    await page.getByLabel("Precio (€)").fill("1500");
    await page.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(page.getByRole("listitem").filter({ hasText: servicio })).toContainText(/1\.?500,00/);

    const sobrante = unico("Servicio a borrar");
    await crearServicio(page, sobrante, 10);
    await page.getByRole("listitem").filter({ hasText: sobrante }).getByRole("link").click();
    await page.getByRole("button", { name: "Borrar servicio" }).click();
    await page.getByRole("button", { name: "Sí, borrar" }).click();
    await expect(page).toHaveURL(/\/servicios$/);
    await expect(page.getByText(sobrante)).toHaveCount(0);
  });

  test("2.2.2 · Elijo 'Reportaje de boda 8 h' y aparece una línea con 1.400 € sin que yo teclee la cifra", async ({ page }) => {
    const servicio = unico("Reportaje de boda 8 h");
    await crearServicio(page, servicio, 1400);

    await abrir(page, "/nuevo");
    await page.getByLabel("Añadir servicio guardado").selectOption({ label: servicio });

    await expect(page.getByLabel("Descripción")).toHaveValue(servicio);
    await expect(page.getByLabel("Precio (€)")).toHaveValue("1400");
    await expect(page.getByText(/Total/).locator("..")).toContainText(/1\.?400,00/);
  });

  test("2.2.3 · Bajo el precio a 1.200 € en un presupuesto, guardo, abro mi lista de servicios y ahí sigue poniendo 1.400 €", async ({ page }) => {
    const servicio = unico("Reportaje de boda 8 h");
    await crearServicio(page, servicio, 1400);

    await abrir(page, "/nuevo");
    await page.getByLabel("Añadir servicio guardado").selectOption({ label: servicio });
    await page.getByLabel("Precio (€)").fill("1200");
    await page.getByLabel("Nombre del cliente").fill(unico("Cliente"));
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.goto("/servicios");
    const fila = page.getByRole("listitem").filter({ hasText: servicio });
    await expect(fila).toContainText(/1\.?400,00/);
    await expect(fila).not.toContainText(/1\.?200,00/);
  });

  test("2.2 · Criterio 2: Añado un servicio habitual y entra con su precio ya puesto; si lo cambio en este presupuesto, mi lista de servicios sigue con el precio de antes", async ({ page }) => {
    const servicio = unico("Sesión de retrato");
    const cliente = unico("Cliente retrato");
    await crearServicio(page, servicio, 300);

    await abrir(page, "/nuevo");
    await page.getByLabel("Añadir servicio guardado").selectOption({ label: servicio });
    await expect(page.getByLabel("Precio (€)")).toHaveValue("300");

    await page.getByLabel("Precio (€)").fill("250");
    await page.getByLabel("Nombre del cliente").fill(cliente);
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator("tbody tr:visible, ul li:visible").filter({ hasText: cliente })).toContainText(/250,00/);

    await page.goto("/servicios");
    await expect(page.getByRole("listitem").filter({ hasText: servicio })).toContainText(/300,00/);
  });
});
