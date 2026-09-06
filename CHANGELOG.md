# Changelog

## [2.0.0] - 2026-09-06 — Plugin full-ES parity IT (Map C)

Plugin completamente en español, paridad funcional con BetterCallClaude Italia v2.3.0.

### Major changes
- **15 comandos renombrados al español** con alias retro-compatibles (2 release):
  - `research` → `investigacion`
  - `draft` → `borrador`
  - `cite` → `cita`
  - `adversarial` → `analisis-adversarial`
  - `autonomic` → `autonomico`
  - `doc-analyze` → `analizar-doc`
  - `precedent` → `precedente`
  - `privacy` → `privacidad`
  - `refine` → `refinar`
  - `setup` → `configurar`
  - `strategy` → `estrategia`
  - `summarize` → `resumir`
  - `translate` → `traducir`
  - `validate` → `validar`
  - `help` → `ayuda`
- **21 skills en español** (15 tradotte da EN con legal transposition + 6 nuove di Map A: `citation-content-verify`, `legal-chronology`, `legal-evaluator`, `legal-intake`, `legal-wayfinder`, `shared`).
- **`CONTEXT.md`** — 21 termini legal-method con sinonimi rifiutati.
- **Docs ES (4)** — `INSTALACION.md` (rename + acento), `PLAYBOOK.md`, `docs/command-reference.md`, `docs/AGENT_ARCHITECTURE.md`.
- **`evals/`** — 2 set (`citation-verify` 39 voci ES, `legal-timeline` 11 voci LEC procesal plazo).
- **`testdocs/cronologia/`** — 4 fixture fittizie per `cronologia-legal`.
- **`templates/`** — `bettercallclaude-espana.local.md.example.es` (per-despatcho playbook).

### Changed
- `commands/help.md` → `commands/ayuda.md` (con 30 comandi elencati).
- `INSTALL_ES.md` → `INSTALACION.md` (con acento, alla root).
- `scripts/tool-contracts.js` — `COMMAND_SKILL_MAP` e `MULTI_AGENT_COMMANDS` aggiornati ai nomi nuovi; nuovo `Set DEPRECATED_COMMANDS` per i 15 alias stub.
- 15 file stub di deprecamento creati (es. `research.md` → delega a `investigacion.md`).
- 5 docs ES riscritti: `AGENT_ARCHITECTURE.md` (21 agenti, 21 skill, matrice grounded), `command-reference.md` (29 comandi v2.0), `PLAYBOOK.md` (flussi pratici), `CONTEXT.md` glossario v2, `INSTALACION.md` con accento.

### Notes
- **Breaking change**: chiunque importi slug di comandi nei propri workflow deve aggiornare a v2.0.0.
- Alias retro-compat attivi per 2 release (rimossi in v2.1.0).
- Map C: #40.

## [1.1.1] - 2026-09-05 — Add workflows-esp consumer commands

