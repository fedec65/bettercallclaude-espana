# Arquitectura de Agentes — BetterCallClaude España

BetterCallClaude España usa una arquitectura multiagente con **21 agentes especializados** en derecho español, organizados en capas funcionales. El plugin incluye además **21 skills** (metodología y vocabulario) y **12 servidores MCP** (11 pasarelas remotas + `ollama` local) con acceso a BOE, CENDOJ, TC, EUR-Lex y fuentes autonómicas.

Este documento describe la topología de agentes, el catálogo de skills, las matrices de asignación (agente ↔ servidor MCP, comando ↔ skill) y el flujo de enrutado. Se complementa con `docs/command-reference.md` (29 comandos), `docs/PLAYBOOK.md` (uso práctico) e `INSTALACION.md` (instalación y playbook local). El inventario canónico de servidores y tools MCP está en `docs/MCP_TOOLS.md`; las matrices de este documento se derivan de `scripts/tool-contracts.js` (`AGENT_SERVER_MAP`, `COMMAND_SKILL_MAP`), que los scripts `check-tool-names.js` y `generate-tool-frontmatter.js` mantienen sincronizadas con los frontmatter.

## 1. Topología de agentes (21)

Todos los agentes usan el modelo **sonnet**. Los servidores MCP listados son los que el agente declara en su frontmatter y que `AGENT_SERVER_MAP` exige; la forma canónica de cada tool es `mcp__plugin_bettercallclaude-espana_<servidor>__<tool>`.

### 1.1 Capa 1 — Pasarela y coordinación

| Agente | Rol | Servidores MCP |
|---|---|---|
| `spanish-orchestrator` | Clasifica la intención, resuelve la jurisdicción y enruta al agente o comando especializado. | `legal-persona-esp` |
| `spanish-briefing-coordinator` | Coordina el intake previo, ensambla paneles de especialistas y fija el contexto del asunto. | `legal-persona-esp` |
| `spanish-prompt-engineer` | Transforma consultas vagas en prompts estructurados mediante diálogo socrático. | — |
| `spanish-summarizer` | Consolida la salida de pipelines multiagente: deduplica y controla la extensión (ES/EN). | — |

### 1.2 Capa 2 — Especialistas jurídicos del núcleo

| Agente | Rol | Servidores MCP |
|---|---|---|
| `spanish-legal-researcher` | Busca jurisprudencia TS/STS/AP/TC, legislación (BOE) y doctrina. | `cendoj-jurisprudencia`, `boe-legislacion`, `tribunal-constitucional`, `doctrina-academica` |
| `spanish-legal-drafter` | Redacta contratos, escritos procesales, recursos e informes. | `legal-persona-esp` |
| `spanish-litigation-strategist` | Desarrolla la estrategia procesal conforme a la LEC: vía procesal, riesgos y costes. | `legal-persona-esp` |
| `spanish-citation-expert` | Valida y formatea citas jurídicas españolas de todas las fuentes. | `legal-citations-esp` |
| `spanish-procedure-expert` | Derecho procesal: plazos LEC/LECrim, escritos, recursos y ejecución. | `legal-persona-esp` |
| `autonomic-law-expert` | Derecho de las 17 CCAA más Ceuta y Melilla (foral incluido). | `derecho-historico`, `catalunya-legal`, `congreso-debates` |

### 1.3 Capa 3 — Especialistas de dominio

| Agente | Rol | Servidores MCP |
|---|---|---|
| `spanish-compliance-expert` | Cumplimiento regulatorio: CNMV, BdE, SEPBLAC, gobernanza y normativa sectorial. | `busqueda-general`, `legal-persona-esp` |
| `spanish-corporate-expert` | Derecho societario: SL, SA, fusiones y adquisiciones, pactos de socios (LSC). | `legal-persona-esp` |
| `spanish-fiscal-expert` | Derecho tributario: IRPF, IS, IVA, AEAT, convenios de doble imposición y LGT. | `legal-persona-esp` |
| `spanish-data-protection-expert` | Protección de datos: LOPDGDD, RGPD, AEPD, EIPD y transferencias internacionales. | `eu-law-esp`, `legal-persona-esp` |
| `spanish-realestate-expert` | Inmobiliario: registro, comunidades de propietarios, urbanismo y arrendamientos. | `legal-persona-esp` |
| `spanish-legal-translator` | Traducción jurídica ES ↔ EN con registro castellano preciso. | — |

