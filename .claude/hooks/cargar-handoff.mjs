#!/usr/bin/env node
// Hook para SessionStart. Si existe .quality/handoff.md lo escribe por la salida
// estándar, que Claude Code incorpora como contexto al empezar la sesión. Si el
// archivo no existe no hace nada. Nunca bloquea: ante cualquier fallo avisa por
// stderr y sale con 0.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz =
  process.env.CLAUDE_PROJECT_DIR ??
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const ruta = path.join(raiz, ".quality", "handoff.md");

if (!fs.existsSync(ruta)) process.exit(0);

try {
  const contenido = fs.readFileSync(ruta, "utf8");
  if (contenido.trim()) process.stdout.write(contenido);
} catch (error) {
  console.error(
    `cargar-handoff.mjs: no se pudo leer ${ruta} (${error.message}).`,
  );
}
process.exit(0);
