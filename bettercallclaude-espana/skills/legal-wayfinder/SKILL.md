---
name: legal-wayfinder
description: "Descomposición en mapa decisional para prácticas legales demasiado grandes o demasiado niebla para una sola sesión. Traza un mapa (destino, decisiones tomadas, niebla, fuera de ámbito) más tickets decisionales en bcc-output/YYYY-MM-DD-<slug>/wayfinder/, luego trabaja los tickets uno a uno hasta que la ruta hacia el entregable está clara, y pasa el testigo a la ejecución. Activa cuando: se traza el mapa de una práctica grande (/mapa-legal), se trabaja el próximo ticket decisional (/percurso-legal), o un briefing es demasiado niebla para un plan de ejecución estático. NO activa para: prácticas normales que caben en /briefing o /legal-5step, loops de calidad (objetivo-legal / bucle-legal), o investigación de pregunta única."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_by_tribunal
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_sentencias_tc
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__get_sentencia_tc
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_multi_source
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__search_eurlex
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eurlex_document
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__extract_citations
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__cendoj-jurisprudencia__search_by_tribunal
  - mcp__tribunal-constitucional__search_sentencias_tc
  - mcp__tribunal-constitucional__get_sentencia_tc
  - mcp__boe-legislacion__search_boe
  - mcp__boe-legislacion__get_legislacion
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__busqueda-general__search_multi_source
  - mcp__eu-law-esp__search_eurlex
  - mcp__eu-law-esp__get_eurlex_document
  - mcp__legal-citations-esp__validate_citation
  - mcp__legal-citations-esp__parse_citation
  - mcp__legal-citations-esp__format_citation
  - mcp__legal-citations-esp__extract_citations
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_ecli
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_boe_id
  - mcp__legal-citations-esp__convert_to_ecli
  - mcp__legal-citations-esp__convert_to_boe_id
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
---

# Legal Wayfinder — Mapas Decisionales para Prácticas Legales Grandes

Una práctica legal grande llega envuelta en niebla: la ruta del intake al entregable
no es todavía visible. El wayfinding encuentra esa ruta resolviendo **decisiones** — no
ejecutando porciones de trabajo. El mapa es el plan; la ejecución ocurre solo tras el handoff.

**Planifica, no hagas.** Cada ticket resuelve una decisión. Memos de apoyo y prototipos
se enlazan como assets, pero ningún entregable para el cliente se redacta dentro del
mapa. Una práctica puede exceptuarse en las **Notas** del mapa (llevando ejecución dentro
del mapa); a falta de excepción, producir decisiones, no entregables.

**Refiere por nombre.** En todo lo que el abogado lee, refiérete a un ticket por su
título, nunca por un id desnudo. Los ids viajan dentro del nombre enlazado: `[¿Prescripción aún abierta?](tickets/t01-prescripcion-aun-abierta.md)`.

## Archivo

Todo vive dentro la carpeta de la práctica — nunca en memory key, nunca sincronizado fuera:

```
bcc-output/YYYY-MM-DD-<slug>/wayfinder/
  map.md
  tickets/
    t01-prescripcion-aun-abierta.md
    t02-juzgado-primera-instancia-o-mercantil.md
  assets/          ← memos de investigación, escaletas de prototipo enlazadas desde los tickets
```

## El Mapa (`map.md`)

```markdown
---
matter: <slug>
status: charting | working | ready-for-handoff | handed-off
privacy-mode: strict | balanced | cloud
classifier: ollama | none
jurisdiction: nacional | <comunidad autónoma>
language: ES | EN
---

## Destino
<1–2 líneas: el entregable hacia el que esta práctica está encontrando la ruta. Fija el
ámbito; cada sesión se orienta aquí antes de elegir un ticket.>

## Notas
<skills a consultar (spanish-legal-research, privacy-routing, spanish-citation-formats),
preferencias permanentes. La excepción de ejecución por-práctica se expresa aquí si hace falta.>

## Decisiones hasta aquí
<!-- índice, una línea por ticket resuelto: gist + enlace; nunca repetir el detalle -->

## No especificado aún
<!-- niebla: preguntas en ámbito que se perciben pero aún no se saben formular con precisión -->

## Fuera de ámbito
<!-- trabajo conscientemente excluido más allá del destino + por qué; nunca promociona -->
```

El mapa es un **índice, no un archivo**: una decisión vive en un único sitio — su
ticket. El mapa resume el gist y enlaza.

## Los Tickets (`tickets/tXX-<slug>.md`)

```markdown
---
id: t01
title: ¿Prescripción aún abierta?
type: research
status: open
blocked-by: []
claimed-in: ""
---

## Pregunta
<la decisión que este ticket resuelve, dimensionada a una sesión de un agente>

## Resolución
<rellenada al cierre: la decisión + evidencia; assets enlazados, nunca pegados>
```

### Tipos de ticket

