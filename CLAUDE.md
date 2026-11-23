@AGENTS.md

# NORMAS DEL PROYECTO

1. No incluyas que estamos trabajando con Claude ni con Claude Code en Git (commits, ramas, pull requests), en comentarios del código ni en ninguna documentación, Notion incluido. Este trabajo lo está realizando Valentín Ayesa para VA360 Academy.

2. Después de marcar cada tarea como "Hecho", y antes de cerrar cualquier sesión, es obligatorio hacer un handoff con la skill `handoff`: la información de la sesión resumida, las decisiones más importantes que se han tomado y cualquier dato que pueda ser relevante más adelante en el desarrollo. Al cerrar una tarea con `/cerrar-tarea` lo hace la propia skill (paso 5).

3. Si hay que parar un proceso, solo los que haya levantado este proyecto y por su PID: en este equipo corren otros proyectos y procesos independientes. Matar todos los `node` por nombre lo bloquea `.claude/hooks/proteger.mjs`.

# NORMAS EN .claude/rules/

- `tareas.md`: Notion, estados de las tareas, documentación y evidencias.
- `git.md`: ramas, integración en `develop` y llegada a `master`.