### 1.4 Capa 4 — Análisis adversarial

| Agente | Rol | Servidores MCP |
|---|---|---|
| `spanish-risk-analyst` | Probabilidad de éxito del caso, cuantificación de daños y análisis coste-riesgo. | `legal-persona-esp` |
| `spanish-judicial-analyst` | Sintetiza las posiciones del abogado y del adversario con metodología de *Fundamentos de Derecho*. | `legal-persona-esp` |
| `spanish-advocate` | Construye el caso más sólido bajo derecho español (STS, doctrina). | `cendoj-jurisprudencia`, `tribunal-constitucional`, `doctrina-academica`, `legal-persona-esp` |
| `spanish-adversary` | Impugna posiciones con objeciones procesales y debilidades de prueba, jurisdicción y legitimación. | `legal-persona-esp` |

### 1.5 Capa 5 — Worker de cronología

| Agente | Rol | Servidores MCP |
|---|---|---|
| `chronology-builder` | Worker aislado: lee los documentos del caso de forma iterativa y extrae eventos de cronología con fuente obligatoria. | `legal-persona-esp` |

## 2. Catálogo de skills (21)

Las skills son material de referencia que los comandos aplican según `COMMAND_SKILL_MAP` (sección 4) o que el usuario invoca directamente. Salvo `shared`, cada skill vive en `skills/<nombre>/SKILL.md`.

### 2.1 Investigación y jurisdicción

- **`spanish-legal-research`** — investigación integral: jurisprudencia TS/AP/TC, legislación estatal y autonómica y doctrina.
- **`spanish-jurisdictions`** — resuelve la aplicabilidad del derecho estatal frente al autonómico en las 17 CCAA.

### 2.2 Estrategia y adversarial

- **`spanish-legal-strategy`** — estrategia de litigación y resolución de conflictos bajo la LEC.
- **`adversarial-analysis`** — somete a prueba posiciones jurídicas con una metodología de tres roles (abogado de una parte, abogado contrario, analista judicial), con puntuación de probabilidad y síntesis judicial.

### 2.3 Redacción y traducción

- **`spanish-legal-drafting`** — redacta contratos, escritos procesales e informes con citación correcta.
- **`spanish-legal-translation`** — traducción jurídica ES ↔ EN con precisión terminológica.

### 2.4 Citas, documentos y verificación

- **`spanish-citation-formats`** — verifica y formatea citaciones (STS/SAP/STC/BOE), individuales o por lotes.
- **`citation-content-verify`** — verificación sustancial: existencia Y soporte del contenido contra la fuente live, antes de la entrega.
- **`spanish-document-analysis`** — analiza documentos: identifica cuestiones, extrae cláusulas, verifica citas y evalúa conformidad.

### 2.5 Cumplimiento y privacidad

- **`compliance-frameworks`** — cumplimiento para entidades supervisadas: CNMV, BdE, SEPBLAC y gobernanza.
- **`data-protection-law`** — LOPDGDD, RGPD, orientaciones de la AEPD, EIPD y derechos de los interesados.
- **`privacy-routing`** — detecta secreto profesional y enruta la privacidad (`strict`/`balanced`/`cloud`) en las llamadas salientes.

### 2.6 Intake y refinamiento

- **`legal-intake`** — intake unificado en dos modalidades: Refine (dominio único) y Briefing (multidominio con panel).
- **`legal-query-refinement`** — diálogo socrático para convertir consultas vagas en tareas accionables.
- **`legal-briefing`** — intake previo a la ejecución multiagente: contexto, plazos y panel de especialistas.

### 2.7 Orquestación y ciclos

- **`legal-5step-framework`** — pipeline end-to-end de 5 pasos: intake → investigación → estrategia → adversarial → redacción.
- **`legal-wayfinder`** — descompone prácticas grandes en mapas decisionales (destino, decisiones, niebla, tickets).
- **`legal-evaluator`** — motor de veredictos del goal-loop: juzga artefactos contra Goal Records con separación worker-juez.
- **`legal-chronology`** — construye cronologías legales documentadas (eventos con fuente) desde los documentos del caso.
- **`output-summarization`** — consolida y resume la salida de pipelines multiagente; deduplica y controla la extensión.
- **`shared`** (`output-conventions`) — convención output-as-file compartida: estructura de `bcc-output` y nomenclatura de archivos.