| Tipo | Modo | Resuelve | Reglas |
|------|------|----------|--------|
| `research` | AFK | Un hecho del que depende una decisión (precedente, norma, plazo) | Agente researcher + servidores MCP (cendoj-jurisprudencia, tribunal-constitucional, boe-legislacion, busqueda-general, eu-law-esp); memo en `assets/`; R1 (citas solo trazadas a investigación MCP verificada via `validate_citation` de legal-citations-esp) y R2 (citas verbatim entre comillas) aplicadas |
| `grilling` | HITL | Hechos del cliente, prioridades, propensión al riesgo | Conversación con el abogado, una pregunta cada vez. **Nunca respondas en lugar del humano** — un agente que responde a sus propias preguntas de grilling ha violado el ticket |
| `prototype` | HITL | "Cómo deberían ser/comportarse las cosas" | Artefacto concreto y barato al que reaccionar — escaleta de la demanda, estructura gruesa de una cláusula — enlazado desde `assets/` |
| `task` | HITL o AFK | Trabajo que desbloquea una decisión (recuperar el contrato, obtener autos de la causa) | Checklist precisa para abogado/cliente, o ejecutada en autonomía donde sea posible; la resolución registra qué se hizo y los hechos resultantes de los que dependen tickets posteriores |

## Frontera y claiming

La **frontera** es cada ticket con `status: open`, `claimed-in` vacío y todos los tickets
en `blocked-by` con `status: resolved` o `ruled-out`. `/percurso-legal` elige el ticket
frontera con el número más bajo salvo que el abogado nombre uno. Claim fijando
`claimed-in` a un timestamp de sesión (fecha + hora ISO) **antes de cualquier trabajo**;
rechazar un ticket ya reclamado. Un ticket por invocación de `/percurso-legal` — los
tickets research son la única excepción (pueden batcharse o lanzarse en paralelo desde
`/mapa-legal`).

## Niebla (fog of war)

El mapa es deliberadamente incompleto. Más allá de los tickets vivos hay niebla —
preguntas que se perciben pero aún no se saben formular con precisión porque dependen de
decisiones abiertas. El test:

- **Ticket** cuando la pregunta ya está afilada — aunque esté bloqueada.
- **No especificado aún** cuando todavía no es formulable con esa precisión. No
  pre-cortar la niebla en porciones del tamaño de un ticket; un bloque puede promocionar
  varios tickets, o ninguno.

Resolver un ticket promociona lo que ha afilado: crear los nuevos tickets
(create-then-wire: enlazar los arcos de bloqueo en una segunda pasada), y limpiar cada
bloque promocionado de **No especificado aún** para que viva solo como su ticket.

## Fuera de ámbito

La niebla solo se recoge hacia el destino; el trabajo más allá está fuera de ámbito y
nunca promociona. Cuando un ticket vivo resulta estar más allá del destino, fíjalo
`status: ruled-out` (no resolved) y añade una línea en **Fuera de ámbito**: gist + por
qué + enlace. Queda fuera de **Decisiones hasta aquí** — un confín de ámbito no es un
paso de la ruta.

## Casos límite

- **Ticket desbordado**: si resolver un ticket desborda una sesión de trabajo, divídelo —
  crea los tickets sucesores más la posible niebla fresca, y cierra el original
  `resolved` con un puntero a los hijos en la Resolución.
- **Investigación caducada**: una resolución research en derecho de rápida evolución
  puede anotar `revalidate: true`. Reabrirla solo creando un ticket nuevo que referencie
  el viejo — nunca modificando una resolución registrada.

## Privacidad (secreto profesional)

La `privacy-mode` del mapa gobierna cada ticket; el hook PreToolUse sigue vigilando las
escrituras pase lo que pase. El clasificador se prueba una sola vez al trazar el mapa
(`ollama_classify_privacy`, detección de patrones 100% offline — no requiere Ollama en marcha) — nunca se re-prueba por
ticket. La degradación sigue la matriz decisional de `privacy-routing`:

| Contenido | classifier: ollama | classifier: none |
|-----------|--------------------|------------------|
| PUBLIC | cloud preferido | cloud OK |
| CONFIDENTIAL | local preferido | anonimiza → cloud + aviso |
| PRIVILEGED / indeterminable (strict) | local requerido | ningún envío claro automático: queda solo local, o pregunta directamente al abogado antes de cualquier llamada cloud |

Un ticket research que toca hechos privilegiados sin clasificador no hace fallar el
mapa: conviértelo en conversación — pide al abogado reformular la pregunta en términos
anónimos, luego procede como CONFIDENTIAL. Fail closed; nunca "lo enviamos y ya está".

## Handoff

Pasa el testigo solo cuando cada ticket está `resolved` o `ruled-out` y la niebla está
vacía. Un ticket reclamado cuenta igualmente como abierto — trabajo en vuelo en otra
sesión bloquea el handoff. Cuando `/percurso-legal` alcanza ese estado, fija
`status: ready-for-handoff` y — en lugar de pararte — emite un **handoff pack**:
destino + Decisiones hasta aquí + assets enlazados, moldeado para alimentar el protocolo
Briefing-Sourced Execution del orquestador. Enruta hacia `/legal-5step` o el orquestador.
Con `--gate`, pre-construye un Goal Record `/objetivo-legal` para que la ejecución corra
bajo el loop worker-evaluador (vía `/bucle-legal`) desde el primer día. Fija
`status: handed-off` una vez entregado el pack.

## Terminación honesta

Nunca presentes un mapa no resuelto como claro. Si el mapa está muerto — niebla no
vacía, nada promocionable, ningún ticket abierto — llévalo al abogado: el destino hay
que redibujarlo o falta input externo (que es en sí mismo un ticket `task`).

## Restricción de Ámbito del Plugin

Para todas las tareas de wayfinding, usa **exclusivamente** agentes, skills y servidores
MCP de BetterCallClaude España. No delegues trabajo legal a skills, agentes o
herramientas genéricas o externas al plugin.
