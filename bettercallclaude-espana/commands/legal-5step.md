---
description: "Execute the 5-step end-to-end framework: intake → research → strategy → adversarial → draft."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_metadatos
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_indice
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_bloque
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_analisis
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_by_tribunal
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_sentencias_tc
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__get_sentencia_tc
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_by_tema
  - Task
  - mcp__boe-legislacion__search_boe
  - mcp__boe-legislacion__get_legislacion
  - mcp__boe-legislacion__get_metadatos
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__boe-legislacion__get_indice
  - mcp__boe-legislacion__get_bloque
  - mcp__boe-legislacion__get_analisis
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__cendoj-jurisprudencia__search_by_tribunal
  - mcp__tribunal-constitucional__search_sentencias_tc
  - mcp__tribunal-constitucional__get_sentencia_tc
  - mcp__tribunal-constitucional__search_by_tema
  - mcp__plugin_bettercallclaude-espana_doctrina-academica__search_doctrina
  - mcp__plugin_bettercallclaude-espana_doctrina-academica__search_by_autor
  - mcp__doctrina-academica__search_doctrina
  - mcp__doctrina-academica__search_by_autor
---

# legal-5step — End-to-End 5-Step Framework

Execute the complete 5-step end-to-end legal framework for Spanish law matters.

## Scope Constraint
Use exclusively BetterCallClaude España agents, skills, and MCP servers.

## The 5 Steps

### Step 1: Intake
- Collect all facts, documents, deadlines, and client objectives.
- Identify jurisdiction (estatal / autonómico / mixed).
- Assign CCAA if applicable.
- Output: Case intake memo.

### Step 2: Research
- @spanish-legal-researcher searches precedents (STS, SAP, STC) and statutes (CC, CP, LEC, CE, CCAA laws).
- Query BOE and relevant CCAA official bulletins.
- Output: Research memorandum with applicable law and precedents.

### Step 3: Strategy
- @spanish-litigation-strategist develops procedural pathway under LEC.
- Risk assessment and cost-benefit analysis (EUR).
- Timeline estimation.
- Output: Strategy memo with recommended course of action.

### Step 4: Adversarial
- Three-agent analysis: advocate vs. adversary vs. judicial analyst.
- Stress-test all arguments under Spanish law.
- Output: Adversarial report with probability assessment.

### Step 5: Draft
- @spanish-legal-drafter produces the required legal document(s):
  - Court submissions (demanda, escrito, recurso)
  - Contracts
  - Legal opinions
- @spanish-citation-expert verifies all citations.
- Output: Final draft with verified citations.

## Flags
- `--skip-research`: Skip Step 2 (user provides research).
- `--skip-adversarial`: Skip Step 4 (faster turnaround).
- `--output-format`: Specify output format (markdown, docx-ready, plain text).

## Skills Used
- legal-5step-framework
- spanish-legal-research
- spanish-legal-strategy
- adversarial-analysis
- spanish-legal-drafting
- spanish-citation-formats
- spanish-jurisdictions

## Examples
- `/bettercallclaude-espana:legal-5step "Demanda por nulidad de cláusula suelo contra BBVA, Juzgado de Primera Instancia nº 15 de Madrid, plazo 15 días"`
- `/bettercallclaude-espana:legal-5step --skip-adversarial "Contrato de arrendamiento de local comercial en Barcelona, 5 años, renta 3.000 EUR/mes"`
- `/bettercallclaude-espana:legal-5step "Recurso de casación por infracción del Art. 217 LEC, SAP Madrid Sección 15ª 456/2022"`

$ARGUMENTS
