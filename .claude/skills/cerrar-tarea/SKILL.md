---
name: cerrar-tarea
description: Cierra una tarea del proyecto. Pasa sus pruebas e2e en ordenador y móvil, documenta y sube las evidencias a Notion, mueve la tarjeta a Hecho, hace commit en su rama y deja el handoff.
argument-hint: <número de tarea, p. ej. 2.1>
disable-model-invocation: true
---

# Cerrar la tarea $ARGUMENTS

Si no hay número de tarea, pídelo y no sigas. Haz los pasos en este orden. Si uno falla, para y dime qué ha fallado, sin pasar al siguiente.

1. **Pruebas end to end.** Ejecuta las pruebas de la tarea en los dos proyectos (`escritorio` y `movil-iphone`):
   `npx playwright test -g " $ARGUMENTS(\.\d+)* · "` (con los puntos del número escapados, p. ej. `2\.1`).
   Si no encuentra ninguna prueba o alguna falla, para y enséñame la salida del error.

2. **Notion.** Genera la hoja de evidencias con `node tests/e2e/hoja-evidencias.mjs $ARGUMENTS evidencias/e2e/hoja-$ARGUMENTS.png`. Busca la tarjeta de la tarea en la base "CURSO CLAUDE CODE PRESUPUESTOS", sube la hoja a esa tarjeta y escribe en ella qué se ha hecho: cambios, decisiones y resultado de las pruebas.

3. **Estado.** Mueve la tarjeta a "Hecho".

4. **Commit.** En la rama de la tarea (`feature/$ARGUMENTS` o `feature/$ARGUMENTS-…`), añade solo los archivos de la tarea y haz commit con un mensaje en español. No menciones a Claude ni a Claude Code y no añadas `Co-Authored-By` (norma 1 del CLAUDE.md). Si hay cambios ajenos a la tarea, pregúntame antes. No hagas push.

5. **Handoff.** Ejecuta la skill `handoff` con lo hecho en la sesión, las decisiones importantes y el siguiente paso.

Al terminar, dame un resumen de dos o tres líneas: pruebas, enlace a la tarjeta y hash del commit.
