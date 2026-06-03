---
name: spanish-document-analysis
description: "Analyze Spanish legal documents to identify issues, extract clauses, verify citations, assess compliance, and flag risks. Triggered when reviewing contracts, court filings, notarial deeds, corporate documents, or any text involving Spanish law. Checks mandatory law compliance and references Spanish databases."
---

# Spanish Document Analysis

## Objective
Analyze legal documents under Spanish law to identify legal issues, extract key clauses, verify citations, assess compliance, and flag risks. Support contracts, court submissions, notarial deeds, corporate documents, and regulatory filings.

## MCP Servers
- `cendoj-jurisprudencia` — Verify case law citations
- `boe-legislacion` — Verify statute citations
- `legal-citations-esp` — Normalize and verify all citations
- `cendoj-jurisprudencia` — Verify Tribunal Supremo references
- `tribunal-constitucional` — Verify Tribunal Constitucional references

## Analysis Protocol

### Step 1: Document Classification
Identify document type:
- Contract (contrato)
- Court submission (escrito / demanda)
- Notarial deed (escritura pública)
- Corporate document (estatutos, acta de junta)
- Regulatory filing (documento regulatorio)
- Legal opinion (informe jurídico)
- Letter / correspondence

### Step 2: Issue Identification
Scan for:
- **Missing mandatory clauses** (e.g., Art. 6 CC compliance, mandatory law references)
- **Ambiguous terms** (undefined obligations, vague deadlines)
- **Unbalanced provisions** (excessive liability waivers, one-sided termination)
- **Language issues** (mixed languages, inconsistent terminology)
- **Jurisdictional mismatches** (wrong governing law, incorrect forum)

### Step 3: Key Clause Extraction
Extract and categorize:
- **Obligations:** Primary and secondary duties of each party
- **Payments:** Amounts, deadlines, currencies, indexing
- **Term:** Duration, renewal, termination conditions
- **Liability:** Caps, exclusions, indemnities
- **Governing law:** Ley aplicable, jurisdiction clause
- **Dispute resolution:** Jurisdicción, arbitraje, mediación
- **Force majeure:** Definition, notice requirements, effects
- **Confidentiality:** Scope, duration, exceptions
- **Data protection:** LOPDGDD / GDPR compliance clauses
- **Amendment:** Modification procedures

### Step 4: Citation Verification
For each legal citation:
1. Identify type (STS, SAP, BOE, Art. X CC, etc.)
2. Query appropriate MCP server for verification
3. Flag unverifiable citations
4. Check if cited provisions are still in force

### Step 5: Compliance Assessment
Check against:
- **Mandatory law (normas imperativas):** Art. 6 CC, sector-specific mandatory rules
- **Consumer protection:** Ley General para la Defensa de los Consumidores
- **Data protection:** LOPDGDD + GDPR
- **Labor law:** Estatuto de los Trabajadores (if employment-related)
- **Corporate law:** LSC (if company-related)
- **Tax:** IRPF, IS, IVA implications
- **CCAA law:** Foral systems (PV, NC, GA) where applicable

### Step 6: Risk Flagging
Assign risk levels:
- **🔴 Critical:** Mandatory law violation, unenforceable clause, missing essential element
- **🟡 Warning:** Ambiguous provision, high liability exposure, jurisdictional risk
- **🟢 Advisory:** Suboptimal drafting, missing protective clause, improvement suggestion

## Mandatory Law Issues to Flag
- **Art. 6 CC:** Clause violating mandatory law → void (nulo)
- **Art. 1255 CC:** Excessive restriction on contractual freedom
- **Art. 1101 CC:** Inadequate liability provisions
- **Art. 1895 CC:** Liability limitation contrary to good faith
- **LEC Art. 399:** Court submission missing required content
- **LOPDGDD / GDPR:** Missing or inadequate data protection clauses
- **LSC:** Corporate document not complying with mandatory corporate rules

## Output Format
```
# Document Analysis Report
**Document type:** [Type]
**Jurisdiction:** [State / CCAA]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This analysis is for informational purposes. Engage a Spanish abogado colegiado for definitive advice.

## 1. Executive Summary
- **Overall risk:** [Low / Medium / High / Critical]
- **Key issues:** [Number] critical, [Number] warnings, [Number] advisories

## 2. Issue Details
### 🔴 Critical Issues
| # | Issue | Location | Legal basis | Recommendation |
|---|-------|----------|-------------|----------------|
| 1 | [Description] | [Clause/section] | [Art. X CC] | [Action] |

### 🟡 Warnings
| # | Issue | Location | Legal basis | Recommendation |
|---|-------|----------|-------------|----------------|
| 1 | [Description] | [Clause/section] | [Art. X LEC] | [Action] |

### 🟢 Advisories
| # | Issue | Location | Suggestion |
|---|-------|----------|------------|
| 1 | [Description] | [Clause/section] | [Improvement] |

## 3. Key Clauses Extracted
| Category | Clause | Summary |
|----------|--------|---------|
| [Category] | [Reference] | [Summary] |

## 4. Citation Verification
| Citation | Source | Status | Notes |
|----------|--------|--------|-------|
| [Citation] | [BOE/TS] | ✅ Verified / ❌ Unverified | [Notes] |

## 5. Compliance Assessment
| Area | Status | Notes |
|------|--------|-------|
| Mandatory law (Art. 6 CC) | ✅ Compliant / ❌ Non-compliant | [Notes] |
| Consumer protection | ✅ / ⚠️ / ❌ | [Notes] |
| Data protection | ✅ / ⚠️ / ❌ | [Notes] |
| Labor law | N/A / ✅ / ⚠️ / ❌ | [Notes] |
| Corporate law | N/A / ✅ / ⚠️ / ❌ | [Notes] |
| Tax | N/A / ✅ / ⚠️ / ❌ | [Notes] |
| CCAA law | N/A / ✅ / ⚠️ / ❌ | [Notes] |

## 6. Risk Summary
- **Critical risks:** [Count] — [Brief description]
- **Warning risks:** [Count] — [Brief description]
- **Advisory items:** [Count] — [Brief description]
```
