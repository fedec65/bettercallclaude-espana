---
name: output-conventions
description: "Convención output-as-file compartida para todos los comandos de BetterCallClaude España. Define la estructura de la carpeta bcc-output, la nomenclatura de los archivos y la plantilla de resumen en chat."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
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

## Aplicabilidad

Comandos que producen archivos de salida con esta convención:

| Comando | Archivo de Salida |
|---------|-------------------|
| `legal` (multi-agente) | varía según workflow |
| `research` | `02-investigacion.md` |
| `strategy` | `03-estrategia.md` |
| `draft` | `05-borrador-<doc>.md` o `.docx` |
| `adversarial` | `04-contradictorio.md` |
| `workflow` | todos los archivos del pipeline |
| `translate` | `traduccion-<doc>.md` |
| `doc-analyze` | `analisis-<doc>.md` |
| `precedent` | `cadena-precedentes-<tema>.md` |
| `legal-5step` | los 5 archivos + `fuentes.md` |
| `briefing` | `plan-briefing.md` |
| `autonomic` *(CCAA)* | `dictamen-autonomico-<ccaa>.md` |

> **Pendiente (Map B)**: `/triage-nda`, `/cronologia-legal`, `/percurso-legal`, `/mapa-legal`, `/objetivo-legal`, `/bucle-legal` ampliarán esta tabla cuando se creen. Hasta entonces sus archivos de salida no están definidos.

Comandos que se quedan en chat: `cite`, `validate`, `refine`, `summarize --breve`, `version`, `help`, `privacy`, `setup`. Los comandos pendientes de Map B que también permanecerán en chat: `start`, `doctor`.
