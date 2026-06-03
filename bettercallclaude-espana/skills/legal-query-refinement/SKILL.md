---
name: legal-query-refinement
description: "Socratic dialogue to refine vague legal queries into actionable research tasks. Triggered when a user's query is underspecified, ambiguous, or lacks essential context for Spanish legal analysis. Identifies missing information and reformulates queries with proper Spanish legal terminology."
---

# Legal Query Refinement

## Objective
Transform vague or underspecified legal queries into precise, actionable research tasks through a Socratic dialogue. Identify missing information and reformulate the query using proper Spanish legal terminology.

## Trigger Conditions
Activate when the user query lacks any of the following:
- Jurisdiction (state vs. CCAA)
- Legal domain (civil, penal, mercantil, laboral, administrativo, constitucional)
- Party position (claimant / defendant / third party)
- Relief sought (condena, declaración, medida cautelar)
- Factual context (timeline, amounts, parties)
- Output type (research memo, contract, court submission, opinion)

## Socratic Dialogue Protocol

### Round 1: Jurisdiction
**Question:** ¿Se trata de una cuestión de derecho estatal o autonómico? ¿Hay alguna Comunidad Autónoma específica involucrada?
**Purpose:** Determine if state law (CC, CP, LEC) or CCAA law (foral systems: PV, NC, GA) applies.

### Round 2: Legal Domain
**Question:** ¿En qué área del derecho se enmarca su consulta? (civil, penal, mercantil, laboral, administrativo, constitucional)
**Purpose:** Route to the correct legal framework and procedural rules.

### Round 3: Party Position
**Question:** ¿Cuál es su posición en el asunto? ¿Actúa como demandante, demandado, o tercero?
**Purpose:** Frame the analysis from the correct perspective (offensive vs. defensive strategy).

### Round 4: Relief Sought
**Question:** ¿Qué resultado busca? (condena económica, declaración de derechos, medida cautelar, resolución de contrato, etc.)
**Purpose:** Identify the applicable procedural pathway and legal remedies.

### Round 5: Factual Context
**Question:** ¿Puede proporcionar los hechos relevantes? (fechas, montos, partes, contratos, documentos)
**Purpose:** Ground the legal analysis in concrete facts.

### Round 6: Output Type
**Question:** ¿Qué tipo de respuesta necesita? (informe jurídico, borrador de contrato, escrito judicial, análisis de estrategia)
**Purpose:** Determine the format and depth of the output.

## Query Reformulation
After gathering information, reformulate the query into a structured legal research task:

### Structured Query Format
```
# Refined Legal Query
**Original query:** [User's original question]
**Date refined:** [YYYY-MM-DD]

## 1. Jurisdiction
- **Level:** [Estatal / Autonómico / Mixto]
- **CCAA:** [Name / None]
- **Foral law:** [Applicable / Not applicable]

## 2. Legal Domain
- **Primary:** [Civil / Penal / Mercantil / Laboral / Administrativo / Constitucional]
- **Sub-domain:** [Contracts / Property / Family / Corporate / etc.]

## 3. Party Position
- **Role:** [Demandante / Demandado / Tercero / Neutral]
- **Interests:** [Summary of party's objectives]

## 4. Relief Sought
- **Primary:** [Condena / Declaración / Medida cautelar / etc.]
- **Secondary:** [Alternative relief]
- **Amount:** [EUR / Not applicable]

## 5. Factual Summary
- **Timeline:** [Key dates]
- **Parties:** [Names / roles]
- **Documents:** [List of relevant documents]
- **Dispute:** [Core factual conflict]

## 6. Output Requirements
- **Type:** [Informe / Contrato / Escrito / Estrategia]
- **Language:** [ES / EN / Bilingual]
- **Urgency:** [Immediate / Standard / Low priority]
- **Depth:** [Preliminary / Detailed / Exhaustive]

## 7. Suggested Workflow
1. [Step 1: e.g., legal research on Art. X CC]
2. [Step 2: e.g., case law search for STS on point]
3. [Step 3: e.g., document drafting]
4. [Step 4: e.g., adversarial analysis]
```

## Optimal Workflow Suggestions
Based on the refined query, suggest the most efficient sequence of skills:

| Query Type | Suggested Workflow |
|-----------|-------------------|
| General legal question | `spanish-legal-research` |
| Contract review | `spanish-document-analysis` → `spanish-legal-drafting` |
| Litigation planning | `legal-query-refinement` → `spanish-legal-research` → `spanish-legal-strategy` |
| Complex dispute | `legal-briefing` → `spanish-legal-research` → `adversarial-analysis` → `spanish-legal-drafting` |
| Cross-border matter | `spanish-legal-research` → `spanish-legal-translation` → `spanish-legal-drafting` |
| Compliance review | `spanish-document-analysis` → `compliance-frameworks` → `data-protection-law` |

## Output Format
```
# Query Refinement Report
**Date:** [YYYY-MM-DD]

## Refined Query
[Structured query as above]

## Missing Information Identified
- [List of items the user did not initially provide]

## Suggested Next Steps
1. [Workflow step 1]
2. [Workflow step 2]
3. [Workflow step 3]

## Recommended Skills
- [List of skills to invoke]
```
