---
description: "Análisis adversarial de tres agentes: el abogado construye el caso, el adversario lo impugna, el analista judicial sintetiza."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
---

# analisis-adversarial — Adversarial Legal Analysis

Execute a three-agent adversarial analysis: an advocate builds the case, an adversary challenges it, and a judicial analyst synthesizes the findings.

## Scope Constraint
Use exclusively BetterCallClaude España agents, skills, and MCP servers.

## Agents
- **Advocate** (@spanish-litigation-strategist): Builds the strongest possible case for the client's position using Spanish law (CC, CP, LEC, CE, CCAA statutes), precedents (STS, SAP, STC), and doctrine.
- **Adversary** (@spanish-risk-analyst): Identifies weaknesses, counterarguments, procedural risks, and opposing precedents. Stress-tests every argument.
- **Judicial Analyst** (@spanish-procedure-expert): Synthesizes both positions, applies the burden of proof, evaluates evidentiary strength, and renders a balanced assessment of likely judicial outcomes.

## Procedure
1. **Advocate Phase**: Present legal basis, factual theory, requested relief, and supporting precedents.
2. **Adversary Phase**: Challenge each argument with counter-precedents, procedural objections, and alternative interpretations.
3. **Synthesis Phase**: The judicial analyst weighs both sides, identifies decisive issues, and estimates the probability of success.

## Output
- Advocate's brief
- Adversary's response
- Judicial synthesis with probability assessment and recommended next steps

## Skills Used
- adversarial-analysis
- spanish-legal-strategy
- spanish-legal-research
- spanish-citation-formats
- spanish-jurisdictions

## Examples
- `/bettercallclaude-espana:analisis-adversarial "Demanda por despido improcedido: la empresa alega falta de adaptación por causas organizativas, Art. 52.c ET"`
- `/bettercallclaude-espana:analisis-adversarial "Recurso de casación por infracción del Art. 1255 CC en interpretación de contrato de distribución"`
- `/bettercallclaude-espana:analisis-adversarial "Defensa en causa penal por presunto delito de alzamiento de bienes, Art. 257 CP"`

$ARGUMENTS