## 3. Matriz agente ↔ servidor MCP

Fuente canónica: `AGENT_SERVER_MAP` en `scripts/tool-contracts.js`. Tres agentes (`spanish-prompt-engineer`, `spanish-summarizer`, `spanish-legal-translator`) no declaran servidores MCP: no necesitan tools de fuentes verbatim y trabajan con herramientas genéricas (Read/Grep/Bash/…) sobre el material que reciben.

| Agente | Servidores MCP |
|---|---|
| `spanish-orchestrator`, `spanish-briefing-coordinator`, `spanish-legal-drafter`, `spanish-litigation-strategist`, `spanish-procedure-expert`, `spanish-corporate-expert`, `spanish-fiscal-expert`, `spanish-realestate-expert`, `spanish-risk-analyst`, `spanish-judicial-analyst`, `spanish-adversary`, `chronology-builder` | `legal-persona-esp` |
| `spanish-legal-researcher` | `cendoj-jurisprudencia`, `boe-legislacion`, `tribunal-constitucional`, `doctrina-academica` |
| `spanish-advocate` | `cendoj-jurisprudencia`, `tribunal-constitucional`, `doctrina-academica`, `legal-persona-esp` |
| `autonomic-law-expert` | `derecho-historico`, `catalunya-legal`, `congreso-debates` |
| `spanish-compliance-expert` | `busqueda-general`, `legal-persona-esp` |
| `spanish-data-protection-expert` | `eu-law-esp`, `legal-persona-esp` |
| `spanish-citation-expert` | `legal-citations-esp` |
| `spanish-prompt-engineer`, `spanish-summarizer`, `spanish-legal-translator` | — (sin servidores MCP) |

El plugin expone **12 servidores** en `.mcp.json` (ver `docs/MCP_TOOLS.md`): `boe-legislacion`, `busqueda-general`, `catalunya-legal`, `cendoj-jurisprudencia`, `congreso-debates`, `derecho-historico`, `doctrina-academica`, `eu-law-esp`, `legal-citations-esp`, `legal-persona-esp`, `tribunal-constitucional` (remotos) y `ollama` (local, exento de los checks de privacidad).

## 4. Matriz comando ↔ skill

En esta arquitectura las skills se vinculan a los **comandos**, no a los agentes. `scripts/tool-contracts.js` declara dos conjuntos distintos: `COMMAND_SKILL_MAP` (las skills que cada comando aplica) y `MULTI_AGENT_COMMANDS` (12 comandos orquestadores con tool `Task` en su frontmatter, que despachan subagentes; solo `/legal`, `/legal-5step` y `/briefing` pertenecen a ambos conjuntos). La tabla cubre las 15 entradas de `COMMAND_SKILL_MAP` (dos pares de comandos comparten fila). El usuario también puede invocar una skill directamente en la conversación.

| Comando | Skills que aplica |
|---|---|
| `/legal` | `spanish-legal-research`, `legal-briefing` |
| `/legal-5step` | `legal-5step-framework`, `spanish-legal-research`, `spanish-legal-strategy`, `adversarial-analysis`, `spanish-legal-drafting`, `spanish-citation-formats` |
| `/briefing` | `legal-briefing` |
| `/investigacion`, `/precedente` | `spanish-legal-research` |
| `/federal` | `spanish-legal-research`, `spanish-jurisdictions` |
| `/analisis-adversarial` | `adversarial-analysis` |
| `/estrategia` | `spanish-legal-strategy` |
| `/borrador` | `spanish-legal-drafting` |
| `/traducir` | `spanish-legal-translation` |
| `/resumir` | `output-summarization` |
| `/cita`, `/validar` | `spanish-citation-formats` |
| `/analizar-doc` | `spanish-document-analysis` |
| `/refinar` | `legal-query-refinement` |

