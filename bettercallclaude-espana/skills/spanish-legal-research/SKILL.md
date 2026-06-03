---
name: spanish-legal-research
description: "Comprehensive legal research across Spanish state and autonomic law. Triggered when the user requests legal research, case law search, legislation lookup, doctrine review, or precedent analysis involving Spanish law (state or CCAA). Use for identifying applicable statutes, interpreting articles, finding judicial precedents from TS/AP, or reviewing academic commentary. Reduced mode applies when MCP servers (cendoj-jurisprudencia, boe-legislacion, legal-persona-esp, tribunal-constitucional, doctrina-academica) are unavailable."
---

# Spanish Legal Research

## Objective
Conduct rigorous, source-verified legal research across the Spanish legal system, covering state law (Código Civil, Código Penal, LEC, LECrim, LOPJ, CE, LSC, etc.) and autonomic law (17 CCAA statutes and regulations). Provide actionable legal analysis with verified citations and a quality gate checklist.

## MCP Servers
- `cendoj-jurisprudencia` — Search and retrieve decisions from TS, AP, and lower courts.
- `cendoj-jurisprudencia` — Search Tribunal Supremo decisions (STS, Auto del TS).
- `boe-legislacion` — Query BOE legislation database (state statutes and regulations).
- `legal-persona-esp` — Apply Spanish judicial reasoning styles and doctrinal perspectives.
- `tribunal-constitucional` — Search Tribunal Constitucional decisions (STC, Auto del TC).
- `legal-citations-esp` — Verify and normalize citation accuracy.

## Tools
- `search_decisions` — Full-text search across Spanish court decisions (STS, SAP, Auto).
- `get_decision` — Retrieve full text and metadata of a specific decision.
- `search_legislation` — Search statutes and regulations in BOE and CCAA official gazettes.
- `get_article` — Retrieve a specific article from a Spanish statute (e.g., Art. 1255 CC).
- `get_doctrine` — Retrieve academic commentary and doctrinal summaries.
- `get_commentary` — Retrieve official commentary or legislative history (exposición de motivos).

## Research Protocol

### Step 1: Scope Definition
Identify:
- Legal domain (civil, penal, mercantil, laboral, administrativo, constitucional)
- Applicable jurisdiction (state vs. CCAA; foral systems: PV, NC, GA)
- Date range for precedents (prioritize STS from the last 10 years)
- Language preference (ES / EN / bilingual)

### Step 2: Legislation Search
1. Query `search_legislation` for the relevant statute and articles.
2. Retrieve specific articles via `get_article`.
3. Note CCAA statutes where applicable (e.g., Derecho Civil Vasco, Derecho Civil Navarro).

### Step 3: Case Law Search
1. Search `cendoj-jurisprudencia` for Tribunal Supremo precedents.
2. Search `cendoj-jurisprudencia` for Audiencias Provinciales and lower courts.
3. Search `tribunal-constitucional` for constitutional review (STC) if fundamental rights are involved.
4. Use `get_decision` to retrieve full texts for key precedents.

### Step 4: Doctrinal Review
1. Query `get_doctrine` for leading academic commentary.
2. Query `get_commentary` for legislative history where interpretive ambiguity exists.

### Step 5: Precedent Analysis
For each key precedent, analyze:
- **Ratio decidendi**: Core legal reasoning binding under Spanish law.
- **Distinguishing facts**: Facts that differentiate the precedent from the user's case.
- **Evolution**: How subsequent STS or SAP have developed, distinguished, or overruled the precedent.
- **Persuasiveness**: Weight of the precedent (STS > SAP > Doctrine > Legislative materials).

### Step 6: Interpretation
Apply Spanish legal interpretation methods as appropriate:
- **Grammatical**: Literal meaning of the statutory text.
- **Systematic**: Context within the statute and related laws.
- **Teleological**: Purpose and legislative intent.
- **Historical**: Legislative history and exposición de motivos.

### Step 7: Citation Verification
Run all citations through `legal-citations-esp` MCP to verify:
- Decision references (STS [Sala] [Date] [Ref], SAP [Provincia] [Date] [Ref], STC [Date] [Ref])
- Statute citations (Art. X CC, Art. X CP, Art. X LEC)
- Official gazette references (BOE [Date] [Number])

## Source Hierarchy
1. **STS** — Tribunal Supremo decisions (highest state judicial authority)
2. **AP** — Audiencias Provinciales (intermediate appellate courts)
3. **Doctrine** — Academic and scholarly commentary
4. **Legislative materials** — BOE, exposición de motivos, parliamentary debates
5. **STC** — Tribunal Constitucional decisions (when constitutional rights are at issue)

## Quality Gate Checklist
- [ ] At least one current STS or STC cited for each core legal proposition
- [ ] All statute citations verified against BOE
- [ ] CCAA law identified and cited where applicable
- [ ] Doctrinal support noted for ambiguous provisions
- [ ] Citations normalized and verified via `legal-citations-esp`
- [ ] Date of research noted (Spanish law evolves)
- [ ] Disclaimer included

## Output Format
```
# Legal Research Memorandum — [Topic]
**Jurisdiction:** [State / CCAA / Foral]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This research is for informational purposes only and does not constitute legal advice. Consult a Spanish abogado colegiado for advice specific to your situation.

## 1. Applicable Legislation
- [Statute citations with verified article numbers]

## 2. Case Law
- [STS / SAP / STC citations with ratio decidendi summary]

## 3. Doctrinal Position
- [Academic commentary summary]

## 4. Analysis & Interpretation
- [Synthesis applying grammatical, systematic, teleological, and/or historical methods]

## 5. Conclusion
- [Actionable legal position with confidence level]

## Verified Citations
- [Normalized citation list]
```

## Reduced Mode (MCP Unavailable)
When MCP servers are unavailable:
1. State clearly that citations could not be verified live.
2. Provide citations based on training knowledge with **estimated accuracy** markers.
3. Advise the user to verify all citations manually via:
   - [CENDOJ](https://www.poderjudicial.es/cgpj/es/Tribunales/Informacion-Jurisprudencia/) for STS/SAP
   - [BOE](https://www.boe.es/) for legislation
   - [TC](https://www.tribunalconstitucional.es/) for STC
4. Reduce confidence levels accordingly and flag any uncertain propositions.
