import { expect, test, type Page } from "@playwright/test";
import { abrir, capturarAlTerminar, crearPresupuestoSencillo, numerosEnLista, unico } from "./helpers";

capturarAlTerminar();

const SEGUIDOS = 10;

// Comprueba que lo creado después de `ultimo` es exactamente ultimo+1 … ultimo+SEGUIDOS
// (sin huecos y sin repetidos) y que en toda la lista no hay ningún número repetido.
// Los huecos solo se miran entre los nuevos: la numeración base de Ajustes puede saltar a propósito.
async function comprobarCorrelativos(page: Page, ultimo: number) {
  const todos = await numerosEnLista(page);
  expect(new Set(todos).size, "números repetidos en la lista").toBe(todos.length);

  const nuevos = todos.filter((n) => n > ultimo).sort((a, b) => a - b);
  const esperados = Array.from({ length: SEGUIDOS }, (_, i) => ultimo + 1 + i);
  expect(nuevos).toEqual(esperados);
}

test.describe("Terminado · numeración de diez presupuestos seguidos", () => {
  test("Terminado 4a · Se hacen diez presupuestos seguidos y la numeración sale correlativa, sin huecos ni números repetidos", async ({ page }) => {
    test.setTimeout(180_000);
    const ultimo = Math.max(0, ...(await numerosEnLista(page)));

    for (let i = 1; i <= SEGUIDOS; i++) {
      await crearPresupuestoSencillo(page, unico(`Cliente diez ${i}`));
    }

    await comprobarCorrelativos(page, ultimo);
  });

  // PENDIENTE: la parte con duplicados espera a "Duplicar" (Fase 3, criterios 13-15). Hoy no existe
  // ningún botón de duplicar ni en la lista ni en la ficha del presupuesto. Cuando exista, quitar
  // el `fixme`, ajustar `duplicarUltimo` al botón real y comprobar que pasa en ordenador y en móvil.
  test.fixme(
    "Terminado 4b · Se hacen diez presupuestos seguidos, creados y duplicados mezclados, y la numeración sale correlativa, sin huecos ni números repetidos",
    { annotation: { type: "pendiente", description: "Depende de Duplicar (Fase 3, criterios 13-15)" } },
    async ({ page }) => {
      test.setTimeout(180_000);
      const ultimo = Math.max(0, ...(await numerosEnLista(page)));

      // Empieza con dos nuevos para que haya algo que duplicar; después se mezclan.
      const orden = ["nuevo", "nuevo", "duplicar", "nuevo", "duplicar", "duplicar", "nuevo", "duplicar", "nuevo", "duplicar"];
      expect(orden).toHaveLength(SEGUIDOS);

      for (const [i, accion] of orden.entries()) {
        if (accion === "nuevo") await crearPresupuestoSencillo(page, unico(`Cliente mezcla ${i + 1}`));
        else await duplicarUltimo(page);
      }

      await comprobarCorrelativos(page, ultimo);
    },
  );
});

// Duplica el presupuesto con el número más alto. El botón y su recorrido son una suposición
// hasta que exista la historia de duplicar.
async function duplicarUltimo(page: Page) {
  await abrir(page, "/");
  await page.locator("tbody tr:visible, ul li:visible").first().getByRole("link").first().click();
  await page.getByRole("button", { name: "Duplicar" }).click();
  await abrir(page, "/");
}
