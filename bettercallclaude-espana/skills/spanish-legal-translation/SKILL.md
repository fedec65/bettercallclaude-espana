---
name: spanish-legal-translation
description: "ES ↔ EN legal terminology translation for Spanish law. Triggered when translating contracts, court documents, legal opinions, or correspondence between Spanish and English. Preserves legal register, precision, and context. Follows court document translation standards."
---

# Spanish Legal Translation

## Objective
Provide accurate, context-aware legal translation between Spanish (ES) and English (EN) while preserving legal register, precision, and the specific meaning of Spanish legal concepts.

## Core Term Equivalents

### General Legal Terms
| Spanish | English | Notes |
|---------|---------|-------|
| responsabilidad | liability / responsibility | Use "liability" for contractual/tort; "responsibility" for general |
| daños | damages | In tort and contract law |
| daños y perjuicios | damages and losses | Broader than common law "damages" |
| contrato | contract | |
| prueba | evidence / proof | "Evidence" in procedural context; "proof" as result |
| carga de la prueba | burden of proof | |
| obligación | obligation / duty | "Obligation" in civil law; "duty" in common law contexts |
| incumplimiento | breach / non-performance | "Breach" for contracts; "non-performance" for civil law precision |
| resolución del contrato | termination of contract | Not "resolution" |
| nulidad | nullity / voidness | |
| anulabilidad | voidability | |
| buena fe | good faith | |
| mala fe | bad faith | |
| dolo | fraud / deceit | "Fraud" in general; "deceit" for specific tort |
| culpa | negligence / fault | "Negligence" in tort; "fault" in broader civil law sense |
| fuerza mayor | force majeure | |
| caso fortuito | fortuitous event | Distinct from fuerza mayor in Spanish doctrine |

### Procedural Terms
| Spanish | English | Notes |
|---------|---------|-------|
| demanda | claim / complaint / lawsuit | "Claim" in civil; "complaint" in criminal |
| demandante | claimant / plaintiff | "Claimant" preferred in civil law contexts |
| demandado | defendant / respondent | |
| escrito | submission / pleading / brief | Context-dependent |
| sentencia | judgment / decision | "Judgment" for final decisions |
| auto | order / ruling | Procedural decisions; "ruling" in common law |
| recurso de apelación | appeal | |
| recurso de casación | cassation appeal | To Tribunal Supremo |
| recurso de amparo | constitutional appeal | To Tribunal Constitucional |
| prueba documental | documentary evidence | |
| prueba testifical | witness evidence / testimony | |
| prueba pericial | expert evidence | |
| declaración de parte | party witness statement | |

### Corporate Terms
| Spanish | English | Notes |
|---------|---------|-------|
| sociedad anónima (SA) | public limited company | |
| sociedad de responsabilidad limitada (SL / SRL) | private limited company | |
| administrador | director / manager | "Director" for board members |
| junta general | general meeting / shareholders' meeting | |
| consejo de administración | board of directors | |
| escritura pública | public deed | Notarized document |
| registro mercantil | commercial registry | |
| objeto social | corporate purpose | |
| capital social | share capital | |

### Property Terms
| Spanish | English | Notes |
|---------|---------|-------|
| propiedad | ownership / property | |
| posesión | possession | |
| usufructo | usufruct | Civil law concept |
| arrendamiento | lease / tenancy | "Lease" for property; "tenancy" for residential |
| compraventa | sale and purchase | |
| hipoteca | mortgage | |
| gravamen | charge / encumbrance / lien | |
| comunidad de propietarios | owners' association | Under Ley de Propiedad Horizontal |

### Criminal Terms
| Spanish | English | Notes |
|---------|---------|-------|
| delito | crime / offense | |
| falta | misdemeanor / petty offense | Less serious than delito |
| pena | sentence / penalty / punishment | "Sentence" for judicial decision |
| prisión | imprisonment / prison | |
| libertad provisional | bail / release on bail | |
| detención | arrest / detention | |
| instrucción | investigation / pre-trial | |
| juicio oral | trial / hearing | |

## Context-Aware Translation Rules
1. **Preserve legal register:** Use formal, precise language appropriate for legal documents.
2. **Distinguish homonyms:** "Sentencia" = judgment (final) vs. "auto" = order (procedural).
3. **Civil law precision:** Spanish civil law concepts (e.g., obligaciones, contratos) may not map perfectly to common law; add explanatory notes where needed.
4. **Statute references:** Keep original abbreviations (CC, CP, LEC) with English expansion in first use.
5. **Court names:** Translate descriptively but keep abbreviations (Tribunal Supremo = Supreme Court, but keep "TS").

## Court Document Translation Standards
- **Certified translation:** For filing in Spanish courts, translations must be by a *traductor jurado* (sworn translator).
- **Formatting:** Preserve original document structure and paragraph numbering.
- **Annotations:** Flag untranslatable concepts with translator's notes.
- **Bilingual alignment:** Maintain paragraph-level correspondence for verification.

## Quality Standards
- [ ] Legal register preserved (formal, precise)
- [ ] Terminology consistent throughout document
- [ ] Ambiguous terms flagged with translator's notes
- [ ] Statute and court abbreviations preserved
- [ ] Certified translator requirement noted for court filings
- [ ] Disclaimer included

## Output Format
```
# Legal Translation — [Document Type]
**Source language:** [ES / EN]
**Target language:** [EN / ES]
**Domain:** [Civil / Corporate / Criminal / Labor / Administrative]
**Date:** [YYYY-MM-DD]
**Disclaimer:** This translation is for informational purposes. For court filing, use a traductor jurado (sworn translator).

## Translation
[Translated text with preserved structure]

## Terminology Glossary
| Source term | Target term | Context |
|-------------|-------------|---------|
| [term] | [translation] | [context] |

## Translator's Notes
- [Note on untranslatable or ambiguous concepts]
```
