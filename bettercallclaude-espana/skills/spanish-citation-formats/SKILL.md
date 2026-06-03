---
name: spanish-citation-formats
description: "Citation verification and formatting for Spanish legal sources. Triggered when citations need validation, standardization, batch processing, or cross-language conversion between Spanish and English. Use for court decisions, statutes, regulations, and official gazette references. Ensures citation accuracy target >95%."
---

# Spanish Citation Formats

## Objective
Verify, normalize, and format legal citations according to Spanish standards. Support single-citation checks, batch standardization, and cross-language conversion (ES ↔ EN). Target citation accuracy >95%.

## MCP Servers
- `legal-citations-esp` — Primary citation verification and normalization engine.
- `boe-legislacion` — Verify BOE statute and regulation references.
- `cendoj-jurisprudencia` — Verify Tribunal Supremo decision references.
- `tribunal-constitucional` — Verify Tribunal Constitucional decision references.

## Citation Formats

### Tribunal Supremo (TS)
- **Format:** STS [Sala] [Date] [Ref]
- **Example:** STS Sala de lo Civil 12 marzo 2024, Rec. 1234/2023
- **Variations:** STSJ (Sala de lo Social), STSJCA (Sala de lo Contencioso-Administrativo)

### Audiencias Provinciales (AP)
- **Format:** SAP [Provincia] [Date] [Ref]
- **Example:** SAP Madrid 15 enero 2024, Rec. 567/2023
- **Note:** Province name in Spanish (Madrid, Barcelona, Sevilla, Valencia, etc.)

### Tribunal Constitucional (TC)
- **Format:** STC [Date] [Ref]
- **Example:** STC 15 marzo 2024, Rec. 123/2023
- **Variations:** ATC (Auto del TC) for procedural decisions

### BOE — Boletín Oficial del Estado
- **Format:** BOE [Date] [Number]
- **Example:** BOE 1 marzo 2024, núm. 52
- **Note:** Date and sequential number within the year

### Statute Citations
- **Código Civil:** Art. X CC
- **Código Penal:** Art. X CP
- **LEC (Civil Procedure):** Art. X LEC
- **LECrime (Criminal Procedure):** Art. X LECrim
- **LOPJ:** Art. X LOPJ
- **Constitución Española:** Art. X CE
- **Ley de Sociedades de Capital:** Art. X LSC

### CCAA Official Gazettes
- **Cataluña:** DOGC [Date] [Number]
- **Galicia:** DOGA [Date] [Number]
- **País Vasco:** BOPV [Date] [Number]
- **Andalucía:** BOJA [Date] [Number]
- **Madrid:** BOCM [Date] [Number]
- **Other CCAA:** Use respective official gazette abbreviation

## Cross-Language Conversion (ES ↔ EN)
When converting citations between Spanish and English:
- Preserve original Spanish abbreviations (STS, SAP, STC, BOE)
- Translate descriptive text (Sala → Chamber, Recurso → Appeal)
- Maintain original date format (DD MMMM YYYY)
- Keep article numbers and statute abbreviations unchanged

**Example conversion:**
- **ES:** STS Sala de lo Civil 12 marzo 2024, Rec. 1234/2023
- **EN:** STS Civil Chamber 12 March 2024, App. No. 1234/2023

## Batch Standardization
For multiple citations:
1. Parse each citation to identify type (STS, SAP, BOE, etc.)
2. Normalize spacing, punctuation, and date formats
3. Verify against respective databases via MCP servers
4. Flag unverifiable citations for manual review
5. Output standardized list with verification status

## Verification Protocol
1. **Decision citations:** Query `cendoj-jurisprudencia`, `cendoj-jurisprudencia`, or `tribunal-constitucional`
2. **Statute citations:** Query `boe-legislacion` or CCAA gazette databases
3. **Cross-reference:** Check that cited articles exist in the cited statute version
4. **Date consistency:** Verify that decision dates align with reference numbers

## Quality Standards
- Citation accuracy target: **>95%**
- Unverifiable citations flagged with `[UNVERIFIED]` marker
- Date format standardized to: DD MMMM YYYY
- Province names in Spanish for AP citations
- Official gazette numbers verified against publication records

## Output Format
```
# Citation Verification Report
**Date:** [YYYY-MM-DD]
**Disclaimer:** Citations verified against public databases. Always confirm with primary sources before filing.

## Verified Citations
| # | Original | Standardized | Source | Status |
|---|----------|--------------|--------|--------|
| 1 | [input] | [normalized] | [BOE/TS/TC] | ✅ Verified |

## Unverifiable Citations
| # | Original | Issue | Suggested Action |
|---|----------|-------|------------------|
| 1 | [input] | [reason] | [action] |

## Cross-Language Versions
- **ES:** [Spanish format]
- **EN:** [English format]
```
