---
name: output-conventions
description: "Convenciones compartidas para los comandos de BetterCallClaude España: output-as-file (carpeta bcc-output, nomenclatura, plantilla de resumen en chat), resolución del user_id de los flujos persistentes (workflows-esp) y convenciones de ejecución de workflows."
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

# Convención de Output BetterCallClaude España

Este documento define el comportamiento estándar de salida para todos los comandos BetterCallClaude España que produzcan resultados de más de aproximadamente una página (~500 palabras).

## Regla

Todo comando que produzca una salida larga (memoria, investigación, estrategia, análisis, triage, traducción, borrador) **DEBE**:

1. Escribir el resultado completo como archivo en la carpeta de trabajo.
2. Mostrar en chat solo un **resumen de 3-5 líneas** más la ruta al archivo escrito.

Salidas cortas (citación, verificación, refinar, versión, ayuda, privacidad, summarize --breve) pueden quedarse en chat.

## Estructura de Carpeta

```
<carpeta trabajo>/bcc-output/
  YYYY-MM-DD-<slug>/
    01-intake.md
    02-investigacion.md
    03-estrategia.md
    04-contradictorio.md
    05-borrador-<documento>.md   (o .docx para redline)
    fuentes.md
```

- **`bcc-output`** es el nombre de carpeta por defecto. El usuario puede cambiarlo en el playbook local (`bettercallclaude-espana.local.md`) bajo "Estilo y formato" -> preferencia de carpeta de salida.
- La **subcarpeta con fecha-slug** usa el formato `YYYY-MM-DD-<descripcion-breve>` (ej. `2026-06-01-triage-nda-rossi`).
- La **numeración** sigue las fases de `/legal-5step`. Los comandos ejecutados individualmente escriben solo los archivos pertinentes en la misma estructura.
- **`fuentes.md`** está siempre presente cuando se han usado servidores MCP: lista cada fuente consultada con fecha de verificación -- esta es la traza documental para la due diligence.

## Formatos de Archivo

- **Por defecto**: `.md` (Markdown).
- **Redline / documentos para contraparte**: `.docx` (tracked changes donde aplique).
- **Bajo petición explícita**: cualquier formato.
- El playbook puede fijar un formato por defecto en la sección "Estilo y formato".

## Comportamiento por Entorno

- **Cowork**: la carpeta de trabajo es la carpeta compartida seleccionada por el usuario. Los archivos aparecen directamente en el explorador de archivos del usuario.
- **Claude Code**: la carpeta de trabajo es la raíz del proyecto. Misma estructura, path base distinto.

## Plantilla de Resumen en Chat

Cuando escribas un archivo, muestra en chat:

```
**[Título del resultado]** escrito en `bcc-output/YYYY-MM-DD-slug/filename.md`

[Resumen 3-5 líneas de los resultados / conclusiones clave]

Documento completo: `bcc-output/YYYY-MM-DD-slug/filename.md`
Fuentes: `bcc-output/YYYY-MM-DD-slug/fuentes.md`
```

## User ID Resolution (flujos persistentes)

Los comandos de flujos persistentes (`create-workflow`, `workflow`) identifican al usuario con un `user_id` ante el servidor `workflows-esp`. Resuélvelo siempre en este orden:

1. **Plugin setting** `${user_config.user_id}` — si se resuelve a un valor no vacío (el placeholder no aparece literalmente), úsalo.
2. **Custom instructions** (Cowork Desktop) — línea de la forma `BetterCallClaude España workflow user ID: <id>`. Es la fuente duradera en Cowork: la app guarda las instrucciones y sobreviven a los reinicios, a diferencia del filesystem del sandbox.
3. **Config local** — línea `user_id:` en `~/.betterask/config.yaml`, si existe. Caché de conveniencia: Cowork borra el home del sandbox al reiniciar.
4. **Genera, reclama y persiste** — candidato `bcc-<hex>` (8 bytes aleatorios, p. ej. `openssl rand -hex 8`), reclamado con el tool `claim_user_id` (hasta 3 reintentos ante colisión) y persistido **añadiendo** `user_id: bcc-<hex>` a `~/.betterask/config.yaml`.

