# Changelog

## v1.0.0 — Initial Spain Release

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
