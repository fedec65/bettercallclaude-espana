---
description: "Ejecuta un ciclo worker-evaluador contra un Goal Record hasta alcanzar la condición de éxito o el límite de parada. Produce un trail de veredictos verificable."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__search_eurlex
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eurlex_document
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__boe-legislacion__search_boe
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__boe-legislacion__get_legislacion
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__legal-citations-esp__validate_citation
  - mcp__legal-citations-esp__parse_citation
  - mcp__legal-citations-esp__format_citation
  - mcp__eu-law-esp__search_eurlex
  - mcp__eu-law-esp__get_eurlex_document
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
---

# Bucle Legal

Eres invocado mediante `/bettercallclaude-espana:bucle-legal`. Ejecutas un ciclo iterativo worker-evaluador contra un Goal Record definido por `/bettercallclaude-espana:objetivo-legal`.

**Ámbito del plugin**: usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España para todo el trabajo legal. No delegues a skills o agentes externos al plugin.

## Parámetros

- Primer argumento: ID o ruta del Goal Record
- `--max-iteraciones=N`: sobreescribe el límite del Goal Record
- `--prueba-seca`: una sola iteración trabajo+veredicto, luego stop (sin bucle)
- `--reanudar`: reanuda un bucle anterior desde la última iteración
- `--verboso`: muestra detalles completos del veredicto en chat

**Equivalentes en lenguaje natural**: también puedes decir:
- "prueba seca" o "una sola iteración" → `--prueba-seca`
- "reanuda el bucle" → `--reanudar`
- "muestra todo" o "detalles completos" → `--verboso`

## Pre-Check (Antes del Bucle)

1. **Goal Record existe**: verifica que el archivo `bcc-output/goals/<id>.md` exista y esté en estado `confirmed`.
2. **Separación worker-evaluador**: verifica que `worker_role` ≠ `evaluator_role`. Rechaza proceder si son el mismo agente.
3. **Target accesible**: verifica que el archivo/contexto target sea accesible.
4. **Privacidad**: aplica las reglas de privacidad del Goal Record.

## Ciclo de Iteración

Para cada iteración:

### 1. Pre-Check de Privacidad
Escanea el contenido en busca de patrones privilegiados ANTES de cada iteración (no solo la primera). Si se encuentran en modo strict, interrumpe.

### 2. Paso de Trabajo (Worker)
El worker produce o revisa el artefacto según el objetivo del Goal Record.

### 3. Paso de Veredicto (Evaluador)
El evaluador juzga el artefacto usando la skill `legal-evaluator`. Produce un Veredicto estructurado (ver la skill `legal-evaluator` para el formato: `veredicto`, `pass`, `score`, `iteration`, `findings`, `summary`, `residual_count`).

Como parte del paso de veredicto, el evaluador ejecuta también el **gate de citas sustantivo** (`citation-content-verify`): cada cita del artefacto se comprueba contra la fuente live por existencia Y apoyo del contenido. Cualquier cita `UNVERIFIED`/`MISMATCH` implica que el veredicto no puede ser `pass: true` — las citas bloqueantes pasan al worker como finding FAIL. Si el estadio devuelve `delivery_blocked: true`, el bucle no entrega.

### 4. Decisión
- **pass = true**: bucle terminado con éxito. Escribe el output final.
- **pass = false E iteración < max**: continúa al siguiente ciclo.
- **pass = false E iteración = max**: termina con NOT MET. Lista los findings residuos.
- **no-progress**: si el score no mejora durante 2 iteraciones consecutivas, termina con NOT MET.
- **violación de privacidad**: termina inmediatamente.

## Garantías de Seguridad (No Negociables)

1. **Máx iteraciones**: finito, default 5, cap absoluto 20.
2. **Guardia no-progress**: stop tras 2 iteraciones consecutivas sin mejora de score.
3. **Separación obligatoria**: worker y evaluador DEBEN ser agentes distintos. El bucle se niega a arrancar si son el mismo.
4. **Terminación honesta**: si el bucle termina sin éxito, el estado es NOT MET con los findings residuos siempre listados.
5. **Pre-check de privacidad cada iteración**: no solo en la primera.
6. **Human-in-the-loop**: el bucle nunca envía, firma ni transmite nada de forma autónoma.

## Output

```
bcc-output/loops/<goal-id>/
  iteration-1.md     # artefacto + veredicto iteración 1
  iteration-2.md     # artefacto + veredicto iteración 2
  ...
  summary.md         # resumen del bucle: iteraciones, progresión de score, veredicto final
  final/             # artefacto final (si éxito)
```

En chat muestra solo un resumen por iteración:

```
**Iteración [N]**: score [X]/100 — [pass/fail]
  [1-2 líneas de findings principales]
```

Al término del bucle:

```
**Bucle completado**: [MET / NOT MET] tras [N] iteraciones
  Score final: [X]/100
  Findings residuos: [N]
  Output: `bcc-output/loops/<goal-id>/summary.md`
```

---

## Consulta del Usuario

$ARGUMENTS
