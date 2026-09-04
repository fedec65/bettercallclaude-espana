---
description: "Define una condición de éxito legal verificable — acepta perfiles predefinidos u objetivos free-text, produce un Goal Record persistido. Nunca inicia trabajo por sí mismo."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__boe-legislacion__search_boe
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__legal-citations-esp__validate_citation
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
---

# Objetivo Legal

Eres invocado mediante `/bettercallclaude-espana:objetivo-legal`. Define una condición de éxito legal verificable que será usada por `/bettercallclaude-espana:bucle-legal` para iterar hasta el logro.

**Ámbito del plugin**: usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España para todo el trabajo legal. No delegues a skills o agentes externos al plugin.

## Parámetros

- Primer argumento posicional: nombre de perfil O objetivo free-text
- `--target=<ruta>`: ruta al documento/contexto sobre el que trabajar
- `--max-iteraciones=N`: sobreescribe el default (default: 5, cap: 20)
- `--evaluador=<agente>`: sobreescribe el agente evaluador
- `--privacy=<modo>`: sobreescribe el modo de privacidad para el bucle

**Equivalentes en lenguaje natural**: también puedes decir:
- "objetivo: citas limpias" → perfil `citas-limpias`
- "objetivo: borrador listo" → perfil `borrador-listo`
- "stress test de convergencia" → perfil `contradictorio-convergencia`
- "triage NDA completo" → perfil `nda-lote-limpio`
- "seguimiento normativo" → perfil `seguimiento-normativo`
- "cronología documentada" o "timeline sourced" → perfil `timeline-sourced`
- "máximo 3 iteraciones" → `--max-iteraciones=3`

## Perfiles Predefinidos

| Perfil | Descripción | Worker | Evaluador |
|---------|-------------|--------|------------|
| `citas-limpias` | Anti-alucinación: cada cita validada vía MCP | agente de redacción (vía `/draft`) | especialista en citas (agente `citation`) |
| `borrador-listo` | Quality gate de redacción (citas + estructura + afirmaciones con apoyo) | drafter (vía `/draft`) | analista judicial (agente `judicial`) |
| `contradictorio-convergencia` | Stress-test iterativo hasta convergencia o máximo de iteraciones | advocate (agente `advocate`) | adversary + judicial |
| `nda-lote-limpio` | Completitud del triage NDA por carpetas | analista de documentos (vía `/triage-nda`) | especialista en compliance (agente `compliance`) |
| `seguimiento-normativo` | Seguimiento de cambios normativos (BOE + jurisprudencia) | researcher (agente `researcher`) | compliance (agente `compliance`) |
| `timeline-sourced` | Procedencia de la cronología: cero eventos sin fuente, conflictos de fechas señalados, plazos anclados | chronology-builder (vía `/cronologia-legal`) | agente `citation` |

Para el detalle de cada perfil, ver `skills/legal-evaluator/references/loop-profiles.md`. Para la programación periódica del perfil `seguimiento-normativo`, ver `skills/legal-evaluator/references/scheduling-seguimiento-normativo.md`.

## Objetivo Free-Text

Si el usuario no especifica un perfil predefinido, interpreta el objetivo como free-text:

1. Identifica la **condición de éxito** verificable (qué debe ser cierto al final)
2. Identifica el **worker** apropiado (quién hace el trabajo)
3. Identifica el **evaluador** apropiado (quién juzga — DEBE ser distinto del worker)
4. Propón el Goal Record al usuario para confirmación

## Output: Goal Record

Produce un Goal Record persistido en `bcc-output/goals/<id>.md`:

```yaml
goal_id: "goal_[timestamp]_[hash]"
perfil: "[nombre de perfil o 'custom']"
objetivo: "[descripción de la condición de éxito]"
target: "[ruta al documento/contexto]"
worker_role: "[agente worker]"
evaluator_role: "[agente evaluador]"
max_iteraciones: [N]
privacy_mode: "[strict/balanced/cloud]"
status: "confirmed"  # draft -> confirmed tras aprobación del usuario
created: "[timestamp ISO]"

criterios_exito:
  - "[criterio 1 verificable]"
  - "[criterio 2 verificable]"
  - "[criterio N verificable]"

checks:
  - tool: "[nombre del tool MCP para verificación]"
    proposito: "[qué verifica]"
```

Las claves `criterios_exito` y `checks` son las que la skill `legal-evaluator` carga al juzgar — mantenlas exactamente así.

## Reglas

1. **Nunca inicies trabajo**: este comando solo define el objetivo. Para ejecutar, usar `/bucle-legal`.
2. **Confirmación obligatoria**: el Goal Record parte en estado `draft`. Muéstralo al usuario y pide confirmación explícita antes de fijar `status: confirmed`.
3. **Separación worker-evaluador**: worker y evaluador DEBEN ser agentes distintos. Si el usuario especifica el mismo agente para ambos, señala el error.
4. **Cap de iteraciones**: el máximo absoluto es 20. Si el usuario pide más de 20, señálalo y fija 20.

---

## Consulta del Usuario

$ARGUMENTS
