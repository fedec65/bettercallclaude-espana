---
description: "Consolidate multi-agent pipeline output — deduplicate, control length (--short/--medium/--long)."
---

# summarize — Output Summarization

Consolidate and summarize multi-agent pipeline output. Deduplicate findings, control length, and produce a unified deliverable.

## Scope Constraint
Use exclusively BetterCallClaude España agents, skills, and MCP servers.

## Procedure
1. **Ingest**: Collect outputs from all agents in the pipeline.
2. **Deduplicate**: Merge overlapping findings, reconcile conflicting recommendations, and eliminate redundancy.
3. **Prioritize**: Rank findings by relevance, urgency, and legal impact.
4. **Summarize** based on length flag:
   - `--short`: 1-2 paragraph executive summary with top 3 action items.
   - `--medium` (default): Structured summary with sections, key findings, and recommendations.
   - `--long`: Comprehensive consolidation with full reasoning, citations, and detailed action plan.
5. **Citations**: Preserve all legal citations (Art., STS, SAP, STC, BOE) in the summary.

## Output Formats
- Executive summary
- Key findings (bullet points)
- Recommendations (prioritized)
- Next steps / action items
- Full reasoning (long mode only)

## Skills Used
- output-summarization
- spanish-citation-formats

## Examples
- `/bettercallclaude-espana:summarize --short "[paste multi-agent output]"`
- `/bettercallclaude-espana:summarize --long "Consolidar resultados de due diligence de empresa en Madrid"`
- `/bettercallclaude-espana:summarize --medium "Resumir análisis adversarial sobre demanda por cláusula suelo"`

$ARGUMENTS