Reglas: **nunca** uses un ID compartido `default`; para un ID de los pasos 1–3, llama a `claim_user_id` una vez antes de la primera operación (`claimed: false` = ya registrado — normal si es tuyo desde otra máquina, continúa); si el archivo no se puede escribir, entrega el ID al usuario para que lo fije como custom instruction (Cowork) o plugin setting (CLI) y detente.

## Workflow Execution Conventions

`workflow` escribe los artefactos de cada ejecución de pipeline en:

```
<carpeta trabajo>/bcc-output/workflow/<user_id>/<slug>/
  progress.json        estado de la ejecución: pasos `completed` y checkpoint
  NN-<agent_id>.md     output de cada etapa (NN = número de paso: 01, 02, …)
```

- **Sin carpeta fechada**: el directorio lo fijan `user_id` + `slug` del flujo (excepción deliberada a la carpeta `YYYY-MM-DD-<slug>` — permite reanudar la misma ejecución).
- **`progress.json`** es el contrato de reanudación: `workflow --resume` lo lee y salta las etapas completadas. Un paso se considera completado solo si su archivo de output existe **y** `progress.json` lo marca `completed`.
- **Idempotencia**: una etapa completada no se re-ejecuta en `--resume` salvo petición explícita; `--paso=N` fuerza la reanudación desde el paso N.
- Los flujos guardados viven en el servidor `workflows-esp`, no en disco: este directorio contiene solo los artefactos de ejecución.

## Aplicabilidad

Comandos que producen archivos de salida con esta convención:

| Comando | Archivo de Salida |
|---------|-------------------|
| `legal` (multi-agente) | varía según workflow |
| `research` | `02-investigacion.md` |
| `strategy` | `03-estrategia.md` |
| `draft` | `05-borrador-<doc>.md` o `.docx` |
| `adversarial` | `04-contradictorio.md` |
| `workflow` | `bcc-output/workflow/<user_id>/<slug>/` — `progress.json` + un `.md` por etapa (sin carpeta fechada; ver «Workflow execution conventions») |
| `create-workflow` | sin archivo de salida — persiste el flujo en el servidor `workflows-esp` |
| `translate` | `traduccion-<doc>.md` |
| `doc-analyze` | `analisis-<doc>.md` |
| `precedent` | `cadena-precedentes-<tema>.md` |
| `legal-5step` | los 5 archivos + `fuentes.md` |
| `briefing` | `plan-briefing.md` |
| `autonomic` *(CCAA)* | `dictamen-autonomico-<ccaa>.md` |
| `cronologia-legal` | `bcc-output/cronologia/` — `events.json` + `cronologia.md`/`.html`/`.docx` (excepción deliberada: artefacto vivo del caso, sin carpeta fechada) |
| `mapa-legal` | `bcc-output/YYYY-MM-DD-<slug>/wayfinder/map.md` + `wayfinder/tickets/` (mapa decisional: carpeta fechada del caso) |
| `percurso-legal` | actualiza in situ `wayfinder/map.md` y `wayfinder/tickets/`; memos y prototipos en `assets/` |
| `objetivo-legal` | `bcc-output/goals/<id>.md` (Goal Record: draft → confirmed) |
| `bucle-legal` | `bcc-output/loops/<goal-id>/` — `iteration-N.md`, `summary.md`, `final/` |
| `triage-nda` | `bcc-output/YYYY-MM-DD-<slug>/triage-nda-<doc>.md` (lote: + tabla resumen) |

Comandos que se quedan en chat: `cite`, `validate`, `refine`, `summarize --breve`, `version`, `help`, `privacy`, `setup`. Los comandos de Map B que también permanecen en chat: `start`, `doctor`. `create-workflow` tampoco escribe archivos de salida: persiste el flujo en el servidor `workflows-esp` y confirma en chat.
