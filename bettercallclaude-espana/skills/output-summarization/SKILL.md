---
name: output-summarization
description: "Consolidate and summarize output from multi-agent pipelines in the BetterCallClaude España plugin. Triggered as the terminal step after multi-agent execution. Deduplicates disclaimers, terminology, and citations. Supports --short, --medium, and --long length control. Provides bilingual summarization (ES/EN). This is a terminal step — no further menu is offered."
---

# Output Summarization

## Objective
Consolidate output from multi-agent pipelines into a clean, coherent final deliverable. Deduplicate repeated content, normalize terminology, verify citations, and produce the summary in the requested length and language.

## Trigger Conditions
- Called as the final step after `legal-briefing`, `adversarial-analysis`, `legal-5step-framework`, or any multi-agent pipeline
- User requests a summary of prior output
- Pipeline produces redundant or overlapping content from multiple agents

## Length Control

### --short (Executive Summary)
- **Length:** 150–300 words
- **Content:** Key conclusions, top 3–5 recommendations, critical risks only
- **Audience:** Decision-makers needing rapid orientation
- **Language:** Single paragraph or bullet points

### --medium (Standard Summary)
- **Length:** 500–800 words
- **Content:** Key findings, reasoning summary, recommendations, risk overview
- **Audience:** Legal professionals needing balanced detail
- **Language:** Structured sections with headings

### --long (Comprehensive Summary)
- **Length:** 1,200–2,000 words
- **Content:** Full synthesis of all agent outputs, detailed reasoning, complete recommendations, all risks and mitigations
- **Audience:** Detailed review by counsel or for filing preparation
- **Language:** Full sections with subsections

## Deduplication Protocol

### Disclaimers
- Retain **one** professional disclaimer at the top or bottom
- Remove redundant disclaimers from individual agent outputs
- Standardize disclaimer language

### Terminology
- Normalize inconsistent translations (e.g., "demanda" always as "claim" or "complaint" consistently)
- Standardize statute abbreviations (always "Art. 1255 CC", never mixed formats)
- Unify court name references (always "Tribunal Supremo (TS)")

### Citations
- Merge overlapping citation lists
- Remove duplicates while preserving all unique sources
- Verify final citation list via `legal-citations-esp` MCP where available
- Sort citations by source hierarchy (STS > AP > Doctrine > Legislative)

## Bilingual Summarization (ES/EN)

### Spanish Output
- Use formal legal register (formalismo jurídico)
- Retain Spanish legal terminology (responsabilidad, incumplimiento, resolución)
- Structure: Resumen ejecutivo, Hallazgos, Conclusiones, Recomendaciones

### English Output
- Use formal legal English register
- Provide Spanish terms in parentheses on first use
- Structure: Executive Summary, Findings, Conclusions, Recommendations

### Bilingual Output
- Provide both ES and EN versions
- Align paragraph structure for cross-reference
- Use consistent terminology mapping

## Summarization Steps
1. **Ingest** all agent outputs
2. **Identify** core conclusions and recommendations
3. **Deduplicate** disclaimers, terms, and citations
4. **Synthesize** reasoning into coherent narrative
5. **Verify** key citations
6. **Format** according to length control
7. **Translate** if bilingual output requested
8. **Add** single standardized disclaimer

## Quality Standards
- [ ] All agent conclusions represented (no omission)
- [ ] No internal contradictions unresolved
- [ ] Disclaimers deduplicated to one instance
- [ ] Terminology consistent throughout
- [ ] Citations merged and deduplicated
- [ ] Length within specified bounds
- [ ] Language matches user request
- [ ] Terminal — no further menu or action suggested

## Output Format
```
# Summary — [Matter Title]
**Date:** [YYYY-MM-DD]
**Length:** [Short / Medium / Long]
**Language:** [ES / EN / Bilingual]
**Disclaimer:** This summary consolidates multi-agent analysis for informational purposes. It does not constitute legal advice. Consult a Spanish abogado colegiado for definitive guidance.

## [Executive Summary / Resumen Ejecutivo]
[Concise overview]

## [Key Findings / Hallazgos Principales]
- [Finding 1]
- [Finding 2]
- [Finding 3]

## [Analysis / Análisis]
[Synthesized reasoning]

## [Recommendations / Recomendaciones]
1. [Recommendation]
2. [Recommendation]
3. [Recommendation]

## [Risk Overview / Visión General de Riesgos]
- [Risk summary]

## [Consolidated Citations / Citaciones Consolidadas]
- [Deduplicated, verified citation list]
```

## Terminal Step
This skill is a **terminal step**. After outputting the summary:
- Do not offer a menu
- Do not suggest additional skills
- Do not ask follow-up questions unless the user initiates
- End with the standardized disclaimer
