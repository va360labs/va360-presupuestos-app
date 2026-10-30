// Junta en una sola imagen las capturas de ordenador y móvil de una tarea (para subirla a Notion).
// Uso: node tests/e2e/hoja-evidencias.mjs <prefijo-de-tarea> <salida.png>   (ej.: 2.1 evidencias/e2e/hoja-2.1.png)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const [prefijo, salida] = process.argv.slice(2);
if (!prefijo || !salida) throw new Error("Uso: hoja-evidencias.mjs <prefijo> <salida.png>");

const dirEvidencias = path.resolve("evidencias/e2e");
const specs = fs.readdirSync("tests/e2e").filter((f) => f.endsWith(".spec.ts"));
const titulos = new Map();
for (const f of specs) {
  const texto = fs.readFileSync(path.join("tests/e2e", f), "utf8");
  for (const m of texto.matchAll(/test\("((\d+(?:\.\d+)*) · [^"]+)"/g)) titulos.set(m[2], m[1]);
}

const codigos = [...titulos.keys()]
  .filter((c) => c === prefijo || c.startsWith(prefijo + "."))
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
if (codigos.length === 0) throw new Error(`No hay pruebas para ${prefijo}`);

const url = (codigo, tam) => pathToFileURL(path.join(dirEvidencias, `${codigo}-${tam}.png`)).href;
const filas = codigos
  .map(
    (c) => `<section>
  <h2>${titulos.get(c).replace(/</g, "&lt;")}</h2>
  <div class="fila">
    <figure><figcaption>Ordenador</figcaption><img class="pc" src="${url(c, "escritorio")}"></figure>
    <figure><figcaption>Móvil (iPhone 15)</figcaption><img class="movil" src="${url(c, "movil-iphone")}"></figure>
  </div>
</section>`,
  )
  .join("\n");

const html = `<!doctype html><meta charset="utf-8"><style>
body{font-family:Segoe UI,Arial,sans-serif;margin:24px;width:1040px;background:#fff;color:#111}
h2{font-size:15px;margin:28px 0 8px;line-height:1.35}
.fila{display:flex;gap:20px;align-items:flex-start}
figure{margin:0}figcaption{font-size:12px;color:#666;margin-bottom:4px}
img{border:1px solid #ccc;display:block;object-fit:cover;object-position:top}
.pc{width:640px;max-height:640px}.movil{width:250px;max-height:640px}
</style><h1 style="font-size:20px">Evidencias de la tarea ${prefijo} · pruebas end to end</h1>${filas}`;

const tmp = path.join(os.tmpdir(), `hoja-${prefijo}.html`);
fs.writeFileSync(tmp, html);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1090, height: 800 } });
await page.goto(pathToFileURL(tmp).href);
await page.waitForLoadState("load");
await page.screenshot({ path: path.resolve(salida), fullPage: true });
await browser.close();
console.log("Hoja creada:", salida);
