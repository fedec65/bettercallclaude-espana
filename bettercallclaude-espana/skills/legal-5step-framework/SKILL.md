---
name: legal-5step-framework
description: "End-to-end 5-step legal pipeline for Spanish law: intake → research → strategy → adversarial → draft. Coordinates the full workflow, enforces data flow between agents, implements quality gates, provides progress reporting, and offers a post-execution framework menu. Triggered for comprehensive legal matters requiring multi-phase analysis."
---

# Legal 5-Step Framework

## Objective
Coordinate an end-to-end legal analysis pipeline for Spanish law across five phases: intake, research, strategy, adversarial testing, and drafting. Enforce data flow between agents, implement quality gates, and provide progress reporting.

## Pipeline Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Step 1    │ ──► │   Step 2    │ ──► │   Step 3    │ ──► │   Step 4    │ ──► │   Step 5    │
│   Intake    │     │  Research   │     │  Strategy   │     │ Adversarial │     │   Draft     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                   │                   │
      ▼                   ▼                   ▼                   ▼                   ▼
  legal-briefing    spanish-legal-    spanish-legal-    adversarial-      spanish-legal-
                    research          strategy          analysis          drafting
```

## Step 1: Intake
**Skill:** `legal-briefing`
**Tasks:**
- Assemble specialist panel (3–5 agents)
- Conduct adaptive questioning (5 rounds)
- Assign complexity score (1–10)
- Build execution plan
- Establish cross-session persistence

**Output:** Briefing report with panel, plan, and complexity score
**Quality Gate:**
- [ ] Matter clearly defined
- [ ] Jurisdiction identified (state vs. CCAA)
- [ ] Panel assembled with appropriate skills
- [ ] Complexity score assigned
- [ ] Execution plan approved

## Step 2: Research
**Skill:** `spanish-legal-research`
**Tasks:**
- Search legislation (BOE, CCAA gazettes)
- Search case law (STS, SAP, STC)
- Review doctrine and commentary
- Analyze precedents (ratio decidendi, distinguishing facts)
- Apply interpretation methods
- Verify citations via `legal-citations-esp`

**Input from Step 1:** Matter definition, legal domain, jurisdiction, factual summary
**Output:** Legal research memorandum with verified citations
**Quality Gate:**
- [ ] At least one STS or STC cited per core proposition
- [ ] All statute citations verified
- [ ] CCAA law identified where applicable
- [ ] Doctrinal support noted
- [ ] Citation accuracy >95%
- [ ] Source hierarchy respected (STS > AP > Doctrine > Legislative)

## Step 3: Strategy
**Skill:** `spanish-legal-strategy`
**Tasks:**
- Select procedural pathway (ordinario, verbal, monitorio, etc.)
- Analyze forum selection
- Estimate timelines
- Assess costs (tasación de costas)
- Design appeal strategy (apelación, casación, amparo)
- Build risk matrix

**Input from Step 2:** Legal propositions, applicable statutes, precedents
**Output:** Strategy memorandum with procedural plan and risk assessment
**Quality Gate:**
- [ ] Procedural pathway justified by amount and complexity
- [ ] Forum selected with strategic rationale
- [ ] Timeline estimates realistic
- [ ] Cost analysis complete
- [ ] Appeal options mapped
- [ ] Risk matrix scored

## Step 4: Adversarial Analysis
**Skill:** `adversarial-analysis`
**Tasks:**
- Advocate: Present strongest case for user's position
- Adversary: Attack position with maximum force
- Judicial analyst: Render balanced assessment
- Probability scoring for each argument
- Synthesize Fundamentos de Derecho

**Input from Step 3:** Procedural plan, legal propositions, risk assessment
**Output:** Adversarial report with strengths, weaknesses, and synthesis
**Quality Gate:**
- [ ] Advocate position fully developed
- [ ] Adversary position identifies all weaknesses
- [ ] Judicial analyst provides balanced view
- [ ] Probability scores assigned
- [ ] Fundamentos de Derecho synthesized
- [ ] Risk matrix updated

## Step 5: Draft
**Skill:** `spanish-legal-drafting`
**Tasks:**
- Draft required documents (contract, court submission, opinion)
- Integrate research findings and citations
- Apply strategy decisions
- Address adversarial weaknesses
- Ensure mandatory law compliance (Art. 6 CC, Art. 1255 CC, Art. 1101 CC)
- Format per jurisdiction and court requirements

**Input from Step 4:** Synthesized legal position, risk mitigations, strategic decisions
**Output:** Final drafted document(s)
**Quality Gate:**
- [ ] Document structure follows Spanish conventions
- [ ] All mandatory law provisions cited
- [ ] Citations integrated and verified
- [ ] Court-specific formatting applied
- [ ] CCAA provisions included where applicable
- [ ] Disclaimer included

## Data Flow Between Agents

### Intake → Research
- Matter definition
- Jurisdiction
- Legal domain
- Factual summary
- Output requirements

### Research → Strategy
- Applicable legislation
- Case law findings
- Doctrinal position
- Interpretation conclusions
- Verified citations

### Strategy → Adversarial
- Procedural pathway
- Forum selection
- Timeline constraints
- Cost parameters
- Risk matrix

### Adversarial → Draft
- Synthesized legal position
- Strengths to emphasize
- Weaknesses to address
- Probability assessments
- Risk mitigations

## Progress Reporting

### During Execution
```
# Progress Report
**Matter:** [Subject]
**Current step:** [Step X/5]
**Skill active:** [Skill name]
**Status:** [In progress / Complete / Blocked]
**Completion:** [X]%

