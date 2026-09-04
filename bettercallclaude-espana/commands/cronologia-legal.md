---
description: "Construye una cronología legal documentada a partir de los documentos del caso — cada evento con fuente obligatoria, estado no controvertido/alegado/controvertido, conflictos de fechas explícitos, lagunas probatorias y marcadores de plazos opcionales (siempre indicativos). Output: tabla, HTML interactivo y docx en bcc-output/cronologia/."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__draft_documento
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__legal-persona-esp__draft_documento
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
---

# /cronologia-legal — Cronología Legal Documentada

Eres invocado mediante `/bettercallclaude-espana:cronologia-legal`. Aplica la skill `legal-chronology` en su totalidad: construye una cronología legal a partir de los documentos del caso donde **ningún evento existe sin fuente**.

**Convención de output**: los output van en `bcc-output/cronologia/` (excepción deliberada a la regla de la carpeta fechada: la cronología es un artefacto vivo del caso, actualizado mediante `--merge`). En chat muestra solo un resumen de 3-5 líneas con las rutas. Ver `skills/shared/SKILL.md`.

## Parámetros

- Primer argumento posicional: ruta de la carpeta o lista de rutas de documentos.
- `--lang=<es|cat|eus|gl|en|fr|de>` — lengua de salida (fechas normalizadas a un único formato de visualización).
- `--from=<fecha>` / `--to=<fecha>` — restringe la ventana temporal (fechas ISO).
- `--parties=<A,B,...>` — inicializa el registro de partes.
- `--deadlines` — genera marcadores de plazo a partir de los eventos, exclusivamente desde la tabla de mapeo de la skill; **cada marcador se etiqueta indicativo** (en España no existe tool MCP determinista de plazos).
- `--format=<table|visual|docx|all>` — selección de output, por defecto `all`.
- `--merge` — actualiza un `bcc-output/cronologia/events.json` existente en lugar de reconstruir desde cero.

**Equivalentes en lenguaje natural**:
- "cronología del caso" o "case timeline" → ejecuta sobre la carpeta del caso
- "hechos controvertidos" o "contested facts" → informe centrado en los eventos controvertidos/alegados
- "compara las fechas" o "date conflicts" → informe centrado en las filas de conflicto

## Comportamiento

### Paso 1: INVENTARIO
Enumera los documentos en las rutas indicadas. Asigna a cada uno un id de inventario (`01-<slug>`, `02-<slug>`, ...). Registra tipo, lengua, legibilidad. Los documentos ilegibles se señalan, nunca se compensan con eventos inventados.

### Paso 2: EXTRACCIÓN (delegada)
Por cada documento, delega en el agente `chronology-builder` con: el id de inventario, el registro de partes, el esquema de evento y las referencias de normalización de fechas, y el `events.json` existente cuando `--merge` está activo. Recoge todos los candidatos.

### Paso 3: RECONCILIACIÓN
Según la skill `legal-chronology`: fusiona los candidatos del mismo evento entre documentos en un único evento con varias fuentes; registra los conflictos de fechas con AMBAS fechas y sus fuentes; asigna `undisputed`/`alleged`/`contested` con atribución; aplica la ventana `--from/--to` después de la fusión (nunca antes — los conflictos pueden anclar fuera de la ventana).

### Paso 4: PLAZOS (solo con `--deadlines`)
Mapea los eventos a los plazos según `references/deadline-mapping.md` — **exclusivamente de la tabla**: plazos procesales (LEC/LJCA/LRJS/LECrim, cómputo según art. 133 LEC) y prescripción/caducidad sustantivas (CC/CP), cada marcador con su base normativa y `basis: tabla-mapeo (indicativo)`. **En España no existe tool MCP determinista de plazos** — nunca simules un cálculo de tool. Todos los marcadores son indicativos — verificar: el cómputo auxiliar es una ayuda de trabajo, no un cálculo autónomo; la verificación final corresponde a la oficina judicial competente.

### Paso 5: RENDER
Escribe `bcc-output/cronologia/events.json`, luego:

```bash
node "${CLAUDE_PLUGIN_ROOT}/scripts/timeline-render.mjs" validate bcc-output/cronologia/events.json
node "${CLAUDE_PLUGIN_ROOT}/scripts/timeline-render.mjs" render bcc-output/cronologia/events.json --outdir bcc-output/cronologia --formats <table|visual|docx|all>
```

Si `validate` rechaza eventos (fuente faltante), corrígelos o elimínalos antes del render — nunca esquives el control.

### Paso 6: RESUMEN
En chat, 3-5 líneas: número de eventos, número de controvertidos/conflictos, lagunas encontradas, marcadores de plazo (si los hay), rutas de los output.

## Ámbito del Plugin

Usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España. La lectura de archivos, el script de render y las operaciones de sistema quedan exentos.

## Consulta del Usuario

$ARGUMENTS
