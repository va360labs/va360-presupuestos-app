# Handoff de sesión

- **Proyecto:** presupuestos-app (VA360 Academy)
- **Branch:** master
- **Último commit:** 3c2b7727 — "Corrige desbordamiento del botón en la lista de presupuestos en móvil y añade evidencias de la tarea 1.1"
- **Cambios sin commitear:** `CLAUDE.md` (regla 7 añadida: handoff obligatorio antes de cerrar sesión)
- **Backend de tracking:** Notion (base de datos "CURSO CLAUDE CODE PRESUPUESTOS")
- **Tarea activa:** ninguna en curso — 1.1 cerrada, 1.2 es la siguiente candidata

## Qué se hizo en esta sesión

- Se creó el repo git local e inicializó el scaffold: Next.js 16 (App Router, TypeScript) + Tailwind + Prisma 7.10.0 con adapter `better-sqlite3` (SQLite en dev).
- Se implementó la tarea **1.1 Formulario de presupuesto nuevo** completa: formulario de cliente a mano, líneas de concepto dinámicas, total reactivo, guardado con numeración correlativa automática y aviso de salida sin guardar.
- Se construyó una lista mínima en `/` (tabla en escritorio, tarjetas en móvil) necesaria para verificar 1.1.4.
- Se probó funcionalmente: build sin errores, prueba de numeración correlativa (1,2,3 sin huecos) vía script, y verificación visual con capturas de Chrome headless en escritorio y móvil.
- Se detectó y corrigió un bug real: el botón "Nuevo presupuesto" se desbordaba en pantallas estrechas (< 390px). Arreglado apilando el encabezado en vertical por debajo de `sm:`.
- Se subieron las 3 capturas de evidencia directamente a las páginas de Notion de 1.1 y sus subtareas, con documentación de qué se hizo y qué se probó en cada una.
- Se corrigió el commit inicial (amend) para quitar la atribución a Claude, y se estableció que ningún commit/documentación debe mencionar IA (regla 6 de CLAUDE.md, ya existente pero verificada/aplicada).
- Se marcaron en Notion: 1.1, 1.1.1, 1.1.2, 1.1.3 y 1.1.4 como **Hecho**. 1.2, 1.3 y 1.4 (y sus subtareas) se dejaron explícitamente en **Por hacer** porque no están implementadas — el usuario confirmó no darlas por terminadas sin evidencia.

## Decisiones tomadas

- **Stack** → Next.js (TS, App Router) + Tailwind + Prisma/SQLite con driver adapter `better-sqlite3`, delegado por el usuario ("elige tú, que sea escalable, rápido y vendible"). SQLite es solo para desarrollo; el schema Prisma es portable a Postgres sin reescribir código cuando haya que escalar/vender.
- **Prisma pinneado a 7.10.0** (no la última `8.0.0-rc.15`, que es release candidate) para evitar construir sobre una versión inestable.
- **Numeración de 1.1** es solo "siguiente número disponible" (max+1 dentro de una transacción). No es a prueba de escrituras verdaderamente concurrentes — eso es exactamente el alcance de la tarea 1.2 (1.2.1 número inicial configurable, 1.2.3 impedir colisión con escrituras casi simultáneas), que queda pendiente.
- **Convención de proceso (CLAUDE.md):** ninguna tarea se da por "Hecho" sin evidencia (test + pantallazos); estado se mueve a "En desarrollo" antes de empezar y a "En pruebas" cuando queda pendiente de que el usuario la valide; toda la documentación vive en Notion; nunca mencionar Claude/Claude Code en git/comentarios/commits/documentación (atribuido a Valentín Ayesa, VA360 Academy); handoff obligatorio antes de cerrar sesión (regla 7, añadida por el usuario en esta sesión, aún sin commitear).

## Preguntas abiertas / pendiente de decidir

- ¿Se implementan 1.2, 1.3 y 1.4 en la próxima sesión para cerrar formalmente la Fase 1, o se sigue iterando tarea a tarea con validación del usuario entre medias?
- La base de datos SQLite de desarrollo (`dev.db`, gitignorada) tiene datos de prueba de esta sesión (incluye un registro real creado por el usuario al probar la app). No se ha limpiado; decidir si importa antes de seguir.
- Falta decidir si el checkbox de "aceptado/rechazado" y el filtro por cliente (tarea 1.3) necesitan algún dato de ejemplo realista antes de empezar, dado que Marta trabaja con datos reales de bodas/retrato/producto.

## Próximo paso concreto

Empezar la tarea **1.2 — Numeración correlativa que no se repite**: implementar 1.2.1 (permitir indicar el número de partida, ej. "mi último fue el 137"), reforzar 1.2.2/1.2.3 para que dos guardados casi simultáneos (ordenador + móvil) no puedan generar el mismo número — la transacción actual con `findFirst` + `create` no lo garantiza bajo concurrencia real, hace falta un mecanismo con reintento o constraint transaccional más fuerte. Seguir el mismo procedimiento: mover a "En desarrollo" en Notion antes de tocar código, implementar, probar (incluyendo un test de dos guardados simultáneos), capturar evidencia, documentar en Notion y mover a "En pruebas".
