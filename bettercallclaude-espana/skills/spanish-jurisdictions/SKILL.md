---
name: spanish-jurisdictions
description: "Resolves state vs autonomic law applicability across Spain's 17 CCAA. Triggered when determining which jurisdiction applies, comparing CCAA legal regimes, analyzing foral systems, or navigating court hierarchy. Use for civil law differences, co-official language requirements, and federal competence questions under CE Art. 149 vs Art. 148."
---

# Spanish Jurisdictions

## Objective
Determine the applicable legal jurisdiction (state vs. CCAA), identify court hierarchies, and compare legal regimes across Spain's 17 Comunidades Autónomas (CCAA). Account for foral systems, co-official languages, and federal competence allocation under the Constitución Española.

## 17 CCAA Profiles

### Complete List
| Abbreviation | CCAA | Capital | Co-official Language | Foral Civil Law |
|--------------|------|---------|----------------------|-----------------|
| AN | Andalucía | Sevilla | — | — |
| AR | Aragón | Zaragoza | — | — |
| AS | Asturias | Oviedo | — | — |
| IB | Islas Baleares | Palma | Catalan (co-official) | — |
| CN | Canarias | Santa Cruz / Las Palmas | — | — |
| CB | Cantabria | Santander | — | — |
| CM | Castilla-La Mancha | Toledo | — | — |
| CL | Castilla y León | Valladolid | — | — |
| CT | Cataluña | Barcelona | Catalan (co-official) | — |
| CE | Ceuta | Ceuta | — | — |
| VC | Comunidad Valenciana | Valencia | Valencian (co-official) | — |
| EX | Extremadura | Mérida | — | — |
| GA | Galicia | Santiago de Compostela | Galician (co-official) | Derecho Civil Gallego |
| MD | Madrid | Madrid | — | — |
| ML | Melilla | Melilla | — | — |
| MC | Región de Murcia | Murcia | — | — |
| NC | Navarra | Pamplona | — | Derecho Civil Navarro |
| PV | País Vasco | Vitoria-Gasteiz | Basque (co-official) | Derecho Civil Vasco |
| RI | La Rioja | Logroño | — | — |

*Note: There are 19 regions total (17 CCAA + 2 ciudades autónomas: Ceuta and Melilla).*

## Foral Systems (Derecho Foral)
Three CCAA maintain distinct civil law traditions:

### País Vasco (PV)
- **System:** Derecho Civil Vasco
- **Key differences:** Family law (alimentos, régimen económico matrimonial), inheritance (legítima foral), property regimes
- **Gazette:** BOPV
- **Language:** Spanish + Basque (co-official)

### Navarra (NC)
- **System:** Derecho Civil Navarro
- **Key differences:** Régimen económico matrimonial, inheritance law, contractual formalities
- **Gazette:** BON
- **Language:** Spanish + Basque (co-official in some areas)

### Galicia (GA)
- **System:** Derecho Civil Gallego
- **Key differences:** Inheritance (legítima gallega), family law, rural property
- **Gazette:** DOGA
- **Language:** Spanish + Galician (co-official)

## Co-official Languages
Five CCAA have co-official languages; legal documents may be filed in these languages:
- **Cataluña (CT):** Catalan
- **País Vasco (PV):** Basque (Euskera)
- **Galicia (GA):** Galician
- **Islas Baleares (IB):** Catalan
- **Comunidad Valenciana (VC):** Valencian

## Court Hierarchy
```
Juzgado de Primera Instancia / Juzgado de lo Social / Juzgado de lo Contencioso-Administrativo
    ↓
Audiencia Provincial (AP) — AP regional appellate court
    ↓
Tribunal Supremo (TS) — Highest court for ordinary jurisdiction
    ↓
Tribunal Constitucional (TC) — Constitutional review (fundamental rights)
```

### Specialized Jurisdictions
- **Juzgados de lo Social:** Labor disputes
- **Juzgados de lo Contencioso-Administrativo:** Administrative disputes
- **Juzgados de lo Mercantil:** Commercial disputes
- **Juzgados de Menores:** Juvenile matters
- **Juzgados de Vigilancia Penitenciaria:** Prison-related matters

## Federal Structure

### State Competences (CE Art. 149)
Exclusive state jurisdiction over:
- Civil legislation (general framework; CCAA may develop foral civil law)
- Penal legislation
- Commercial and corporate law (LSC)
- Labor law (framework)
- Intellectual property
- Immigration and nationality
- Currency and banking regulation

### CCAA Competences (CE Art. 148)
CCAA may assume competences in:
- Organization of institutions of self-government
- Territorial planning, urbanism, and housing
- Agriculture and livestock
- Inland waterways
- Hunting and fishing
- Local fairs
- Promotion of culture, research, and language
- Tourism
- Health and hygiene
- Social assistance
- Guarantees of civil rights (within state framework)

## State vs. CCAA Law Applicability

### Decision Matrix
| Matter | State Law | CCAA Law | Notes |
|--------|-----------|----------|-------|
| General civil obligations | CC | — | State framework |
| Family law (PV, NC, GA) | — | Foral civil code | Check specific CCAA |
| Inheritance (PV, NC, GA) | — | Foral civil code | Legítima foral/gallega |
| Commercial contracts | LSC / CC | — | State law |
| Labor relations | ET | — | State framework; CCAA can regulate public sector |
| Administrative procedure | LPAC | — | State law |
| Environmental regulation | State framework | CCAA development | Concurrent competence |
| Consumer protection | State framework | CCAA can supplement | — |
| Data protection | LOPDGDD + GDPR | CCAA may add sectoral rules | AEPD is state regulator |

## Output Format
```
# Jurisdiction Analysis
**Date:** [YYYY-MM-DD]
**Disclaimer:** This analysis is informational. Confirm applicability with a Spanish abogado colegiado.

## 1. Applicable Jurisdiction
- **Primary:** [State / CCAA / Foral]
- **CCAA:** [Name]
- **Rationale:** [CE Art. 149 vs. Art. 148 analysis]

## 2. Court Hierarchy
- **First instance:** [Court type and location]
- **Appeal:** [AP]
- **Cassation:** [TS — if applicable]
- **Constitutional:** [TC — if fundamental rights affected]

## 3. CCAA Comparison Matrix
| Aspect | State | [CCAA 1] | [CCAA 2] | ... |
|--------|-------|----------|----------|-----|
| Civil law | CC | [Foral/State] | [Foral/State] | ... |
| Language | Spanish | [Co-official] | [Co-official] | ... |
| Gazette | BOE | [CCAA gazette] | [CCAA gazette] | ... |

## 4. Foral Law Considerations
- [If applicable: Derecho Civil Vasco/Navarro/Gallego differences]

## 5. Co-official Language Requirements
- [If applicable: Catalan, Basque, Galician, Valencian filing requirements]
```
