import { expect, test, type Page } from "@playwright/test";
import { abrir, capturarAlTerminar, unico } from "./helpers";

capturarAlTerminar();

const tipo = (page: Page) => page.getByLabel("Tipo de trabajo");

const CAMPOS = {
  Boda: ["Fecha del enlace", "Lugares", "Horas de cobertura"],
  Retrato: ["Número de personas", "Estudio o exterior", "Fotos entregadas"],
  Producto: ["Número de piezas", "Tipo de fondo", "Uso de las imágenes"],
};

async function soloLosCamposDe(page: Page, elegido: keyof typeof CAMPOS) {
  for (const [nombre, campos] of Object.entries(CAMPOS)) {
    for (const campo of campos) {
      const control = page.getByLabel(campo);
      if (nombre === elegido) await expect(control).toBeVisible();
      else await expect(control).toHaveCount(0);
    }
  }
}

test.describe("Fase 2 · 2.3 Boda, retrato o producto", () => {
  test("2.3.1 · Pulso 'Nuevo presupuesto', elijo 'Boda' y el formulario se abre marcado como boda", async ({ page }) => {
    const cliente = unico("Cliente boda");
    await page.goto("/");
    await page.getByRole("link", { name: "Nuevo presupuesto" }).click();
    await expect(page).toHaveURL(/\/nuevo$/);
    await page.waitForLoadState("networkidle");

    await tipo(page).selectOption({ label: "Boda" });
    await expect(page.getByText("Presupuesto de boda")).toBeVisible();

    // El tipo se ve luego en el presupuesto guardado.
    await page.getByLabel("Nombre del cliente").fill(cliente);
    await page.getByLabel("Descripción").fill("Reportaje de boda");
    await page.getByLabel("Precio (€)").fill("1400");
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.locator("tbody tr:visible, ul li:visible").filter({ hasText: cliente }).getByRole("link").first().click();
    await expect(tipo(page).locator("option:checked")).toHaveText("Boda");
    await expect(page.getByText("Presupuesto de boda")).toBeVisible();
  });

  test("2.3.2 · Elijo 'Boda' y veo en pantalla fecha del enlace y horas de cobertura; cambio a 'Producto' y esos campos desaparecen y me piden número de piezas", async ({ page }) => {
    await abrir(page, "/nuevo");
    // Sin elegir tipo todavía no se pide ningún dato propio.
    for (const campo of [...CAMPOS.Boda, ...CAMPOS.Retrato, ...CAMPOS.Producto]) {
      await expect(page.getByLabel(campo)).toHaveCount(0);
    }

    await tipo(page).selectOption({ label: "Boda" });
    await expect(page.getByLabel("Fecha del enlace")).toBeVisible();
    await expect(page.getByLabel("Horas de cobertura")).toBeVisible();

    await tipo(page).selectOption({ label: "Producto" });
    await expect(page.getByLabel("Fecha del enlace")).toHaveCount(0);
    await expect(page.getByLabel("Horas de cobertura")).toHaveCount(0);
    await expect(page.getByLabel("Número de piezas")).toBeVisible();
  });

  test("2.3.3 · Cambio de 'Boda' a 'Retrato' y el cliente y las dos líneas que había siguen en pantalla", async ({ page }) => {
    const cliente = unico("Cliente cambio");
    await abrir(page, "/nuevo");
    await tipo(page).selectOption({ label: "Boda" });
    await page.getByLabel("Nombre del cliente").fill(cliente);
    await page.getByLabel("Descripción").fill("Reportaje");
    await page.getByLabel("Precio (€)").fill("900");
    await page.getByRole("button", { name: "+ Añadir línea" }).click();
    await page.getByLabel("Descripción").nth(1).fill("Álbum");
    await page.getByLabel("Precio (€)").nth(1).fill("120");

    await tipo(page).selectOption({ label: "Retrato" });

    await expect(page.getByLabel("Nombre del cliente")).toHaveValue(cliente);
    await expect(page.getByLabel("Descripción")).toHaveCount(2);
    await expect(page.getByLabel("Descripción").nth(0)).toHaveValue("Reportaje");
    await expect(page.getByLabel("Descripción").nth(1)).toHaveValue("Álbum");
    await expect(page.getByLabel("Fecha del enlace")).toHaveCount(0);
    await expect(page.getByLabel("Número de personas")).toBeVisible();
  });

  test("2.3 · Criterio 3: Digo si es boda, retrato o producto y me piden los datos propios de ese tipo, no los de los otros dos", async ({ page }) => {
    const cliente = unico("Cliente retrato");
    await abrir(page, "/nuevo");

    for (const elegido of ["Boda", "Retrato", "Producto"] as const) {
      await tipo(page).selectOption({ label: elegido });
      await soloLosCamposDe(page, elegido);
    }

    // Los datos propios del tipo se guardan con el presupuesto.
    await tipo(page).selectOption({ label: "Retrato" });
    await page.getByLabel("Número de personas").fill("4");
    await page.getByLabel("Estudio o exterior").selectOption({ label: "Exterior" });
    await page.getByLabel("Fotos entregadas").fill("30");
    await page.getByLabel("Nombre del cliente").fill(cliente);
    await page.getByLabel("Descripción").fill("Sesión de retrato familiar");
    await page.getByLabel("Precio (€)").fill("250");
    await page.getByRole("button", { name: "Guardar presupuesto" }).click();
    await expect(page).toHaveURL(/\/$/);

    await page.locator("tbody tr:visible, ul li:visible").filter({ hasText: cliente }).getByRole("link").first().click();
    await expect(tipo(page).locator("option:checked")).toHaveText("Retrato");
    await expect(page.getByLabel("Número de personas")).toHaveValue("4");
    await expect(page.getByLabel("Estudio o exterior").locator("option:checked")).toHaveText("Exterior");
    await expect(page.getByLabel("Fotos entregadas")).toHaveValue("30");
    await soloLosCamposDe(page, "Retrato");
  });
});
