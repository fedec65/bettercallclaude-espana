---
description: "Show complete command reference, available agents, skills, MCP servers, usage examples."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
---

# help — Command Reference & Help

Display the complete command reference for BetterCallClaude España, including available agents, skills, MCP servers, and usage examples.

## Scope
This command operates on the plugin's documentation layer.

## Information Displayed

### Commands
List all 29 commands with description and example:
- `legal` — Gateway & intent routing (e.g. `/bettercallclaude-espana:legal`)
- `research` — Search Spanish legal precedents and compile research memoranda (e.g. `/bettercallclaude-espana:research "responsabilidad extracontractual"`)
- `strategy` — Develop litigation strategy under LEC with risk/cost assessment (e.g. `/bettercallclaude-espana:strategy`)
- `draft` — Draft Spanish legal documents: contracts, court submissions, opinions (e.g. `/bettercallclaude-espana:draft demanda`)
- `cite` — Verify and format Spanish legal citations (STS, SAP, STC, BOE)
- `validate` — Bulk citation validation
- `precedent` — Search and analyze STS/SAP/STC precedents with chain tracking
- `federal` — Analyze a legal question under Spanish state law (Derecho estatal)
- `autonomic` — Analyze a legal question under autonomic law for a specific CCAA
- `adversarial` — Three-agent adversarial analysis: advocate / adversary / judicial
- `briefing` — Structured pre-execution briefing — assembles specialist panel
- `workflow` — Multi-agent legal workflows: due diligence, litigation prep, contract lifecycle
- `translate` — Translate Spanish legal documents between ES and EN
- `doc-analyze` — Analyze Spanish legal documents — issues, clauses, citations, compliance
- `summarize` — Consolidate multi-agent pipeline output with length control
- `setup` — Check MCP server connectivity and display status
- `version` — Display plugin version and system status
- `legal-5step` — Execute the 5-step end-to-end framework: intake → research → strategy → adversarial → draft
- `privacy` — View or change privacy mode (strict/balanced/cloud)
- `help` — This command
- `refine` — Transform vague legal queries through Socratic dialogue
- `mapa-legal` — Traza un mapa decisional wayfinder de una práctica legal grande
- `percurso-legal` — Trabaja un ticket de un mapa decisional legal-wayfinder
- `cronologia-legal` — Construye una cronología legal documentada con fuente obligatoria
- `bucle-legal` — Ejecuta un ciclo worker-evaluador contra un Goal Record
- `objetivo-legal` — Define una condición de éxito legal verificable (Goal Record)
- `doctor` — Diagnóstico de servidores MCP, estado e impacto
- `start` — Bienvenida y onboarding — verifica MCP, guía playbook local
- `triage-nda` — Triage de NDA según el derecho español (GREEN/YELLOW/RED)

### Agents
- @spanish-adversary
- @spanish-advocate
- @autonomic-law-expert
- @spanish-briefing-coordinator
- @chronology-builder
- @spanish-citation-expert
- @spanish-compliance-expert
- @spanish-corporate-expert
- @spanish-data-protection-expert
- @spanish-legal-drafter
- @spanish-fiscal-expert
- @spanish-judicial-analyst
- @spanish-orchestrator
- @spanish-procedure-expert
- @spanish-prompt-engineer
- @spanish-realestate-expert
- @spanish-legal-researcher
- @spanish-risk-analyst
- @spanish-litigation-strategist
- @spanish-summarizer
- @spanish-legal-translator

### Skills
- spanish-legal-research
- spanish-citation-formats
- spanish-jurisdictions
- spanish-legal-drafting
- spanish-legal-strategy
- spanish-legal-translation
- spanish-document-analysis
- legal-query-refinement
- legal-briefing
- adversarial-analysis
- output-summarization
- compliance-frameworks
- data-protection-law
- privacy-routing
- legal-5step-framework
- legal-chronology
- legal-wayfinder
- legal-intake
- legal-evaluator
- citation-content-verify
- shared

### MCP Servers
List of configured MCP servers with status.

### Usage Examples
Provide 5-7 representative examples covering different command types.

## Examples
- `/bettercallclaude-espana:help`
- `/bettercallclaude-espana:help --commands`
- `/bettercallclaude-espana:help --agents`
- `/bettercallclaude-espana:help --skills`

$ARGUMENTS
