#!/usr/bin/env node
// Hook para Stop y Notification. Hace sonar un sonido de Windows según el
// argumento: "fin" cuando Claude termina y "aviso" cuando necesita algo de
// nosotros (por ejemplo, un permiso). Nunca bloquea: ante cualquier fallo avisa
// por stderr y sale con 0.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const SONIDOS = {
  fin: "tada.wav",
  aviso: "Windows Exclamation.wav",
};

const tipo = process.argv[2];
const archivo = SONIDOS[tipo];
if (!archivo) {
  console.error(
    `sonido.mjs: argumento "${tipo ?? ""}" no válido; usa "fin" o "aviso".`,
  );
  process.exit(0);
}

const ruta = path.join(
  process.env.SystemRoot ?? "C:\\Windows",
  "Media",
  archivo,
);
if (!fs.existsSync(ruta)) {
  console.error(`sonido.mjs: no existe ${ruta}.`);
  process.exit(0);
}

// La ruta viaja por variable de entorno para no pelear con las comillas.
// PlaySync bloquea hasta que el sonido termina, así el proceso no se cierra antes.
const resultado = spawnSync(
  "powershell.exe",
  [
    "-NoProfile",
    "-NonInteractive",
    "-Command",
    "(New-Object System.Media.SoundPlayer $env:SONIDO_RUTA).PlaySync()",
  ],
  {
    env: { ...process.env, SONIDO_RUTA: ruta },
    stdio: "ignore",
    windowsHide: true,
    timeout: 10000,
  },
);
if (resultado.error)
  console.error(
    `sonido.mjs: no se pudo reproducir (${resultado.error.message}).`,
  );
process.exit(0);
