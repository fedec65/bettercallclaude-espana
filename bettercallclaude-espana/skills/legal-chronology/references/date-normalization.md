# Normalización de Fechas — ES / lenguas cooficiales / EN / FR / DE → ISO

Reglas para normalizar las fechas halladas en los documentos del caso a ISO `YYYY-MM-DD` con un nivel de precisión. La normalización es determinista: nunca adivinar componentes ausentes. Los formatos españoles son el caso principal; los demás sirven para documentos extranjeros o de lenguas cooficiales en el expediente.

## Niveles de Precisión

| Ejemplo de entrada | `date` | `precision` | Visualización (ES) |
|---|---|---|---|
| "3 de marzo de 2024" | `2024-03-03` | `day` | 3/3/2024 |
| "marzo de 2024" | `2024-03-01` | `month` | marzo de 2024 |
| "en el año 2024" | `2024-01-01` | `year` | 2024 |
| hecho sin fecha | — | `unknown` | sin fecha |

La fecha a día 1 del periodo existe solo para ordenar; el render DEBE respetar `precision` y no mostrar jamás un día falso ("1/3/2024" por una fuente que solo dice "marzo").

## Nombres de los Meses

| # | ES | CAT | EUS | GL | EN | FR | DE |
|---|---|---|---|---|---|---|---|
| 01 | enero | gener | urtarrila | xaneiro | January | janvier | Januar |
| 02 | febrero | febrer | otsaila | febreiro | February | février | Februar |
| 03 | marzo | març | martxoa | marzo | March | mars | März |
| 04 | abril | abril | apirila | abril | April | avril | April |
| 05 | mayo | maig | maiatza | maio | May | mai | Mai |
| 06 | junio | juny | ekaina | xuño | June | juin | Juni |
| 07 | julio | juliol | uztaila | xullo | July | juillet | Juli |
| 08 | agosto | agost | abuztua | agosto | August | août | August |
| 09 | septiembre | setembre | iraila | setembro | September | septembre | September |
| 10 | octubre | octubre | urria | outubro | October | octobre | Oktober |
| 11 | noviembre | novembre | azaroa | novembro | November | novembre | November |
| 12 | diciembre | desembre | abendua | decembro | December | décembre | Dezember |

Las lenguas cooficiales (catalán, euskera, gallego) aparecen en documentos y boletines autonómicos (DOGC, BOPV, DOGA) — el expediente de un caso con base en esas CCAA las contiene con normalidad.

## Patrones

- **ES** (caso principal): `3 de marzo de 2024`, `a 3 de marzo de 2024`, `3-3-2024`, `3/3/2024`, `03/03/2024` → precisión día. El formato numérico español es SIEMPRE `día/mes/año` — `3/4/2024` es el 3 de abril, nunca el 4 de marzo.
- **Fechas oficiales**: el BOE y los boletines autonómicos usan "3 de marzo de 2024" en texto; los decretos y actos judiciales, "En Madrid, a 3 de marzo de 2024".
- **CAT/EUS/GL**: mismo patrón `3 de març de 2024` / `urtarrilak 3, 2024` / `3 de marzo de 2024` (GL) → precisión día; normaliza por nombre de mes de la tabla.
- **EN**: `3 March 2024`, `March 3, 2024` → precisión día. El numérico inglés `03/04/2024` es ambiguo: por defecto convención día-primero y anota la ambigüedad en el `note` del evento.
- **FR**: `le 3 mars 2024`, `3 mars 2024` → precisión día (ignora los artículos "le/du").
- **DE**: `3. März 2024`, `3.3.2024` → precisión día (siempre `día.mes.año`).
- **Años a dos cifras**: `24` → 2024 cuando el contexto del documento es post-2000; si el caso cruza 1900/2000, resuelve por contexto y señala baja confianza.
- **Fechas relativas** ("dentro de 10 días desde la entrega", "transcurridos 30 días desde la notificación"): NO calcular en silencio. Registra el id del evento ancla en `note`; calcula solo si la fecha ancla es conocida, y marca la `precision` del ancla. En España rige el art. 133 LEC (el día inicial no se computa) — aplícalo solo en los marcadores de plazo, nunca en la fecha del hecho.
- **Fecha del documento vs fecha del hecho**: una carta del 5/4/2024 que describe una entrega del 3/3/2024 produce DOS eventos (entrega 3/3; carta 5/4), cada uno con su fuente.
- **Intervalos** ("entre marzo y abril de 2024"): registra la más antigua como `date` con `precision: month` y anota el intervalo en `note`.

## Formatos de Visualización (nivel render)

| Lengua | Formato |
|---|---|
| ES | `3/3/2024` |
| CAT/EUS/GL | `3/3/2024` |
| EN | `2024-03-03` |
| FR / DE | `3.3.2024` |

El nivel de datos es siempre ISO; la conversión de visualización ocurre solo en el render.
