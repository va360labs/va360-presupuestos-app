# BRANCHING DESARROLLO GIT

1. No se trabaja en `master`/`main` bajo ningún concepto.

2. Todas las tareas se trabajan como features o bugfixes y cada una tiene su rama independiente.

3. La rama de integración es `develop`, creada a partir de `master`. Cada tarea sale de `develop` en su propia rama `feature/<número-de-tarea>` (por ejemplo `feature/2.1`) y vuelve a `develop` cuando está en "En pruebas".

4. A `master`/`main` solo se llega con una pull request que apruebe el usuario. No se mergea en `master`/`main` bajo ningún concepto, ni con autorización verbal sin pull request.

5. No se abre una pull request a `master`/`main` si las tareas que incluye no están en "Hecho".

El push a `master`/`main` y el push forzado los bloquea `.claude/hooks/proteger.mjs`.
