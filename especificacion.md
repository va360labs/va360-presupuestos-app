# Especificación — Presupuestos en 2 minutos

## Historias de usuario

### 1. Crear

Como fotógrafa autónoma, quiero crear un presupuesto rellenando pocos datos y
apoyándome en mis servicios y mis clientes ya guardados, para no volver a
escribir desde cero lo mismo de siempre.

**Criterios de aceptación**

1. Elijo un cliente que ya me contrató antes y sus datos aparecen puestos sin
   que yo los escriba.
2. Añado uno de mis servicios habituales y entra con su precio ya puesto; si lo
   cambio en este presupuesto, mi lista de servicios sigue con el precio de
   antes.
3. Digo si es boda, retrato o producto y me piden los datos propios de ese tipo,
   no los de los otros dos.
4. Al guardar, el presupuesto recibe el número siguiente al último que hice y
   ese número no se repite en ningún otro.

### 2. Encontrar

Como fotógrafa autónoma, quiero ver todos mis presupuestos juntos, buscarlos por
cliente y saber en qué estado está cada uno, para no volver a perder ninguno ni
olvidarme de reclamar una respuesta.

**Criterios de aceptación**

5. Miro mis presupuestos y veo todos: cliente, fecha, importe y estado, sin
   tener que abrir ninguno.
6. Escribo el nombre de un cliente y me quedan solo los suyos.
7. Marco un presupuesto como aceptado o como rechazado y ese estado se ve al
   mirar el conjunto.
8. Un presupuesto pendiente de respuesta indica cuántos días lleva abierto, y
   cuando pasa de 30 días aparece marcado en rojo.

### 3. Enviar

Como fotógrafa autónoma, quiero descargarme el presupuesto en PDF con mi logo,
mis impuestos y su número, para mandárselo yo al cliente por donde siempre.

**Criterios de aceptación**

9. Me descargo el PDF y lleva mi logo, el importe con los impuestos calculados y
   el número del presupuesto.
10. Las condiciones y observaciones que escribí aparecen en el PDF tal como las
    escribí.
11. El PDF me queda guardado en mi ordenador y soy yo quien lo adjunta en mi
    correo: nada sale hacia el cliente por su cuenta.
12. Descargo el mismo presupuesto otra vez y sale igual, con el mismo número.

### 4. Duplicar

Como fotógrafa autónoma, quiero duplicar un presupuesto anterior, para preparar
uno parecido sin reescribirlo entero.

**Criterios de aceptación**

13. Si duplico el presupuesto 14, el nuevo se llama 15, conserva los conceptos y
    trae la fecha de hoy.
14. El duplicado nace pendiente de respuesta, aunque el original estuviera
    aceptado o rechazado.
15. Cambio conceptos o precios en el duplicado y el original sigue exactamente
    como estaba.

## Terminado

El proyecto se da por cerrado cuando:

- Los 15 criterios de arriba se comprueban uno a uno y todos pasan.
- Marta hace un presupuesto nuevo de principio a fin, con el reloj delante, en
  dos minutos o menos.
- Marta encuentra cualquier presupuesto suyo buscando por el nombre del cliente,
  sin abrir carpetas.
- Se hacen diez presupuestos seguidos (creados y duplicados, mezclados) y la
  numeración sale correlativa, sin huecos ni números repetidos.
- Marta lo usa en su ordenador y también desde el móvil, y en los dos puede
  crear, buscar, duplicar y descargar el PDF.
- Marta valida un PDF real como el que mandaría a un cliente.

## Pendiente para el plan

- Cambiar el logo y los datos de Marta (nombre, datos fiscales, impuestos) que
  salen en el PDF. No es una historia de usuario: es una configuración que hay
  que dejar resuelta al montar la herramienta.
