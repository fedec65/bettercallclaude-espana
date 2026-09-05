---
description: "Traza una práctica legal grande como mapa decisional wayfinder — interroga al abogado en amplitud, crea mapa y tickets decisionales, lanza los tickets research en paralelo. Solo planificación: el trazado no resuelve decisiones por sí mismo."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_sentencias_tc
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__search_eurlex
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__boe-legislacion__search_boe
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__boe-legislacion__get_legislacion
  - mcp__tribunal-constitucional__search_sentencias_tc
  - mcp__eu-law-esp__search_eurlex
  - mcp__legal-citations-esp__validate_citation
  - mcp__legal-citations-esp__parse_citation
  - mcp__legal-citations-esp__format_citation
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_portico
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_findiur
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_multi_source
  - Task
  - mcp__busqueda-general__search_portico
  - mcp__busqueda-general__search_findiur
  - mcp__busqueda-general__search_multi_source
---

# /mapa-legal — Trazar un Mapa Decisional

Eres invocado mediante `/bettercallclaude-espana:mapa-legal`. Aplica la skill `legal-wayfinder`
en su totalidad. Tu único objetivo es **trazar** una práctica grande o nebulosa como mapa
decisional: archivo de mapa más tickets decisionales. No resuelves nada tú mismo — ese es el
trabajo de `/bettercallclaude-espana:percurso-legal`.

## Parámetros

- Texto de la consulta: la descripción de la práctica (texto libre).
- `--privacy=<mode>`: modo de privacidad del mapa (`strict`, `balanced`, `cloud`). Por defecto: el modo configurado.
- `--lang=ES|EN`: lengua del mapa. Por defecto: detectada automáticamente de la entrada.
- `--region=XX`: jurisdicción autonómica — código de CCAA (es. `--region=MD`, `CT`, `AN`, `PV`, `GA`). Son 17 CCAA + 2 ciudades autónomas, con códigos propios distintos de los de otras series del plugin — consulta la tabla completa en la skill `spanish-jurisdictions` antes de usar un código. Por defecto: estatal.

**Equivalentes en lenguaje natural**:
- "traza el mapa" o "chart the matter" → inicia el trazado
- "práctica privada" / "privacy strict" → `--privacy=strict`
- "en inglés" / "in English" → `--lang=EN`
- "jurisdicción Comunidad de Madrid" / "Madrid jurisdiction" → `--region=MD`

**Convención de salida**: escribe el mapa en `bcc-output/YYYY-MM-DD-<slug>/wayfinder/map.md`
y los tickets en `.../wayfinder/tickets/`. En chat muestra solo el resumen del mapa (destino,
lista de tickets por nombre con tipo, recuento de niebla). Ver `skills/shared/SKILL.md`.

## Flujo de Trazado

1. **Nombra el destino.** Interroga al abogado (una pregunta cada vez) para fijar el
   entregable — "demanda lista para su presentación", "informe de due diligence para la SPA".
   El destino fija el ámbito, así que se decide primero.
2. **Interrogatorio en amplitud (breadth-first).** Recorre toda la práctica — jurisdicción,
   posiciones de las partes, prescripción, fuero, disponibilidad de prueba, propensión al
   riesgo del cliente — nunca en profundidad en un solo hilo. Haz emerger cada decisión
   abierta que logres percibir.

   **Salida anticipada — ninguna niebla:** si esto no hace emerger decisiones abiertas (la ruta
   hacia el destino ya está clara, la práctica entra en un plan de ejecución), NO crees el
   mapa. Detente y comunica al abogado:
   ```
   Esta práctica es suficientemente clara para ejecución directa — ningún mapa necesario.
   Opciones: /bettercallclaude-espana:briefing (plan estructurado) o
   /bettercallclaude-espana:legal-5step (pipeline end-to-end).
   ```
3. **Sondea el clasificador** con `mcp__ollama__ollama_check_status` (si Ollama está
   configurado) y registra el resultado.
4. **Crea el mapa** (`status: charting`) con la niebla esbozada en *No especificado aún*.
5. **Crea los tickets ya afilados ahora** como archivos de ticket — luego conecta los arcos
   `blocked-by` en una **segunda pasada** (los archivos necesitan id antes de poder
   referenciarse). Todo lo que aún no es formulable se queda en la niebla.
6. **Lanza los tickets research en paralelo**: envía el agente researcher como subagente,
   servidores MCP en el orden de prioridad estándar (cendoj-jurisprudencia →
   tribunal-constitucional → boe-legislacion → busqueda-general → eu-law-esp), R1/R2
   aplicadas, pre-check de privacidad según el modo del mapa. Los memos van a `assets/`.
   Las resoluciones research quedan registradas en los tickets por esos subagentes.

   *Nota contencioso-administrativo:* España no tiene un servidor MCP dedicado al
   contencioso-administrativo (equivalente del TAR/Consiglio di Stato italiano) — esa
   investigación va por `busqueda-general` (`search_multi_source`) más CENDOJ web manual.
   Si el trazado hace emerger un ticket de esa área, dilo en el cuerpo del ticket.
7. **Stop.** Reporta el mapa trazado y cierra la sesión. La sesión de trazado en sí no
   resuelve decisiones — solo los tickets research lanzados registran resoluciones.

## Reglas de Trazado

- Una sesión de trabajo; nunca resolver un ticket no-research durante el trazado.
- Refiérete a los tickets por nombre en todo lo que el abogado lee.
- Remite al abogado a `/bettercallclaude-espana:percurso-legal` para trabajar el mapa:
   *"Mapa trazado. Ejecuta `/bettercallclaude-espana:percurso-legal` (o 'próximo ticket')
   para trabajar el primer ticket."*
- Si ya existen varios mapas en la carpeta de trabajo, traza en una carpeta datada nueva —
   nunca fusiones mapas.

## Restricción de Ámbito del Plugin

Para todas las tareas de trazado, usa **exclusivamente** agentes, skills y servidores MCP de
BetterCallClaude España. No delegues trabajo legal a skills, agentes o herramientas genéricos
o externos al plugin.

## Consulta del Usuario

$ARGUMENTS
