@AGENTS.md

# IMPORTANTE

1. Usar taskkill si es necesario, pero SOLO sobre el proceso o los procesos levantados por este proyecto. En este mismo equipo, puede correr otros proyectos u otros procesos independientes.

# PROCEDIMIENTO DE DESARROLLO PARA EL PROYECTO

1.- Una tarea o una subtarea no se da por realizada, si no tenemos evidencias de que está terminada con test y pantallazos -> Los pantallazos, deben subirse a Notion para verse en la descripción del trabjo realizado. Si hay una tarea que no se puede probar porque depende de una funcionalidad que se va a desarrollar más adelante, la dejamos en estado "Bloqueado".

2.- Antes de iniciar una tarea o una subtarea, moverla al estado "En desarrollo"

3.- Una vez esté la tarea o una subtarea pendiente de probar por el usuario la moveremos al estado "En pruebas"

4.- Toda la documentación, tarea o una subtarea y planificación debe estar en notion -> https://app.notion.com/p/1c031a3c683c4ee88915ec666e623f5e?v=3cab609a124c819f9916000c029008f7

5.- En cada tarea o una subtarea, necesitamos que documentes lo que se ha realizado.

6.- No incluyas que estamos trabajando con Claude ni Claude Code en Git, Comentarios, Commit ni cualquier documentación. Este trabajo lo está realizando Valentín Ayesa para VA360 Academy.

7.- Después de marcar cada tarea como hecho. Y antes de cerrar cualquier sesión, tenemos que hacer obligatoriamente un handoff con la información de la sesión actual, resumida con las decisiones más importantes tomadas durante ésta y cualquier dato que no pueda ser relevantes en el futuro del desarrollo del proyecto.

# BRANCHING DESARROLLO GIT

1. No trabajamos en master/main, bajo ningún concepto.

2. Todas las tareas se trabajan como features o bugfixes y cada una tiene que tener su rama independiente.

3. La rama de integración es `develop`, creada a partir de master. Cada tarea sale de `develop` en su propia rama `feature/<número-de-tarea>` (por ejemplo `feature/2.1`) y vuelve a `develop` cuando está en "En pruebas".

4. A master/main solo se llega con una pull request que el usuario apruebe. No se mergea ni se hace push directo a master/main bajo ningún concepto, ni con autorización verbal sin pull request.

5. No se hace un pull request a master/main si las tareas que incluye no están en hecho.