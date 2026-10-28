// Flujo móvil (375 px) por CDP: mide tamaños táctiles, crea un presupuesto y captura pantallas.
import { spawn } from "node:child_process";
import fs from "node:fs";

const OUT = process.argv[2];
const BASE = "http://localhost:3100";
const PORT = 9334;
const chrome = spawn(
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  [
    "--headless=new", "--disable-gpu", `--remote-debugging-port=${PORT}`,
    "--user-data-dir=" + process.env.TEMP + "/cdp-profile-movil",
    "--window-size=500,900", "about:blank",
  ],
  { stdio: "ignore" },
);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let targets;
for (let i = 0; i < 50; i++) {
  try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); break; } catch { await sleep(200); }
}
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;
const goto = async (url) => { await send("Page.navigate", { url }); await sleep(2500); };
const W = 375, H = 800;
const shot = async (name, full = false) => {
  let clip;
  if (full) {
    const alto = await evaluate("document.documentElement.scrollHeight");
    clip = { x: 0, y: 0, width: W, height: alto, scale: 1 };
  }
  const r = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: full, ...(clip ? { clip } : {}) });
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, "base64"));
  console.log("captura", name);
};

const SET = `const set = (el, v) => { const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event('input', { bubbles: true })); };`;

const medir = () => evaluate(`(() => {
  const els = [...document.querySelectorAll('input:not([type=hidden]), textarea, button, a')];
  const chicos = els.map(e => { const r = e.getBoundingClientRect(); return { t: (e.getAttribute('name') || e.textContent || e.placeholder || e.tagName).trim().slice(0, 25), h: Math.round(r.height), tag: e.tagName }; })
    .filter(x => x.h < 44 && x.h > 0);
  const campos = [...document.querySelectorAll('input:not([type=hidden]), textarea')];
  return JSON.stringify({
    scrollHorizontal: document.documentElement.scrollWidth > innerWidth,
    scrollWidth: document.documentElement.scrollWidth, innerWidth,
    elementosMenosDe44px: chicos,
    inputModeNumericos: [...new Set([...document.querySelectorAll('input[type=number]')].map(e => e.inputMode))],
    fuenteMinimaCampos: campos.length ? Math.min(...campos.map(e => parseFloat(getComputedStyle(e).fontSize))) : null,
  });
})()`);

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: W, height: H, deviceScaleFactor: 2, mobile: true });

await goto(BASE + "/");
console.log("LISTA", await medir());
await shot("1.4-movil-lista");

await goto(BASE + "/nuevo");
console.log("FORM", await medir());
await shot("1.4-movil-formulario-vacio");

await evaluate(`(() => { ${SET}
  set(document.querySelector('input[name=clienteNombre]'), 'Cliente prueba móvil');
  set(document.querySelector('input[name=clienteTelefono]'), '600111222');
  set(document.querySelector('input[placeholder^=Reportaje]'), 'Sesión retrato');
  set(document.querySelectorAll('input[type=number]')[1], '150');
})()`);
await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Añadir línea')).click()`);
await sleep(400);
await evaluate(`(() => { ${SET}
  set(document.querySelectorAll('input[placeholder^=Reportaje]')[1], 'Revelado');
  const n = document.querySelectorAll('input[type=number]');
  set(n[2], '2'); set(n[3], '25');
})()`);
await sleep(400);
await shot("1.4-movil-formulario-relleno", true);
console.log("TOTAL", await evaluate(`document.body.innerText.split('Total').pop().trim().slice(0, 20)`));

await evaluate(`[...document.querySelectorAll('button')].find(b => b.textContent.includes('Guardar presupuesto')).click()`);
await sleep(3500);
console.log("url", await evaluate("location.href"));
console.log("LISTA2", await medir());
await shot("1.4-movil-lista-tras-crear");

ws.close();
chrome.kill();
process.exit(0);
