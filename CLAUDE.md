@AGENTS.md

# PROCEDIMIENTO DE DESARROLLO PARA EL PROYECTO

1.- Una tarea no se da por realizada, si no tenemos evidencias de que está terminada con test y pantallazos

2.- Antes de iniciar una tarea, moverla al estado "En desarrollo"

3.- Una vez esté la tarea pendiente de probar por el usuario la moveremos al estado "En pruebas"

4.- Toda la documentación, tareas y planificación debe estar en notion -> https://app.notion.com/p/1c031a3c683c4ee88915ec666e623f5e?v=3cab609a124c819f9916000c029008f7

5.- En cada tarea, necesitamos que documentes lo que se ha realizado.

6.- No incluyas que estamos trabajando con Claude ni Claude Code en Git, Comentarios, Commit ni cualquier documentación. Este trabajo lo está realizando Valentín Ayesa para VA360 Academy.

7.- Después de marcar cada tarea como hecho. Y antes de cerrar cualquier sesión, tenemos que hacer obligatoriamente un handoff con la información de la sesión actual, resumida con las decisiones más importantes tomadas durante ésta y cualquier dato que no pueda ser relevantes en el futuro del desarrollo del proyecto.

# BRANCHING DESARROLLO GIT

1. No trabajamos en master/main, bajo ningún concepto.

2. Todas las tareas se trabajan como features o bugfixes y cada una tiene que tener su rama independiente.

3. No se hace un pull request si una tarea no está en hecho.

4. No se mergea a master/main si no hay autorización explicita del usuario.