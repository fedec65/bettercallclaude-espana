---
name: legal-briefing
description: "Pre-execution intake coordination for complex Spanish legal matters. Triggered before multi-agent execution on complex disputes, transactions, or compliance reviews. Assembles a specialist panel of 3-5 agents, conducts adaptive questioning, builds an execution plan, and assigns a complexity score (1-10). Supports cross-session persistence."
---

# Legal Briefing

## Objective
Coordinate pre-execution intake for complex Spanish legal matters. Assemble a specialist panel, conduct adaptive questioning, build a comprehensive execution plan, and assign a complexity score.

## Trigger Conditions
Activate for:
- Multi-jurisdictional disputes (state + CCAA)
- High-stakes litigation (amount > EUR 100,000)
- Corporate transactions (M&A, restructuring)
- Regulatory investigations (CNMV, BdE, SEPBLAC, AEPD)
- Complex contractual frameworks
- Appeals to TS or TC
- Cross-border matters with Spanish element

## Specialist Panel Assembly

### Panel Composition (3–5 Agents)
| Role | Skill | Responsibility |
|------|-------|----------------|
| **Lead researcher** | `spanish-legal-research` | Core legal research, legislation, case law |
| **Strategist** | `spanish-legal-strategy` | Procedural pathway, timeline, cost analysis |
| **Document specialist** | `spanish-legal-drafting` | Draft contracts, court submissions, opinions |
| **Jurisdiction analyst** | `spanish-jurisdictions` | CCAA law, foral systems, forum selection |
| **Compliance analyst** | `compliance-frameworks` | Regulatory compliance, CNMV/BdE/SEPBLAC/AEPD |
| **Data protection specialist** | `data-protection-law` | LOPDGDD, GDPR, AEPD matters |
| **Adversarial analyst** | `adversarial-analysis` | Stress-test legal positions |
| **Translator** | `spanish-legal-translation` | ES ↔ EN documentation |

**Selection criteria:**
- Minimum 3 agents; maximum 5
- Include `spanish-legal-research` in all panels
- Include `spanish-legal-strategy` for litigation matters
- Include `compliance-frameworks` for regulatory matters
- Include `data-protection-law` for data/privacy matters

## Adaptive Questioning Rounds

### Round 1: Matter Identification
- What is the legal issue? (civil, penal, mercantil, laboral, administrativo, constitucional)
- What is the approximate amount in dispute?
- Which parties are involved?
- Is there a pending proceeding? (Juzgado, AP, TS, TC)

### Round 2: Jurisdiction & Forum
- Which CCAA is involved?
- Does foral law apply? (PV, NC, GA)
- Are co-official languages relevant? (CT, PV, GA, IB, VC)
- Is there a forum selection clause?

### Round 3: Evidence & Documents
- What documents exist? (contracts, emails, invoices, court filings)
- Are there expert reports?
- What is the status of evidence gathering?
- Are there statute of limitations (prescripción / caducidad) concerns?

### Round 4: Strategic Objectives
- What is the desired outcome?
- Is settlement an option?
- What is the budget for legal costs?
- What is the timeline sensitivity?

### Round 5: Regulatory & Compliance
- Are regulators involved? (CNMV, BdE, SEPBLAC, AEPD)
- Are there data protection issues?
- Are there sector-specific compliance requirements?
- Are there cross-border elements?

## Complexity Scoring (1–10)

| Score | Description | Panel Size | Estimated Effort |
|-------|-------------|------------|-----------------|
| 1–2 | Simple query, single issue | 1–2 agents | 1–2 hours |
| 3–4 | Standard matter, state law only | 2–3 agents | 2–4 hours |
| 5–6 | Multi-issue, potential CCAA law | 3–4 agents | 4–8 hours |
| 7–8 | Complex litigation, regulatory overlap | 4–5 agents | 8–16 hours |
| 9–10 | High-stakes, multi-jurisdictional, appeals | 5 agents | 16+ hours |

**Scoring factors:**
- Number of legal domains involved (+1 per domain)
- CCAA law complexity (+2 if foral law applies)
- Regulatory overlap (+1 per regulator)
- Appeal level (+1 if TS, +2 if TC)
- Cross-border elements (+1)
- Amount in dispute (+1 if > EUR 500,000)
- Urgency (+1 if < 30 days)

## Execution Plan Building

### Plan Structure
```
# Execution Plan
**Matter:** [Subject]
**Complexity:** [Score]/10
**Panel:** [Agent skills]
**Date:** [YYYY-MM-DD]

## Phase 1: Research & Analysis
- **Agent:** [Skill]
- **Tasks:** [Specific research tasks]
- **Deliverable:** [Output format]
- **Deadline:** [Relative timeline]

## Phase 2: Strategy & Positioning
- **Agent:** [Skill]
- **Tasks:** [Strategy development]
- **Deliverable:** [Output format]
- **Deadline:** [Relative timeline]

## Phase 3: Adversarial Testing
- **Agent:** [Skill]
- **Tasks:** [Stress-test positions]
- **Deliverable:** [Output format]
- **Deadline:** [Relative timeline]

## Phase 4: Drafting
- **Agent:** [Skill]
- **Tasks:** [Document preparation]
- **Deliverable:** [Output format]
- **Deadline:** [Relative timeline]

## Phase 5: Review & Consolidation
- **Agent:** [Skill]
- **Tasks:** [Quality review, summarization]
- **Deliverable:** [Output format]
- **Deadline:** [Relative timeline]

## Cross-Session Persistence
- **Session ID:** [Identifier]
- **State:** [Research completed / Strategy pending / Draft pending]
- **Next action:** [What to resume]
```

## Cross-Session Persistence Support
- Assign a unique session identifier
- Document completed phases and pending tasks
- Store key findings and citations for continuity
- Note any questions requiring user input before resuming

## Output Format
```
# Legal Briefing Report
**Matter:** [Subject]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This briefing is for planning purposes. Execution requires a Spanish abogado colegiado.

## 1. Matter Summary
[2–3 sentence summary]

## 2. Complexity Score
**Score:** [X]/10
**Rationale:** [Scoring breakdown]

## 3. Specialist Panel
| # | Skill | Role | Tasks |
|---|-------|------|-------|
| 1 | [Skill] | [Role] | [Tasks] |

## 4. Adaptive Questioning Results
- **Round 1 (Matter ID):** [Key findings]
- **Round 2 (Jurisdiction):** [Key findings]
- **Round 3 (Evidence):** [Key findings]
- **Round 4 (Strategy):** [Key findings]
- **Round 5 (Compliance):** [Key findings]

## 5. Execution Plan
[Phased plan as above]

## 6. Open Questions
- [Questions requiring user input before proceeding]

## 7. Cross-Session Persistence
- **Session ID:** [ID]
- **Status:** [Ready to execute / Awaiting user input]
- **Next step:** [Action]
```
