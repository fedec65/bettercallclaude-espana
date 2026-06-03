# BetterCallClaude España — Agent Architecture

## Overview

BetterCallClaude España uses a multi-agent architecture with 20 specialist agents organized into functional layers. The architecture mirrors the Swiss plugin but is fully adapted to Spanish law, courts, and legal databases.

## Agent Topology

### Layer 1: Gateway & Coordination

| Agent | Name | Role |
|-------|------|------|
| Orchestrator | `spanish-orchestrator` | Routes queries, manages workflows, coordinates agents |
| Briefing Coordinator | `spanish-briefing-coordinator` | Pre-execution intake, specialist panel assembly |
| Prompt Engineer | `spanish-prompt-engineer` | Query refinement, Socratic dialogue |
| Summarizer | `spanish-summarizer` | Output consolidation, deduplication |

### Layer 2: Core Legal Specialists

| Agent | Name | Domain |
|-------|------|--------|
| Researcher | `spanish-legal-researcher` | TS/STS/AP/TC jurisprudence, BOE legislation |
| Drafter | `spanish-legal-drafter` | Contracts, court submissions, opinions |
| Strategist | `spanish-litigation-strategist` | Litigation strategy, risk assessment |
| Citation Expert | `spanish-citation-expert` | Citation verification and formatting |
| Procedure Expert | `spanish-procedure-expert` | LEC/LECr deadlines, procedural rules |
| Autonomic Expert | `autonomic-law-expert` | 17 CCAA law, court systems, foral systems |

### Layer 3: Domain Specialists

| Agent | Name | Domain |
|-------|------|--------|
| Compliance Expert | `spanish-compliance-expert` | CNMV, BdE, SEPBLAC, AML |
| Corporate Expert | `spanish-corporate-expert` | SL, SA, M&A, LSC |
| Fiscal Expert | `spanish-fiscal-expert` | IRPF, IS, IVA, AEAT |
| Data Protection Expert | `spanish-data-protection-expert` | LOPDGDD, GDPR, AEPD |
| Real Estate Expert | `spanish-realestate-expert` | LRSC, LAU, urbanismo |
| Translator | `spanish-legal-translator` | ES ↔ EN legal terminology |

### Layer 4: Analysis & Adversarial

| Agent | Name | Role |
|-------|------|------|
| Risk Analyst | `spanish-risk-analyst` | Case probability, damages quantification |
| Judicial Analyst | `spanish-judicial-analyst` | Synthesis, *Fundamentos de Derecho* analysis |
| Advocate | `spanish-advocate` | Case building, Spanish abogado argumentation |
| Adversary | `spanish-adversary` | Challenge positions, procedural objections |

## Routing Rules

### Direct Agent Routing

Users can route directly to any agent with `@agent_name`:

- `@spanish-legal-researcher` — Legal research and TS/STS/AP search
- `@spanish-litigation-strategist` — Litigation strategy and risk assessment
- `@spanish-legal-drafter` — Legal document generation
- `@spanish-citation-expert` — Citation verification and formatting
- `@spanish-compliance-expert` — CNMV, BdE, SEPBLAC regulatory checks
- `@spanish-risk-analyst` — Case probability and damages quantification
- `@spanish-procedure-expert` — LEC/LECr deadlines and procedural rules
- `@spanish-legal-translator` — ES ↔ EN legal terminology
- `@spanish-fiscal-expert` — Tax law and double taxation treaties
- `@spanish-corporate-expert` — SL/SA, M&A, commercial contracts
- `@autonomic-law-expert` — All 17 CCAA legal systems
- `@spanish-realestate-expert` — Property law, LRSC, LAU
- `@spanish-data-protection-expert` — LOPDGDD/GDPR, AEPD guidance

### Workflow Pipelines

Complex queries trigger predefined multi-agent pipelines:

| Workflow | Pipeline |
|----------|----------|
| `due-diligence` | researcher → compliance → corporate → risk → drafter (report) |
| `litigation-prep` | researcher → strategist → risk → drafter (demanda) |
| `contract-lifecycle` | researcher → drafter → compliance → citation (verification) |
| `full` | researcher → strategist → drafter (complete analysis to document) |
| `real-estate-closing` | realestate → fiscal → drafter → citation (verification) |
| `compliance-check` | compliance → data-protection → risk → drafter (compliance report) |
| `cross-border-ma` | parallel[corporate, fiscal, compliance] → risk → drafter (M&A memo) |
| `adversarial-review` | advocate → adversary → judicial (stress-test any position) |

## Data Flow

```
User Query
    ↓
Orchestrator (intent classification, complexity scoring)
    ↓
Briefing? (complexity 4-6: inline; 7+: full briefing session)
    ↓
Agent Routing (single agent or workflow pipeline)
    ↓
Agent Execution (with MCP server access)
    ↓
Quality Gate (citation verification, mandatory law check)
    ↓
Output Delivery (with professional disclaimer)
    ↓
Framework Menu (options 3-5 for continuation)
```

## Quality Standards

- Citation accuracy >95% for all TS/STS/AP references
- Never fabricate citations or case numbers
- Always include professional disclaimer
- Flag uncertainties and information gaps explicitly
- Respect *secreto profesional*: never store confidential client data
- Plugin scope enforcement: use exclusively BetterCallClaude España agents, skills, and MCP servers

## MCP Server Integration

Each agent references specific MCP servers:

| Agent | Primary MCP Servers |
|-------|-------------------|
| Researcher | cendoj-jurisprudencia, boe-legislacion, legal-persona-esp, tribunal-constitucional, doctrina-academica |
| Drafter | legal-citations-esp, boe-legislacion, legal-persona-esp |
| Strategist | cendoj-jurisprudencia, legal-persona-esp, congreso-debates |
| Citation Expert | legal-citations |
| Autonomic Expert | cendoj-jurisprudencia, boe-legislacion, catalunya-legal |
| Compliance | legal-persona-esp, boe-legislacion, eu-law-esp |
| Corporate | legal-persona-esp, boe-legislacion |
| Fiscal | legal-persona-esp, boe-legislacion |
| Data Protection | legal-persona-esp, boe-legislacion, eu-law-esp |
| Real Estate | legal-persona-esp, boe-legislacion, catalunya-legal |
| Translator | ollama (local) |
| Risk | cendoj-jurisprudencia, legal-persona-esp |
| Judicial | cendoj-jurisprudencia, tribunal-constitucional, doctrina-academica |
| Advocate | cendoj-jurisprudencia, tribunal-constitucional, doctrina-academica |
| Adversary | cendoj-jurisprudencia, tribunal-constitucional, doctrina-academica |

## Privacy

All agents operate under the plugin's privacy framework:
- `PreToolUse` hook scans all outgoing tool calls for privilege indicators
- Ollama (local) is exempt from all privacy checks
- User-configurable modes: strict, balanced, cloud
