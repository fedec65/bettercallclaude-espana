# Instalación — BetterCallClaude España

Plugin de inteligencia legal española para Claude (Code CLI y Cowork Desktop). Esta guía describe la **instalación** del plugin y los **flujos persistentes** (Map D) disponibles desde v1.1.0.

## 1. Instalación del plugin

Sigue las instrucciones estándar de Claude Code CLI / Cowork Desktop para cargar el marketplace `bettercallclaude-espana` y activar el plugin. Una vez activado, el plugin expone:

- **21 agentes** especializados en derecho español (ver `agents/`).
- **30 comandos** (ver `commands/`), entre ellos `legal`, `research`, `strategy`, `draft`, `workflow`.
- **15 skills** (ver `skills/`) con vocabulario, marcos y plantillas españolas.
- **13 servidores MCP** que dan acceso a BOE, CENDOJ, TC, EUR-Lex, Congreso, citas, persona, doctrina, derecho histórico, Catalunya, búsqueda general, ollama local y **`workflows-esp`** (este último para flujos persistentes).

## 2. Workflows persistentes (Map D — desde v1.1.0)

Un *workflow* es una cadena multi-agente reutilizable: defines el orden de los agentes, los puntos de control y el formato del output final, y el plugin lo ejecuta y persiste el progreso entre invocaciones. Mientras el sandbox de Cowork Desktop se borra al reiniciar, el **estado del workflow se conserva** en el servidor MCP `workflows-esp` (Postgres en producción, SQLite para desarrollo) más el directorio local `bcc-output/workflow/<user_id>/<slug>/` que guarda los outputs por etapa.

### 2.1 Comandos disponibles

- **`/bettercallclaude-espana:create-workflow`** — entrevista para diseñar un workflow nuevo. Lista los agentes encadenables, propone una secuencia según la compatibilidad de tipos, la valida contra el manifest del servidor y la guarda con un `slug`.
- **`/bettercallclaude-espana:workflow`** — ejecuta plantillas fijas (litigation-prep, due-diligence, contract-lifecycle, realestate-closing) o un workflow guardado por el usuario. Soporta `list`, `show <slug>`, `delete <slug>` y `--resume` para reanudar desde el último paso completado.

### 2.2 Resolución del `user_id`

Cada tool del servidor `workflows-esp` requiere un `user_id`. El orden de resolución es:

1. **Plugin setting** `User ID for custom workflows` (CLI) o `${user_config.user_id}` si está fijado.
2. **Custom instructions** de Cowork (Settings → General → Instructions for Claude): línea `BetterCallClaude España workflow user ID: <id>`.
3. **Config local** `~/.betterask/config.yaml`: clave `user_id: <id>`. Cowork borra el home del sandbox al reiniciar, por lo que esta fuente es volátil.
4. **Generado y reclamado** — el plugin genera `bcc-<8 hex bytes>`, lo reclama con `claim_user_id` (idempotente) y lo persiste en `~/.betterask/config.yaml`. Para conservarlo entre reinicios de Cowork, cópialo a las custom instructions (paso 2) o al plugin setting (paso 1).

> Nota: el `user_id` controla el acceso a tus flujos. Cualquiera que conozca tu ID puede leerlos en el servidor. Trátalo como una credencial.

### 2.3 Estructura de archivos en `bcc-output/`

```
bcc-output/workflow/<user_id>/<slug>/<run-id>/
├── intake.md          # Etapa 1 — briefing coordinator
├── analysis.md        # Etapa 2 — legal researcher (marco legal)
├── citations.md       # Etapa 2 — legal researcher (citas y precedentes)
├── borrador.md        # Etapa 3 — legal drafter
└── progress.json      # Estado por etapa (completed / pending)
```

Cada archivo se escribe cuando su etapa termina. `progress.json` es la fuente de verdad para `--resume`: si una etapa está marcada `completed` **y** su archivo existe, se omite en la reanudación; en caso contrario se vuelve a ejecutar.

### 2.4 Ejemplo: `flusso-nda` (NDA review chain)

El workflow de ejemplo analiza un NDA, identifica cláusulas arriesgadas, cita la jurisprudencia aplicable y produce un borrador de comentarios:

| Etapa | Agente                              | Propósito                                | Output      | Checkpoint |
|-------|-------------------------------------|------------------------------------------|-------------|------------|
| 1     | `spanish-briefing-coordinator`      | Ensamblar el brief del NDA               | `intake.md` | —          |
| 2     | `spanish-legal-researcher`          | Investigar el marco legal y localizar citas | `analysis.md` + `citations.md` | sí |
| 3     | `spanish-legal-drafter`             | Borrador de cláusulas y comentarios       | `borrador.md` | sí       |
| 4     | `spanish-data-protection-expert`    | Anotación de riesgo LOPDGDD / cláusulas abusivas | (anotaciones a `borrador.md`) | — |

> La cadena tiene **4 etapas** en lugar de una etapa separada de citas: `spanish-citation-expert` no encadena con `spanish-legal-drafter` (`verified_citations` no está entre los `input_types` del drafter), así que las citas y precedentes los recopila `spanish-legal-researcher` en la etapa 2 y los entrega al drafter directamente.

> **Nota sobre el agente `nda-triage-agent`**: la documentación inicial lo describía como un agente dedicado; en el manifest real se corresponde con `spanish-data-protection-expert`, que es el especialista en protección de datos y cláusulas abusivas del plugin. La cadena semántica del workflow es la misma.

Para reproducir el flujo end-to-end en local (requiere el servidor MCP `workflows-esp` accesible y `npm run build` en el repo MCP):

```bash
npm run test:flusso-nda
```

El script `scripts/test-flusso-nda-e2e.mjs` arranca el aggregator MCP, guarda el workflow, simula un reinicio de Cowork (cierre y reapertura del proceso del servidor) y verifica que la persistencia sobrevive a la reconexión.

### 2.5 Privacidad y residencia de datos

- Los workflows y runs viven en el servidor `workflows-esp`. En producción Railway Postgres (variables `DATABASE_URL`); en desarrollo, SQLite en `WORKFLOWS_SQLITE_PATH`.
- El `user_id` es la única clave de acceso — no hay autenticación adicional. El servidor es *single-tenant* por despliegue (no hay membresía multi-tenant ni separación RLS): si despliegas el plugin para varias personas, cada una necesita un `user_id` distinto y el aislamiento es por convención.
- El comando `/workflow delete <slug>` borra un workflow propio (no afecta a los demás). `delete_user` (expuesto en los tools, no como comando) borra en cascada workflows y runs de un `user_id` y se ofrece solo como operación de mantenimiento (LOPDGDD §17).
- Hook `secreto profesional` del plugin sigue activo: aplica también al contenido de los workflows.

## 3. Solución de problemas

- **`Tool not implemented`** — el servidor `workflows-esp` no está integrado o no se ha hecho `npm run build` en el repo MCP. Ver `docs/workflows-esp.md` (en el repo MCP) para el estado de implementación.
- **`user_id not claimed`** — el plugin no pudo leer/escribir `~/.betterask/config.yaml`. Establece el ID manualmente en custom instructions o plugin setting.
- **Servidor no alcanzable** — confirma que el aggregator HTTP responde en `GET /health` con `servers: 13` (los 12 anteriores + `workflows-esp`).
