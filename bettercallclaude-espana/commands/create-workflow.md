---
description: "Diseña un flujo de trabajo multi-agente reutilizable: resuelve el user_id, lista los agentes del plugin vía MCP, propone una secuencia, la valida, pide confirmación y la guarda en el servidor workflows-esp."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_workflows-esp__claim_user_id
  - mcp__plugin_bettercallclaude-espana_workflows-esp__list_agents
  - mcp__plugin_bettercallclaude-espana_workflows-esp__validate_pipeline
  - mcp__plugin_bettercallclaude-espana_workflows-esp__save_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__list_workflows
  - mcp__plugin_bettercallclaude-espana_workflows-esp__get_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__delete_workflow
  - mcp__plugin_bettercallclaude-espana_workflows-esp__delete_user
  - mcp__plugin_bettercallclaude-espana_workflows-esp__log_run
  - Task
  - mcp__workflows-esp__claim_user_id
  - mcp__workflows-esp__list_agents
  - mcp__workflows-esp__validate_pipeline
  - mcp__workflows-esp__save_workflow
  - mcp__workflows-esp__list_workflows
  - mcp__workflows-esp__get_workflow
  - mcp__workflows-esp__delete_workflow
  - mcp__workflows-esp__delete_user
  - mcp__workflows-esp__log_run
---

# Crear Workflow

Eres invocado mediante `/bettercallclaude-espana:create-workflow`. Guías al usuario en el diseño de un flujo multi-agente reutilizable, lo validas contra el manifest de agentes del plugin y lo guardas para ejecutarlo después con `/bettercallclaude-espana:workflow <slug>`.

**Ámbito del plugin**: usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España. El flujo se guarda en el servidor `workflows-esp`; la prosa de este comando es en español, pero la entrevista con el usuario se desarrolla en la lengua de su mensaje (en italiano si escribe en italiano).

## Resolver el user_id

Cada tool de `workflows-esp` requiere un `user_id`. Resuélvelo en este orden:

1. **Plugin setting**: si `${user_config.user_id}` se resuelve a un valor no vacío (es decir, el placeholder no aparece literalmente), úsalo.
2. **Custom instructions** (Cowork Desktop): si las instrucciones personalizadas de la sesión contienen una línea de la forma `BetterCallClaude España workflow user ID: <id>`, usa ese ID. Es la fuente duradera en Cowork — las instrucciones las guarda la app y sobreviven a los reinicios, a diferencia del filesystem del sandbox.
3. **Config local**: lee `~/.betterask/config.yaml` si existe. Si contiene una línea `user_id:`, usa ese valor. (Caché de conveniencia — Cowork borra el home del sandbox al reiniciar.)
4. **Genera una vez, reclama y persiste**: genera 8 bytes aleatorios en hex (p. ej. `openssl rand -hex 8`) y construye el candidato `bcc-<hex>`. Reclámalo en el servidor llamando al tool `claim_user_id`; si devuelve `claimed: false` (colisión), genera otro candidato y reintenta, hasta 3 intentos. Si los 3 colisionan (prácticamente imposible con IDs aleatorios de 64 bits), pide al usuario que elija un ID y lo aporte vía la línea de custom instructions (Cowork) o el plugin setting (CLI), y detente. Persiste el ID reclamado **añadiendo** la línea `user_id: bcc-<hex>` a `~/.betterask/config.yaml` (ejecuta `mkdir -p ~/.betterask` primero; añade solo — el archivo puede contener ya el modo de privacidad del usuario). Luego dile al usuario una vez, brevemente: «Non era impostato un User ID, quindi ne ho generato uno personale (`bcc-…`) e l'ho salvato in `~/.betterask/config.yaml`. I tuoi flussi sono archiviati sotto questo ID — tienilo privato: chiunque lo conosca può leggere i tuoi flussi. Cowork cancella questo file al riavvio; per conservare l'ID in modo permanente aggiungi questa riga in Settings → General → Instructions for Claude: `BetterCallClaude España workflow user ID: bcc-…`».
5. Si el archivo no se puede escribir, di al usuario el ID generado y pídele que añada la línea `BetterCallClaude España workflow user ID: <id>` en Settings → General → Instructions for Claude (Cowork) o que fije el plugin setting **User ID for custom workflows** (CLI), y detente. **Nunca** recurras a un ID compartido `default`.

**Reclama IDs preexistentes**: para un ID del plugin setting (paso 1), de las custom instructions (paso 2) o del config file (paso 3), llama a `claim_user_id` una vez antes de la primera operación. Si devuelve `claimed: false`, el ID ya está registrado en el servidor — muestra una nota única: «Questo User ID è già registrato sul server. Se è il tuo da un'altra macchina, ignora; altrimenti imposta un User ID diverso.» Luego continúa con normalidad (la propiedad no se puede verificar en el servidor; quien tenga el ID accede a sus flujos).

## Procedimiento

1. **Lista los agentes disponibles.** Llama al tool `list_agents` y presenta el resultado como tabla compacta: `agent_id`, nombre mostrado, qué acepta (`input_types`), qué produce (`output_types`). Son los agentes encadenables del plugin España — no se puede usar ningún otro.

2. **Entrevista al usuario** (en la lengua de su mensaje; en italiano si escribe en italiano). Una pregunta cada vez:
   - «A che serve il flusso? (scopo, input tipico)»
   - «Quali agenti devono girare e in che ordine?» Sugiere una secuencia basada en la compatibilidad de tipos del paso 1.
   - «Dopo quali passaggi vuoi una pausa di conferma?» (`checkpoint: true`)
   - «Come deve essere l'output finale?» (esto será `output_spec`)
   - «Che slug (kebab-case corto) usiamo? E che nome leggibile + descrizione di una riga?» Propón un slug a partir del propósito.

3. **Valida.** Llama al tool `validate_pipeline` con la pipeline ensamblada. Ante errores, explícalos en lenguaje llano y propón una corrección concreta:
   - `unknown_agent` → el agente no pertenece al plugin; muestra las alternativas válidas.
   - `incompatible_chaining` → explica qué tipos produce el paso anterior y qué acepta el siguiente; sugiere un agente intermedio o un reordenamiento.
   - `non_sequential_steps` → renumera.
   Nunca muestres errores JSON crudos al usuario. Revalida tras cada corrección hasta `valid: true`.

4. **Confirma.** Muestra la pipeline final como lista numerada (agente — propósito — checkpoint sí/no), el `output_spec` y el `slug`. Pide confirmación explícita antes de guardar.

5. **Guarda.** Llama al tool `save_workflow` con `user_id`, `slug`, `name`, `description`, `pipeline`, `output_spec`. No fijes `visibility` salvo que el usuario pida explícitamente compartir el flujo (`team` / `public`).

6. **Confirma el éxito.** Di al usuario: «Salvato. Lo esegui con `/bettercallclaude-espana:workflow <slug>`.» Si el servidor reportó errores de validación al guardar (revalida en el servidor), vuelve al paso 3 con esos errores.

## Reglas

- El ámbito del plugin lo impone el manifest del servidor — no añadas tu propio filtrado de agentes.
- Nunca inventes `agent_id`; usa solo los valores devueltos por `list_agents` en esta sesión.
- Mantén la entrevista corta: como mucho las preguntas listadas.
- Si el servidor `workflows-esp` no está disponible o un tool devuelve `not_implemented`, dilo con claridad y sugiere reintentar más tarde (la integración completa se publica en una próxima release).

---

## Consulta del Usuario

$ARGUMENTS
