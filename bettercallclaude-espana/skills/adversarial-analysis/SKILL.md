---
name: adversarial-analysis
description: "Three-agent adversarial methodology to stress-test legal positions under Spanish law. Triggered when evaluating the strength of a legal argument, preparing for litigation, or assessing risks. Uses advocate → adversary → judicial analyst roles with probability scoring for each argument. Outputs strengths, weaknesses, and synthesis."
---

# Adversarial Analysis

## Objective
Stress-test any legal position under Spanish law through a structured three-agent adversarial methodology. Provide probability scoring for each argument and synthesize a balanced assessment of strengths and weaknesses.

## Three-Agent Methodology

### Agent 1: Advocate (Abogado Demandante)
**Role:** Present the strongest possible case for the user's legal position.
**Tasks:**
- Identify all favorable statutes (CC, CP, LEC, etc.)
- Cite the most supportive STS and SAP
- Apply teleological and systematic interpretation
- Anticipate and preempt counterarguments
- Frame facts in the most favorable light
- Argue for the broadest application of favorable precedents

### Agent 2: Adversary (Abogado Demandado)
**Role:** Attack the user's legal position with maximum force.
**Tasks:**
- Identify all weaknesses in the legal argument
- Distinguish unfavorable STS and SAP
- Argue for narrow or alternative interpretation
- Highlight factual differences from favorable precedents
- Invoke mandatory law (Art. 6 CC) against the position
- Raise procedural objections (competencia, prescripción, caducidad)
- Challenge evidence sufficiency under LEC standards

### Agent 3: Judicial Analyst (Analista Judicial)
**Role:** Adopt the perspective of a Spanish judge (TS or AP).
**Tasks:**
- Evaluate arguments under Spanish judicial reasoning
- Apply ratio decidendi from relevant STS
- Consider doctrinal consensus
- Assess evidence sufficiency under LEC
- Apply interpretation methods (grammatical, systematic, teleological, historical)
- Consider practical implications of each outcome
- Render a preliminary assessment with probability

## Probability Scoring

### Scoring Framework
For each argument, assign a probability (0–100%):

| Score | Interpretation |
|-------|----------------|
| 90–100% | Near-certain success |
| 70–89% | Strong likelihood |
| 50–69% | Reasonable chance |
| 30–49% | Weak but arguable |
| 10–29% | Unlikely |
| 0–9% | Virtually no chance |

**Scoring criteria:**
- Strength of statutory text
- Supportive precedent weight (STS > SAP > Doctrine)
- Factual alignment with precedents
- Evidence quality under LEC
- Procedural posture
- Judicial trends in relevant AP

## Fundamentos de Derecho Synthesis

After adversarial exchange, synthesize a balanced *Fundamentos de Derecho* section:
1. **Hechos probados** — Facts established by evidence
2. **Primera: Derecho aplicable** — Applicable law with citations
3. **Segunda: Análisis de la doctrina jurisprudencial** — Case law analysis
4. **Tercera: Interpretación** — Application of interpretation methods
5. **Cuarta: Valoración de la prueba** — Evidence assessment
6. **Quinta: Conclusión** — Final legal reasoning

## Output Format
```
# Adversarial Analysis Report
**Matter:** [Subject]
**Position tested:** [User's legal position]
**Jurisdiction:** [State / CCAA]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This analysis simulates adversarial positions. Actual outcomes depend on the specific tribunal and evidence. Consult a Spanish abogado colegiado.

## 1. Advocate Position
### Arguments
1. [Argument with citation]
2. [Argument with citation]
3. [Argument with citation]

### Supporting Precedents
- [STS / SAP with ratio decidendi]

### Probability Assessment: [X]%

## 2. Adversary Position
### Counterarguments
1. [Counterargument with citation]
2. [Counterargument with citation]
3. [Counterargument with citation]

### Distinguishing Precedents
- [STS / SAP distinguishing facts]

### Probability Assessment: [X]%

## 3. Judicial Analyst Assessment
### Key Considerations
- [Judicial reasoning analysis]

### Precedent Alignment
- [How current case aligns with relevant STS]

### Evidence Sufficiency
- [Assessment under LEC standards]

### Preliminary Probability: [X]%

## 4. Synthesis — Fundamentos de Derecho
### Hechos probados
- [Established facts]

### Primera: Derecho aplicable
- [Statutory framework]

### Segunda: Doctrina jurisprudencial
- [Case law synthesis]

### Tercera: Interpretación
- [Interpretation conclusion]

### Cuarta: Valoración de la prueba
- [Evidence assessment]

### Quinta: Conclusión
- [Balanced legal conclusion]

## 5. Risk Matrix
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| [Risk] | [High/Med/Low] | [High/Med/Low] | [Strategy] |

## 6. Recommendations
1. [Strategic recommendation]
2. [Evidence improvement]
3. [Procedural consideration]
```
