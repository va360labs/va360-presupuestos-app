# Handoff de sesión

- **Proyecto:** va360-presupuestos-app (VA360 Academy) — https://github.com/va360labs/va360-presupuestos-app (público)
- **Rama actual:** `develop`
- **Backend de tracking:** Notion (base de datos "CURSO CLAUDE CODE PRESUPUESTOS")
- **Estado:** Fases 1 y 2 enteras en "Hecho" (la 2 cerrada el 23/11/2026). Fases 3 y 4 en "Por hacer".

## Qué se hizo en la última sesión (23/11/2026)

- Repositorio en orden: `feature/e2e-diez-presupuestos` integrada en `develop`; `.claude/` versionado (hooks, reglas, skill `cerrar-tarea`, plugin) salvo `.claude/settings.local.json`, que va al `.gitignore`; Prettier en `package.json`.
- **Lockfile arreglado:** `overrides` en `package.json` hace que el adaptador de Prisma use el `better-sqlite3` 13 del proyecto. `npm install` ya funciona en Windows sin compilar nada.
- **Fase 2 validada y cerrada:** batería completa en `develop`, 32 pruebas en verde en ordenador y iPhone 15, y 2 saltadas (la parte con duplicados de la prueba de diez presupuestos, que espera a "duplicar"). Las 12 tarjetas que faltaban, con su sección "Cierre" y su hoja de evidencias, pasan a "Hecho". vitest 8/8 y lint limpio.
- `master` local actualizado con el de GitHub (PR #7).

## Decisiones que siguen vigentes

- Una rama por tarea desde `develop` (`feature/<número>-…`); las subtareas se commitean en la rama de su tarea padre. A `master` solo con PR que apruebe el usuario.
- Una prueba e2e por criterio, con el código (`2.1.1 · …`) como prefijo; capturas en `evidencias/e2e/` y una hoja de evidencias por tarea o subtarea al cerrarla.
- Los datos del cliente y las líneas se **copian** en el presupuesto: editar un cliente o un servicio no cambia presupuestos ya hechos.
- El tipo de trabajo (boda, retrato, producto) es opcional para no invalidar los presupuestos de la Fase 1.
- Las pruebas esperan a la hidratación (`abrir()` = goto + networkidle) por WebKit.
- Commits, ramas y Notion sin ninguna mención a la herramienta.

## Pendiente

- Proteger `master` en GitHub.
- `playwright.config.ts` tiene `reuseExistingServer: false`: si queda un `next dev -p 3100` vivo, las pruebas no arrancan. Cerrarlo por su PID.
- El puerto 3000 lo usa otro proyecto del equipo. Para arrancar la app usar otro (las pruebas usan el 3100).
- El cronometraje a mano de la 2.4 queda para cuando Marta la use de verdad.

## Próximo paso concreto

**La Fase 4 (Mis datos y el PDF), antes que la Fase 3.** El PDF solo necesita lo que ya existe en las fases 1 y 2 (número, cliente, conceptos, condiciones) más los datos de Marta. Empezar por la 4.1 "Mis datos y mi logo": mover la tarea y sus subtareas a "En desarrollo", crear `feature/4.1-…` desde `develop` y escribir primero la prueba e2e roja. La 4.5 (repaso de los quince criterios) depende de la Fase 3 y se deja en "Bloqueado". El esquema solo tiene `numeroBase` en `Configuracion`: logo, datos fiscales e impuestos son nuevos.

La Fase 3 (buscar, estados, días abiertos con rojo a los 30 y duplicar) va después. Para el criterio 8, la prueba siembra un presupuesto con `createdAt` de hace 31 días directamente en la base e2e (`os.tmpdir()/presupuestos-e2e/e2e.db`). La parte con duplicados de la prueba de diez presupuestos se activa cuando exista "duplicar".
