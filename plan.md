# Plan — Presupuestos en 2 minutos

Cuatro fases. Cada una termina con algo que Marta puede usar y que se puede
enseñar en pantalla. Ninguna fase necesita nada que no exista ya en una
anterior.

---

## Fase 1 — Un presupuesto de principio a fin, escrito a mano

**Qué cubre de la especificación**

- Criterio 4: al guardar, el presupuesto recibe el número siguiente al último y
  ese número no se repite.
- Criterio 5: se ven todos los presupuestos con cliente, fecha, importe y
  estado, sin abrir ninguno.
- Historia 1 (Crear) y historia 2 (Encontrar), en su parte más básica: existe el
  presupuesto y existe la lista donde vive.

En esta fase todavía se escribe todo a mano: el nombre del cliente, los
conceptos y los precios. Nada viene guardado de antes. Los presupuestos nacen
con estado "pendiente de respuesta" y de momento nadie lo cambia.

**Cómo lo compruebo al terminar**

Abro la herramienta, pulso "Nuevo presupuesto", escribo un cliente inventado y
dos líneas con su precio, y le doy a guardar. Vuelvo a la lista y veo ahí mi
presupuesto, con el nombre que escribí, la fecha de hoy, el importe sumado y la
palabra "pendiente". Repito la operación tres veces seguidas y compruebo con el
dedo en la pantalla que los números salen 1, 2 y 3, sin saltos y sin repetirse.
Lo miro también desde el móvil y la lista se lee sin tener que ampliar.

---

## Fase 2 — Que no haya que reescribir nada

**Qué cubre de la especificación**

- Criterio 1: elijo un cliente que ya me contrató y sus datos aparecen puestos
  sin escribirlos.
- Criterio 2: añado un servicio habitual y entra con su precio ya puesto; si lo
  cambio en este presupuesto, mi lista de servicios sigue con el precio de
  antes.
- Criterio 3: digo si es boda, retrato o producto y me piden los datos propios
  de ese tipo, no los de los otros dos.

Es la fase que convierte la media hora en dos minutos: el formulario de la fase
1 deja de pedir que se escriba todo y pasa a ofrecer lo que Marta ya tiene
guardado.

**Cómo lo compruebo al terminar**

Doy de alta un cliente y tres servicios con su precio. Creo un presupuesto
nuevo: elijo al cliente de una lista y veo sus datos aparecer solos en el
formulario, sin teclear. Añado dos de mis servicios y veo su precio ya escrito.
Bajo el precio de uno de ellos, guardo, me voy a mi lista de servicios y
compruebo que ahí sigue el precio original. Después elijo "boda" y veo que me
piden fecha del enlace y horas de cobertura; cambio a "producto" y veo que esos
campos desaparecen y me piden otros. Cronometro este presupuesto entero: tiene
que bajar de dos minutos.

---

## Fase 3 — Que no se pierda ninguno y se pueda repetir

**Qué cubre de la especificación**

- Criterio 6: escribo el nombre de un cliente y me quedan solo los suyos.
- Criterio 7: marco un presupuesto como aceptado o rechazado y ese estado se ve
  al mirar el conjunto.
- Criterio 8: un presupuesto pendiente indica cuántos días lleva abierto y a
  partir de 30 aparece en rojo.
- Criterio 13: si duplico el 14, el nuevo es el 15, conserva los conceptos y
  trae la fecha de hoy.
- Criterio 14: el duplicado nace pendiente aunque el original estuviera aceptado
  o rechazado.
- Criterio 15: cambio conceptos o precios en el duplicado y el original sigue
  igual.

Duplicar va aquí y no antes porque el criterio 14 exige comprobar que el
duplicado nace pendiente *aunque el original esté aceptado*, y los estados
nacen en esta misma fase.

**Cómo lo compruebo al terminar**

Con una decena de presupuestos ya metidos, escribo "Laura" en el buscador y en
la pantalla se quedan solo los de Laura. Abro uno, lo marco como aceptado,
vuelvo a la lista y veo la palabra "aceptado" sin abrir nada. Miro uno
pendiente y leo "lleva 12 días abierto"; miro otro más viejo y lo veo escrito en
rojo. Cojo el presupuesto 14, que está aceptado, le doy a duplicar y veo
aparecer el 15 con los mismos conceptos, la fecha de hoy y la palabra
"pendiente". Le cambio un precio al 15, abro el 14 y compruebo que sigue tal
cual estaba. Todo esto lo repito una vez desde el móvil.

---

## Fase 4 — El PDF que Marta manda de verdad

**Qué cubre de la especificación**

- Criterio 9: me descargo el PDF y lleva mi logo, el importe con los impuestos
  calculados y el número del presupuesto.
- Criterio 10: las condiciones y observaciones que escribí aparecen en el PDF
  tal como las escribí.
- Criterio 11: el PDF queda guardado en mi ordenador y soy yo quien lo adjunta:
  nada sale hacia el cliente por su cuenta.
- Criterio 12: descargo el mismo presupuesto otra vez y sale igual, con el mismo
  número.
- El punto de "Pendiente para el plan": cambiar el logo y los datos de Marta
  (nombre, datos fiscales, impuestos) que salen en el PDF.

Va la última porque el PDF es el retrato de todo lo anterior: número, cliente,
conceptos, condiciones e impuestos. El logo y los datos fiscales se ajustan aquí
mismo, cuando ya hay algo que imprimir donde verlos.

**Cómo lo compruebo al terminar**

Entro en "Mis datos", subo mi logo, escribo mi nombre y mis datos fiscales y
pongo el 21 % de impuestos. Abro un presupuesto, escribo en condiciones "50 % de
adelanto" y en observaciones una frase cualquiera, y pulso "Descargar PDF". El
archivo aparece en mi carpeta de descargas, lo abro y veo arriba mi logo, mi
nombre, el número del presupuesto, las líneas con su base, los impuestos
calculados aparte y el total; abajo, mis dos textos escritos igual que los
escribí. Vuelvo a pulsar "Descargar PDF" en el mismo presupuesto y el segundo
archivo sale idéntico, con el mismo número. Compruebo que en ningún momento la
herramienta ha ofrecido mandárselo al cliente: el correo lo escribo yo. Hago la
misma descarga desde el móvil. Por último, con el reloj delante, hago un
presupuesto nuevo de principio a fin hasta tener el PDF.
