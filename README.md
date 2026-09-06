[![Versión](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/fedec65/bettercallclaude-espana/releases)
[![Licencia: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-green)](LICENSE)
[![Plataforma](https://img.shields.io/badge/platform-Cowork%20Desktop-orange)](https://claude.ai)
[![Web](https://img.shields.io/badge/web-bettercallclaude.es-brightgreen)](https://bettercallclaude.es)
[![Servidores MCP](https://img.shields.io/badge/MCP%20servers-13-purple)](https://mcp.bettercallclaude.es/health)

<p align="center">
  <img src="docs/images/bettercallclaude_logo.png" alt="BetterCallClaude España" width="480">
</p>

# BetterCallClaude España — Inteligencia legal para España
# Spain legal intelligence for Claude (Cowork Desktop)

Plugin de inteligencia jurídica española para Cowork Desktop. Transforma la investigación jurídica, la estrategia procesal y la redacción documental para abogados y despachos españoles — *secreto profesional* y RGPD/LOPDGDD por defecto.

> **Claude Code CLI users**: this repository is for Cowork Desktop. The CLI version lives in [fedec65/bettercallclaude-cli](https://github.com/fedec65/bettercallclaude-cli). / *Usuarios de Claude Code CLI: este repo es para Cowork Desktop.*

---

## Novedades en v2.0.0 / What is new in v2.0.0

- **Plugin completamente en español** — 21 skills y 30 comandos redactados en castellano jurídico (ES nativo), incluyendo los 15 comandos renombrados al español.
- **Paridad arquitectural con la referencia IT** — agents/skills/servers/commands alineados estructuralmente con `bettercallclaude_italia`.
- **Servidor MCP `workflows-esp`** (Map D) — workflows persistentes multi-agente con 9 tools (`claim_user_id`, `save_workflow`, `list_workflows`, `log_run`, …). Llega a 13 servidores MCP totales.
- **4 docs ES nuevos** — `INSTALACION.md`, `PLAYBOOK.md`, `docs/command-reference.md`, `docs/AGENT_ARCHITECTURE.md`.
- **`evals/`, `testdocs/`, `templates/`** — fixtures de regresión y plantilla `bettercallclaude-espana.local.md.example.es` para que cada despacho personalice su playbook.
- **Niveles de privacidad refinados** — `estricto` / `equilibrado` / `nube` ahora cubren las marcas de privilegio del secreto profesional con default equilibrado.

---

## Inventario v2.0.0 / Inventory

### 21 agentes / agents

| Agente | Rol |
|---|---|
| `researcher` | Investigación — BOE, CENDOJ, TC, doctrina |
| `advocate` | Posición demandante |
| `adversary` | Posición demandada |
| `judicial` | Análisis desde el tribunal |
| `drafter` | Redacción de documentos procesales |
| `citation` | Formato y verificación de citas |
| `strategist` | Estrategia procesal (LEC) |
| `briefing` | Briefings pre-ejecución |
| `chronology-builder` | Cronología procesal y plazos |
| `procedure` | Tramitación procesal |
| `risk` | Análisis de riesgo |
| `compliance` | Cumplimiento normativo (CNMV, BdE, SEPBLAC) |
| `corporate` | Derecho mercantil |
| `fiscal` | Derecho tributario |
| `realestate` | Derecho inmobiliario |
| `autonomic` | Derecho autonómico (17 CCAA) |
| `data-protection` | Protección de datos (RGPD/LOPDGDD) |
| `translator` | Traducción jurídica ES/EN |
| `summarizer` | Resumen de documentos |
| `prompt-engineer` | Ingeniería de prompts jurídicos |
| `orchestrator` | Despacho multi-agente |

### 30 comandos / commands

**Portal & onboarding** — `legal`, `ayuda`, `start`, `doctor`, `version`, `configurar`.

**Investigación** — `investigacion`, `precedente`, `federal`, `autonomico`, `cronologia-legal`, `analizar-doc`.

**Estrategia & contradictorio** — `estrategia`, `analisis-adversarial`, `refinar`, `briefing`, `mapa-legal`, `percurso-legal`, `bucle-legal`, `objetivo-legal`.

**Redacción & verificación** — `borrador`, `cita`, `validar`, `resumir`, `traducir`.

**Flujos persistentes (Map D)** — `create-workflow`, `workflow`, `triage-nda`.

**Utilidades** — `privacidad`, `legal-5step`.

### 21 skills

**Investigación & análisis** — `spanish-legal-research`, `spanish-jurisdictions`, `spanish-document-analysis`, `legal-chronology`, `legal-query-refinement`, `output-summarization`, `legal-wayfinder`, `legal-intake`.

**Redacción & verificación** — `spanish-legal-drafting`, `spanish-citation-formats`, `citation-content-verify`.

**Estrategia & proceso** — `spanish-legal-strategy`, `legal-5step-framework`, `legal-briefing`, `adversarial-analysis`, `legal-evaluator`.

**Núcleo & cumplimiento** — `spanish-legal-translation`, `privacy-routing`, `data-protection-law`, `compliance-frameworks`, `shared` (output-as-file).

### 13 servidores MCP

| Servidor | Origen | Propósito |
|---|---|---|
| `boe-legislacion` | gateway | Legislación estatal (BOE) |
| `cendoj-jurisprudencia` | gateway | Jurisprudencia TS/STS/AP |
| `tribunal-constitucional` | gateway | STC y derechos fundamentales |
| `doctrina-academica` | gateway | Doctrina y artículos jurídicos |
| `derecho-historico` | gateway | Gazeta histórica + legislación histórica |
| `catalunya-legal` | gateway | Derecho civil catalán |
| `eu-law-esp` | gateway | Derecho UE aplicable en España |
| `congreso-debates` | gateway | Proyectos de ley y debates |
| `busqueda-general` | gateway | Búsqueda web jurídica |
| `legal-citations-esp` | gateway | Verificador de citas |
| `legal-persona-esp` | gateway | Redacción jurídica con plantillas |
| `ollama` | stdio local | LLM local para `estricto` |
| `workflows-esp` | gateway | Workflows persistentes multi-agente |

---

## Renombrado v1 → v2.0.0 / Commands renamed

| Antes (EN, v1.0) | Ahora (ES, v2.0.0) |
|---|---|
| `research` | `investigacion` |
| `draft` | `borrador` |
| `cite` | `cita` |
| `adversarial` | `analisis-adversarial` |
| `autonomic` | `autonomico` |
| `doc-analyze` | `analizar-doc` |
| `precedent` | `precedente` |
| `privacy` | `privacidad` |
| `refine` | `refinar` |
| `setup` | `configurar` |
| `strategy` | `estrategia` |
| `summarize` | `resumir` |
| `translate` | `traducir` |
| `validate` | `validar` |
| `help` | `ayuda` |

Los alias EN se mantienen como stubs deprecados y se eliminarán en v2.1.0.

---

## Instalación / Install

Sigue la guía completa en [`INSTALACION.md`](INSTALACION.md). Resumen para Cowork Desktop:

1. **Marketplace** — instala el plugin desde este marketplace.
2. **Playbook local (opcional)** — copia `templates/bettercallclaude-espana.local.md.example.es` a `.claude/bettercallclaude-espana.local.md` y personalízalo para tu despacho.
3. **API token (opcional)** — rellena el campo `api_token` en la configuración del plugin si usas un gateway BetterCallClaude dedicado.

> La imagen de instalación de Cowork Desktop se documenta en `docs/images/cowork_install.png` (placeholder pendiente).

## Arquitectura

Coordinación agent × skill × server × command — ver [`docs/AGENT_ARCHITECTURE.md`](docs/AGENT_ARCHITECTURE.md) para la matriz completa y [`docs/MCP_TOOLS.md`](docs/MCP_TOOLS.md) para el inventario MCP.

## Uso / Usage

Ejemplos de flujos completos en [`PLAYBOOK.md`](PLAYBOOK.md). Tres arranques típicos:

- `investigacion "responsabilidad extracontractual por producto defectuoso"` → memo en `bcc-output/<fecha>/02-investigacion.md`
- `legal-5step "oposición a monitorio de alquileres"` → 5 archivos: intake → investigación → estrategia → contradictorio → borrador
- `create-workflow` → diseña un flujo persistente y guárdalo en `workflows-esp`

## Contribuir / Contributing

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md). El proyecto se publica bajo [AGPL-3.0](LICENSE).

## Changelog

[`CHANGELOG.md`](CHANGELOG.md) — entradas para v1.0.0, v1.1.0, v1.1.1 y v2.0.0.