Fuera de la tabla anterior, los comandos aplican skills desde su propio cuerpo: `/mapa-legal` y `/percurso-legal` aplican `legal-wayfinder` en su totalidad; el goal-loop (`/objetivo-legal` + `/bucle-legal`) usa `legal-evaluator` como motor de veredictos; `/cronologia-legal` aplica `legal-chronology`; `/triage-nda` aplica `spanish-document-analysis` en modo triage NDA. La convención `shared` (`output-conventions`) rige la salida de `/mapa-legal`, `/percurso-legal`, `/cronologia-legal` y `/triage-nda`. `/start` y `/doctor` no aplican skills: `/start` referencia `privacy-routing` solo si llegan documentos confidenciales, y `/doctor` (diagnóstico de servidores MCP) remite la verificación de contenido de las citas a `citation-content-verify`. La referencia de cada comando (con sus flags) está en `docs/command-reference.md`.

## 5. Enrutado y flujo de datos

`/legal` puede enrutar en modo directo a **13 agentes especialistas** con `@agente` (researcher, drafter, litigation-strategist, citation-expert, compliance-expert, risk-analyst, procedure-expert, legal-translator, fiscal-expert, corporate-expert, autonomic-law-expert, realestate-expert y data-protection-expert); la ruta directa omite el briefing con `--skip-briefing`/`--direct`. Del resto de los 21: los de pasarela y coordinación (`spanish-orchestrator`, `spanish-briefing-coordinator`, `spanish-prompt-engineer`, `spanish-summarizer`) no se enrutan desde `/legal` sino que operan dentro de los flujos orquestados (briefing, refinado socrático y consolidación de salida); `chronology-builder` se despacha con `Task` desde `/cronologia-legal`. Los agentes adversariales dedicados (`spanish-advocate`, `spanish-adversary`, `spanish-judicial-analyst`) se invocan con `@` directo o como perfiles worker del goal-loop (`/objetivo-legal` → `/bucle-legal`). `/analisis-adversarial` no los despacha: ejecuta el análisis adversarial de tres fases encarnando los roles de la skill `adversarial-analysis` (abogado de una parte, abogado contrario, analista judicial) sobre `spanish-litigation-strategist`, `spanish-risk-analyst` y `spanish-procedure-expert`, sin tool `Task`.

```
Consulta del usuario
    ↓
Pasarela (/legal u otro comando): clasificación de intención, jurisdicción (estatal / CCAA)
    ↓
Briefing? (asuntos complejos o --briefing) → spanish-briefing-coordinator (panel de especialistas)
    ↓
Enrutado: agente especialista directo o flujo multiagente (/workflow, /legal-5step, /analisis-adversarial, …)
    ↓
Ejecución con servidores MCP y skills del comando
    ↓
Control de calidad: verificación de citas (existence + contenido) y derecho aplicable
    ↓
Entrega con aviso profesional; salida larga a archivo en bcc-output (convención shared)
```

Los flujos multiagente empaquetados son los cuatro de `/workflow`: `due-diligence`, `litigation-prep`, `contract-lifecycle` y `realestate-closing`, cada uno con su panel de especialistas (ver `docs/command-reference.md`). El análisis adversarial de tres fases vive en `/analisis-adversarial`.

## 6. Notas de diseño

- **Modelo único**: los 21 agentes usan `sonnet`; no hay capa de razonamiento superior dedicada.
- **Sin MCP para algunos agentes**: `prompt-engineer`, `summarizer` y `translator` no necesitan fuentes verbatim (BOE/CENDOJ) — trabajan sobre el material que reciben del flujo.
- **Cumplimiento de ámbito**: todos los agentes usan exclusivamente agentes, skills y servidores MCP del plugin; no invocan herramientas jurídicas externas ni bases de datos no españolas.
- **Calidad de citas**: antes de entregar, las citas se verifican contra la fuente (existencia y soporte del contenido); las citas no verificables bloquean la entrega (`delivery_blocked`) en vez de fabricarse.
- **Privacidad**: el hook de *secreto profesional* escanea las llamadas salientes a tools; `ollama` (local) está exento; modos configurables `strict`/`balanced`/`cloud` (ver `docs/command-reference.md` → `/privacidad`).
- **Persistencia de estado**: los comandos wayfinder persisten mapas y Goal Records en `bcc-output/`; el goal-loop (`/objetivo-legal` + `/bucle-legal`) deja un trail de veredictos verificable.
