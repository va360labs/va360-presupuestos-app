import { expect, test, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { capturarAlTerminar, crearCliente, crearServicio, unico } from "./helpers";

capturarAlTerminar();

const LIMITE_MS = Number(process.env.LIMITE_MS ?? 120_000);
// Usuaria simulada: teclea a 120 ms por carácter y tarda 1 s en decidir cada paso.
// Es una aproximación del reloj de Marta, no sustituye a que ella lo cronometre.
const TECLEO_MS = 120;
const PAUSA_MS = 1_000;

const TIEMPOS = path.resolve("evidencias/e2e/tiempos-2.4.json");

type Preparacion = { cliente: string; servicioA: string; servicioB: string };

async function prepararCatalogo(page: Page): Promise<Preparacion> {
  const datos = {
    cliente: unico("Laura Gómez"),
    servicioA: unico("Reportaje de boda 8 h"),
    servicioB: unico("Álbum 30 fotos"),
  };
  await crearCliente(page, {
    nombre: datos.cliente,
    nif: "12345678Z",
    direccion: "Calle Mayor 5, Valencia",
    telefono: "611222333",
    correo: "laura@ejemplo.com",
  });
  await crearServicio(page, datos.servicioA, 1400);
  await crearServicio(page, datos.servicioB, 150);
  return datos;
}

// Un presupuesto completo de principio a fin; devuelve los milisegundos que ha tardado.
async function presupuestoCompleto(page: Page, datos: Preparacion) {
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  const pensar = () => page.waitForTimeout(PAUSA_MS);

  const inicio = Date.now();
  await pensar();
  await page.getByRole("link", { name: "Nuevo presupuesto" }).click();
  await expect(page).toHaveURL(/\/nuevo$/);
  await page.waitForLoadState("networkidle");

  await pensar();
  await page.getByLabel("Tipo de trabajo").selectOption({ label: "Boda" });
  await pensar();
  await page.getByLabel("Fecha del enlace").fill("2027-06-19");
  await pensar();
  await page.getByLabel("Lugares").pressSequentially("Finca La Torre", { delay: TECLEO_MS });
  await pensar();
  await page.getByLabel("Horas de cobertura").pressSequentially("8", { delay: TECLEO_MS });

  await pensar();
  await page.getByLabel("Cliente guardado").selectOption({ label: datos.cliente });
  await pensar();
  await page.getByLabel("Añadir servicio guardado").selectOption({ label: datos.servicioA });
  await pensar();
  await page.getByLabel("Añadir servicio guardado").selectOption({ label: datos.servicioB });

  await pensar();
  await page.getByLabel("Condiciones").pressSequentially("50 % de adelanto", { delay: TECLEO_MS });

  await pensar();
  await page.getByRole("button", { name: "Guardar presupuesto" }).click();
  await expect(page).toHaveURL(/\/$/);
  const fila = page.locator("tbody tr:visible, ul li:visible").filter({ hasText: datos.cliente }).first();
  await expect(fila).toBeVisible();
  const total = Date.now() - inicio;

  // Lo que se ha hecho es lo esperado: cliente, importe sumado y pendiente.
  await expect(fila).toContainText(/1\.?550,00/);
  await expect(fila).toContainText("Pendiente");
  return total;
}

function apuntarTiempos(proyecto: string, tiempos: number[]) {
  const actual = fs.existsSync(TIEMPOS) ? JSON.parse(fs.readFileSync(TIEMPOS, "utf8")) : {};
  actual[proyecto] = tiempos.map((ms) => Math.round(ms / 100) / 10);
  fs.writeFileSync(TIEMPOS, JSON.stringify(actual, null, 2) + "\n");
}

test.describe("Fase 2 · 2.4 La prueba de los dos minutos", () => {
  test("2.4 · Con el reloj delante, hago un presupuesto de principio a fin en dos minutos o menos, en el ordenador y también en el móvil", async ({ page }) => {
    test.setTimeout(180_000);
    const datos = await prepararCatalogo(page);
    const ms = await presupuestoCompleto(page, datos);
    test.info().annotations.push({ type: "tiempo", description: `${(ms / 1000).toFixed(1)} s` });
    expect(ms).toBeLessThan(LIMITE_MS);
  });

  test("2.4.1 · Tengo apuntado el tiempo de tres intentos seguidos y los tres bajan de dos minutos", async ({ page }) => {
    test.setTimeout(300_000);
    const datos = await prepararCatalogo(page);
    const tiempos: number[] = [];
    for (let intento = 1; intento <= 3; intento++) {
      tiempos.push(await presupuestoCompleto(page, datos));
    }
    apuntarTiempos(test.info().project.name, tiempos);
    test.info().annotations.push({
      type: "tiempos",
      description: tiempos.map((ms) => `${(ms / 1000).toFixed(1)} s`).join(" · "),
    });

    expect(tiempos).toHaveLength(3);
    for (const ms of tiempos) expect(ms).toBeLessThan(LIMITE_MS);
  });
});
