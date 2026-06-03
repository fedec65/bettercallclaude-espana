---
name: compliance-frameworks
description: "Regulatory compliance analysis for Spanish supervised entities. Covers CNMV (securities markets), BdE (banking supervision), SEPBLAC (AML/PBC-FT), Código de Buen Gobierno (corporate governance), and sectoral regulations. Triggered when assessing compliance obligations, designing compliance programs, or responding to regulatory inquiries in Spain."
---

# Compliance Frameworks

## Objective
Assess regulatory compliance obligations for entities operating under Spanish supervision. Cover securities markets (CNMV), banking (BdE), anti-money laundering (SEPBLAC), corporate governance (Código de Buen Gobierno), and sector-specific regulations.

## Regulators

### CNMV — Comisión Nacional del Mercado de Valores
- **Scope:** Securities markets, investment services, collective investment, issuers
- **Key regulations:** Ley del Mercado de Valores (LMV), MiFID II (transposed), Prospectus Regulation
- **Obligations:**
  - Transparency and disclosure (información privilegiada)
  - Market abuse prevention (manipulación de mercado, operaciones con información privilegiada)
  - Suitability and appropriateness tests
  - Periodic reporting (informes periódicos)
- **Enforcement:** Sanciones administrativas, public warnings

### BdE — Banco de España
- **Scope:** Credit institutions, payment services, macroprudential policy
- **Key regulations:** Ley 10/2014 (ordenación, supervisión y solvencia de entidades de crédito), CRD/CRR
- **Obligations:**
  - Capital adequacy (solvencia)
  - Risk management
  - Reporting (CIRBE, etc.)
  - Consumer protection (transparencia de operaciones)
- **Enforcement:** Administrative sanctions, corrective measures

### SEPBLAC — Servicio Ejecutivo de la Comisión de Prevención del Blanqueo de Capitales e Infracciones Monetarias
- **Scope:** Anti-money laundering (PBC) and counter-terrorist financing (FT)
- **Key regulations:** Ley 10/2010 (PBC/FT), EU AML Directives
- **Obligations:**
  - Customer due diligence (CDD / debida diligencia del cliente)
  - Suspicious transaction reporting (OTR / operaciones sospechosas)
  - Record keeping
  - Internal controls and compliance officer appointment
  - Risk assessment
- **Enforcement:** Administrative fines, criminal referral

### AEPD — Agencia Española de Protección de Datos
- See `data-protection-law` skill for detailed coverage
- **Key cross-over:** SEPBLAC data processing must comply with LOPDGDD + GDPR

## Código de Buen Gobierno
- **Scope:** Listed companies (sociedades cotizadas)
- **Key principles:**
  - Board composition and independence
  - Remuneration policy (política de retribuciones)
  - Related-party transactions (operaciones vinculadas)
  - Risk control and internal audit
  - Shareholder rights
  - Transparency and disclosure
- **Compliance:** Voluntary but market-expected; some provisions mandatory via LSC and CNMV rules

## Sectoral Regulations

### Insurance
- DGSFP (Dirección General de Seguros y Fondos de Pensiones)
- Ley 20/2015 (ordenación, supervisión y solvencia de entidades aseguradoras)

### Real Estate
- Ley 2/1985 (de arrendamientos urbanos) — LAU
- Ley 49/1960 (de propiedad horizontal) — LPH
- Ley 13/2015 (de remisión de deudas, segunda oportunidad, etc.)

### Energy
- CNMC (Comisión Nacional de los Mercados y la Competencia)
- Sectoral unbundling and transparency rules

### Telecommunications
- CNMC
- Ley 9/2014 (General de Telecomunicaciones)

## Risk Assessment Frameworks

### AML Risk Assessment (SEPBLAC Model)
1. **Inherent risk:** Customer type, product/service, jurisdiction, delivery channel
2. **Mitigating controls:** CDD procedures, monitoring, internal audit
3. **Residual risk:** Inherent risk minus controls
4. **Risk rating:** Bajo / Medio / Alto

### Compliance Program Components
1. **Policies and procedures** — Written, approved, communicated
2. **Compliance officer** — Designated, independent, empowered
3. **Training** — Regular, risk-based, documented
4. **Monitoring** — Periodic reviews, internal audit
5. **Reporting** — To board and regulators
6. **Remediation** — Corrective action plans

## Output Format
```
# Compliance Assessment
**Entity:** [Name]
**Sector:** [Financial / Real Estate / Energy / Telecom / Other]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This assessment is for informational purposes. Regulatory compliance requires specialized advice from a Spanish abogado colegiado or compliance officer.

## 1. Applicable Regulatory Framework
| Regulator | Regulation | Applicability |
|-----------|------------|---------------|
| CNMV | [LMV / MiFID II] | [Applicable / Not applicable] |
| BdE | [Ley 10/2014] | [Applicable / Not applicable] |
| SEPBLAC | [Ley 10/2010] | [Applicable / Not applicable] |
| AEPD | [LOPDGDD / GDPR] | [Applicable / Not applicable] |

## 2. Compliance Obligations
### [Regulator]
- **Obligation 1:** [Description]
- **Status:** [Compliant / Partial / Non-compliant]
- **Gap:** [Description]
- **Remediation:** [Action]

## 3. Risk Assessment
| Risk | Likelihood | Impact | Mitigation | Residual Risk |
|------|------------|--------|------------|---------------|
| [Risk] | [High/Med/Low] | [High/Med/Low] | [Control] | [High/Med/Low] |

## 4. Compliance Program Gaps
- [Gap 1]
- [Gap 2]

## 5. Remediation Plan
| # | Action | Owner | Deadline | Priority |
|---|--------|-------|----------|----------|
| 1 | [Action] | [Role] | [Date] | [High/Med/Low] |

## 6. Regulatory Filing Requirements
- [Filing requirement and deadline]
```
