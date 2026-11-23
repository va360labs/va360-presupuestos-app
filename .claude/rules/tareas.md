# TAREAS, NOTION Y EVIDENCIAS

Todo lo que aquí se dice de una tarea vale también para sus subtareas.

1. Toda la documentación, las tareas y la planificación están en Notion: https://app.notion.com/p/1c031a3c683c4ee88915ec666e623f5e?v=3cab609a124c819f9916000c029008f7

2. Antes de empezar una tarea, muévela a "En desarrollo".

3. Cuando quede pendiente de que la pruebe el usuario, muévela a "En pruebas". Ninguna tarea pasa a "En pruebas" sin su prueba end to end en verde, en ordenador y en móvil.

4. Si una tarea no se puede probar porque depende de una funcionalidad que se va a desarrollar más adelante, se deja en "Bloqueado".

5. Una tarea no se da por realizada si no hay evidencias de que está terminada, con pruebas y capturas.

6. En cada tarea se documenta en su tarjeta lo que se ha hecho.

7. Las capturas de `evidencias/e2e/` se suben a la tarjeta de Notion, para que se vean en la descripción del trabajo realizado.

El cierre a "Hecho" lo hace la skill `/cerrar-tarea <número>` (`.claude/skills/cerrar-tarea/SKILL.md`): pruebas e2e en ordenador y móvil, hoja de evidencias y documentación en la tarjeta, estado, commit y handoff.