## Completed Steps
- [Step 1]: [Status] — [Key output summary]
- [Step 2]: [Status] — [Key output summary]

## Current Step
- **Skill:** [Name]
- **Task:** [Current task]
- **Input from prior step:** [Summary]

## Next Steps
- [Step X+1]: [Planned tasks]
```

### Final Report
```
# 5-Step Framework — Final Report
**Matter:** [Subject]
**Date completed:** [YYYY-MM-DD]
**Complexity:** [Score]/10
**Disclaimer:** This analysis is for informational purposes. Execution requires a Spanish abogado colegiado.

## Step 1: Intake
[Summary]

## Step 2: Research
[Summary with key citations]

## Step 3: Strategy
[Summary with procedural plan]

## Step 4: Adversarial Analysis
[Summary with probability scores]

## Step 5: Draft
[Document summary or full text]

## Consolidated Recommendations
1. [Recommendation]
2. [Recommendation]
3. [Recommendation]
```

## Post-Execution Framework Menu
After completing the 5-step pipeline, offer:

```
## Framework Menu — What would you like to do next?

1. **Summarize output** → Invoke `output-summarization` (--short / --medium / --long)
2. **Translate documents** → Invoke `spanish-legal-translation` (ES ↔ EN)
3. **Verify citations** → Invoke `spanish-citation-formats` (batch verification)
4. **Analyze documents** → Invoke `spanish-document-analysis` (compliance check)
5. **Refine query** → Invoke `legal-query-refinement` (new angle)
6. **Export for counsel** → Format all outputs for abogado colegiado review
7. **Start new matter** → Begin new 5-step framework
```

## Quality Gates Summary
| Step | Skill | Gate Criteria |
|------|-------|--------------|
| 1 | `legal-briefing` | Matter defined, panel assembled, plan approved |
| 2 | `spanish-legal-research` | STS cited, citations >95%, CCAA identified |
| 3 | `spanish-legal-strategy` | Pathway justified, forum selected, risk scored |
| 4 | `adversarial-analysis` | All positions developed, probabilities assigned |
| 5 | `spanish-legal-drafting` | Mandatory law cited, formatting correct |

## Reduced Mode
If MCP servers are unavailable:
- Proceed with training-knowledge citations
- Flag all unverified citations with `[UNVERIFIED]`
- Reduce confidence levels
- Advise manual verification via BOE, CENDOJ, TC