Delta incrementale sobre v1.1.0: trae a `main` el commit `feat(workflows-esp): plugin commands create-workflow + workflow hub` (#37), que añade el comando consumer `/create-workflow` y convierte `/workflow` en un hub de gestión de flujos. Resuelto el conflicto de rebase en `scripts/generate-tool-frontmatter.js` moviendo `SERVER_TOOLS` / `MULTI_AGENT_COMMANDS` a `scripts/tool-contracts.js` (single source of truth compartida con `check-tool-names.js`).

### Changed
- `scripts/tool-contracts.js`: añadido `workflows-esp` (9 tool) a `SERVER_TOOLS` y `create-workflow.md` a `MULTI_AGENT_COMMANDS`; comentario de cabecera actualizado a 12 remote + 1 stdio = 13 server / 56 tool.
- `scripts/generate-tool-frontmatter.js`: importa los contratos desde `./tool-contracts` (sin duplicación local).
- `check-tool-names.js`: pasa (72 archivos, 876 entradas, 18 agentes mapeados, 13 comandos orquestadores, 21 skills limpias).
- `validate-plugin.js`: alineado a 1.1.1 en marketplace.json / plugin.json / package.json.

### Notes
- Rebase del commit único `fe9f0a7` sobre `origin/main` (post v1.1.0), no dev → main, para mantener la historia lineal.
- Mismo árbol funcional que el PR original #37 contra dev: sin regresión semántica.

## [1.1.0] - 2026-09-05 — Flujos persistentes (Map D)

**Workflows persistentes** end-to-end en el plugin España, con nuevo servidor MCP `workflows-esp` (ADR 0001) y dos comandos nuevos.

### New
- **Servidor MCP `workflows-esp`** (en el repo MCP): 9 tools concretos (`claim_user_id`, `list_agents`, `validate_pipeline`, `save_workflow`, `list_workflows`, `get_workflow`, `delete_workflow`, `log_run`, `delete_user`) con 3 providers — Postgres (prod, `DATABASE_URL`), SQLite (dev, `WORKFLOWS_STORE=sqlite`), InMemory (fallback/test). Schema idempotente + `migrations/0001_init.sql`. Cuota 50 workflows activos/user; cascade-delete LOPDGDD §17.
- **Comando `/bettercallclaude-espana:create-workflow`** — entrevista guiada para diseñar un workflow, validarlo contra el manifest y guardarlo en el servidor.
- **Comando `/bettercallclaude-espana:workflow`** (reescrito como hub) — plantillas fijas (litigation-prep, due-diligence, contract-lifecycle, realestate-closing) + flujos guardados, con `--resume` desde el último paso completado.
- **Setting `user_id`** en `plugin.json` (CLI) más cadena de resolución 4-fallback (plugin setting → custom instructions Cowork → `~/.betterask/config.yaml` → generado y reclamado).
- **Sección «Workflows persistentes»** en `INSTALACION.md` con ejemplo `flusso-nda` (NDA review chain) y notas de privacidad.
- **Doc `docs/workflows-esp.md`** en el repo MCP con arquitectura, schema DB y ejemplos.
- **Test E2E** `scripts/test-flusso-nda-e2e.mjs` que arranca el aggregator MCP, guarda `flusso-nda`, simula reinicio de Cowork (subprocess kill/relaunch) y verifica la persistencia + `--resume`. Invocable con `npm run test:flusso-nda`.
- **PR bifase**: plugin-side (este PR) + MCP-side (#3 en `BetterCallClaudeMCP_Espana`); merge coordinado.

### Changed
- `commands/workflow.md` ampliado con gestión de flujos guardados (`list`, `show`, `delete`) y reanudar por etapa (no es nuevo, pasa de 21 a 30 comandos totales junto con `create-workflow`).
- `skills/shared/SKILL.md`: secciones «User ID resolution» y «Workflow execution conventions».
- `docs/MCP_TOOLS.md` y `CONNECTORS.md`: alineados a 13 servers / 56+9 tools (workflows-esp añade 9).
- `validate-plugin.js`, `check-tool-names.js`: cobertura ampliada a la fila `workflows-esp` y los 9 nombres scoped/bare.

### Notes
- Versión bump a 1.1.0 (no a 2.0.0 — el bump mayor queda en Map C fuera de este PR).
- El agente descrito como `nda-triage-agent` en la documentación inicial corresponde a `spanish-data-protection-expert` (no hay agente NDA dedicado en el manifest).
- Pipeline de ejemplo a **4 etapas** `briefing → researcher → drafter → data-protection`: `spanish-citation-expert` no encadena con `spanish-legal-drafter` (`verified_citations` no figura entre los `input_types` del drafter), así que las citas (`citations.md`) las produce `spanish-legal-researcher` en la etapa 2. La cadena semántica original (brief → research/citas → draft → revisión LOPDGDD) se preserva.

## [1.0.0] - 2026-06-03 — Initial Spain Release

**BetterCallClaude España** — Complete adaptation of the Swiss BetterCallClaude plugin to the Spanish legal environment.

### New
- **20 agents**: spanish-legal-researcher, autonomic-law-expert, spanish-legal-drafter, spanish-litigation-strategist, spanish-citation-expert, spanish-compliance-expert, spanish-corporate-expert, spanish-fiscal-expert, spanish-data-protection-expert, spanish-procedure-expert, spanish-realestate-expert, spanish-legal-translator, spanish-risk-analyst, spanish-judicial-analyst, spanish-advocate, spanish-adversary, spanish-briefing-coordinator, spanish-orchestrator, spanish-prompt-engineer, spanish-summarizer
- **21 commands**: legal, research, strategy, draft, cite, validate, precedent, federal, autonomic, adversarial, briefing, workflow, translate, doc-analyze, summarize, setup, version, legal-5step, privacy, help, refine
- **15 skills**: spanish-legal-research, spanish-citation-formats, spanish-jurisdictions, spanish-legal-drafting, spanish-legal-strategy, spanish-legal-translation, spanish-document-analysis, legal-query-refinement, legal-briefing, adversarial-analysis, output-summarization, compliance-frameworks, data-protection-law, privacy-routing, legal-5step-framework
- **12 MCP servers**: boe-legislacion, legal-citations-esp, legal-persona-esp, cendoj-jurisprudencia, tribunal-constitucional, eu-law-esp, congreso-debates, doctrina-academica, derecho-historico, catalunya-legal, busqueda-general, ollama (bundled local)
- **Privacy hook**: secreto profesional detection (Art. 24 LOPJ / Art. 542 CP) with strict/balanced/cloud modes
- **Plugin scope enforcement**: All legal commands include explicit instruction to use exclusively BetterCallClaude España agents, skills, and MCP servers

### Adapted from Swiss v4.7.0
- All Swiss legal content replaced with Spanish equivalents
- BGE/ATF/DTF → TS/STS/AP/AN/TC
- 26 cantons → 17 CCAA + 2 autonomous cities
- ZGB/OR/StGB/ZPO/BV → CC/CP/LEC/LECr/LOPJ/CE
- Anwaltsgeheimnis → secreto profesional
- CHF → EUR
- DE/FR/IT/EN → ES/EN
