#!/usr/bin/env node
// Hook PostToolUse para Write y Edit. Lee el JSON del hook por la entrada
// estándar y pasa Prettier solo por el archivo que se acaba de modificar.
// No hace nada si el archivo no existe, está en .prettierignore o es de un tipo
// que Prettier no entiende. Nunca bloquea: ante cualquier fallo avisa por
// stderr y sale con 0, porque el archivo ya está escrito.
import fs from 'node:fs';
import path from 'node:path';

let entrada = '';
process.stdin.setEncoding('utf8');
for await (const trozo of process.stdin) entrada += trozo;

let datos;
try {
  datos = JSON.parse(entrada);
} catch (error) {
  console.error(`formatear.mjs: no se pudo leer la entrada del hook (${error.message}).`);
  process.exit(0);
}

const ruta = datos?.tool_input?.file_path;
if (typeof ruta !== 'string' || !fs.existsSync(ruta)) process.exit(0);

try {
  const prettier = await import('prettier');
  const raiz = process.env.CLAUDE_PROJECT_DIR ?? datos.cwd ?? process.cwd();
  const ignorar = path.join(raiz, '.prettierignore');

  const info = await prettier.getFileInfo(ruta, {
    ignorePath: fs.existsSync(ignorar) ? ignorar : undefined,
    resolveConfig: true,
  });
  if (info.ignored || !info.inferredParser) process.exit(0);

  const configuracion = (await prettier.resolveConfig(ruta)) ?? {};
  const original = fs.readFileSync(ruta, 'utf8');
  // 'auto' conserva los saltos de línea que ya tiene el archivo (CRLF en este
  // checkout de Windows) y evita reescribirlo entero por un cambio de EOL.
  const formateado = await prettier.format(original, {
    endOfLine: 'auto',
    ...configuracion,
    filepath: ruta,
  });
  if (formateado !== original) fs.writeFileSync(ruta, formateado);
} catch (error) {
  console.error(`formatear.mjs: no se pudo formatear ${ruta} (${error.message}).`);
}
process.exit(0);
