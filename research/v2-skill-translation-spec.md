# v2 Skill Translation Spec — ESP→ES full parity (Map C, ticket t36 / #41)

> Reference for ticket **#42 (t37)** — implementation will follow this spec row-by-row.

## Scope

15 skill legacy in `/tmp/pr37/bettercallclaude-espana/skills/` to be brought to ES-native bodies
(slug unchanged), aligning architecture with the IT reference at
`/tmp/ref-it/bettercallclaude_italia/skills/` where a cognate exists. The 6 skills added in Map A
(`citation-content-verify`, `legal-chronology`, `legal-evaluator`, `legal-intake`,
`legal-wayfinder`, `shared`) are **out of scope** here — already written in ES.

## Method

- **Source of truth:** ESP `SKILL.md` (already ES). IT reference used **only** when (a) IT has a
  cognate that ESP lacks, or (b) the IT pattern is structurally superior and we want to adopt it
  wholesale (e.g. quality-gate tables, YAML schemas, prompt-injection warning).
- **Slug invariants:** names of directories stay as-is. No rename of `spanish-*` to `italian-*`
  pattern — ES slug already namespaced.
- **Body language:** Spanish (es-ES). Frontmatter YAML remains English-tagged.
- **Glossary:** apply the 21-term table uniformly during the mechanical pass.

## Transposition Table (15 rows)

| Skill | ESP lines | IT lines | Diff vs IT | Key terms to transpose | Note |
|---|---|---|---|---|---|
| `adversarial-analysis` | 155 | 122 | structural — IT uses YAML schema (`sintesi`, `valutazione_rischio`, `probabilita_favorevole/sfavorevole`); ESP uses free-text Advocate/Adversary/Judicial Analyst roles + probability table | ratio decidendi → ratio decidendi; Fundamentos de Derecho → Fundamentos de Derecho; Abogado Demandante/Demandado → mantener; sintesi giudiziaria → síntesis judicial | Adopt IT YAML schema for cleaner downstream parsing; preserve ES named roles |
| `compliance-frameworks` | 140 | 97 | structural — IT names CONSOB/Banca d'Italia/IVASS/AGCM; ESP names CNMV/BdE/SEPBLAC/AEPD/CNMC/DGSFP | CONSOB → CNMV; Banca d'Italia → BdE; IVASS → DGSFP; AGCM → CNMC; TUF → LMV; D.Lgs. 231/2007 → Ley 10/2010 (PBC/FT) | Near-direct port; substitute regulator names + statutes |
| `data-protection-law` | 119 | 92 | structural — IT names Codice Privacy (D.Lgs. 196/2003); ESP names LOPDGDD (Ley Orgánica 3/2018). Both layer over GDPR | Codice Privacy → LOPDGDD; Garante → AEPD; DPIA → DPIA / EIPD; titolare → responsable; interessato → interesado | Keep ESP CCAA laws section (LOPDCAT/LOPDPV/LOPDNA/LOPDAN); near-direct port otherwise |
| `legal-5step-framework` | 239 | 172 | structural — IT has Quality Gate table with `flag_privilegio`, `delta_strategia`, citation-integrity gate; ESP has checklist-style gates | INTAKE/RICERCA/STRATEGIA/CONTRADDITTORIO/REDAZIONE → INTAKE/INVESTIGACIÓN/ESTRATEGIA/CONTRADICTORIO/REDACCIÓN; delta_strategia → delta_estratégico | **Add new gates**: `flag_privilegio`, `delta_estratégia > 15%`, citation-integrity gate from Phase 2 to Phase 5 |
| `legal-briefing` | 188 | n/a (no IT cognate; IT uses `legal-intake`) | no-IT-cognate | legale intake → intake legal; adaptive questioning → cuestionamiento adaptativo; complessità → complejidad; session ID → ID de sesión | **Significant restructure.** Keep ESP body; adopt IT terminology for "intake" and "session ID" |
| `legal-query-refinement` | 129 | n/a (IT uses `legal-wayfinder`) | no-IT-cognate | domanda socratica → diálogo socrático; chiarimento della query → refinamiento de la consulta; workflow ottimale → flujo de trabajo óptimo | ESP body is broader + self-contained; no clean IT template. Use ESP as-is |
| `output-summarization` | 134 | n/a (no IT cognate) | no-IT-cognate | sintesi esecutiva → resumen ejecutivo; lunghezza corta/media/lunga → longitud corta/media/larga; sintesi bilingue → resumen bilingüe | No IT cognate. ESP body is source of truth |
| `privacy-routing` | 129 | 119 | structural — IT cites Art. 622 CP + L. 247/2012 + CDF Art. 13/28; ESP cites Art. 24 LOPJ + Art. 542 CP + EGA Art. 21 | segreto professionale → secreto profesional; routing privacy → enrutamiento de privacidad; livello PRIVILEGIATO/CONFIDENZIALE/PUBBLICO → PRIVILEGIADO/CONFIDENCIAL/PÚBLICO | Near-direct port; substitute Spanish legal basis |
| `spanish-citation-formats` | 114 | 111 | structural — IT covers Cassazione/CA/Tribunale/GdP; ESP covers TS/AP/TC/BOE/CCAA BOPs | Cassazione → Tribunal Supremo (TS); sentenza → sentencia; massima → máxima / doctrina jurisprudencial; G.U. → BOE | Near-direct port; substitute court hierarchy |
| `spanish-document-analysis` | 143 | 135 | structural — IT has "Playbook Integration" subsection + "Prompt Injection Protection" warning | playbook → playbook (loanword); prompt injection → inyección de prompt (seguridad); verifica citazioni → verificación de citaciones | **Adopt 2 IT-only novel concepts**: (1) prompt-injection protection warning at top, (2) `bettercallclaude-espana.local.md` playbook integration subsection |
| `spanish-jurisdictions` | 162 | n/a (no IT analog; IT has `legal-chronology` + regional refs) | no-IT-cognate | CCAA → CCAA (Comunidades Autónomas); foral/Derecho Foral → derecho foral; Audiencia Provincial → mantener; co-official languages → mantener (sin equivalente IT) | **Highest priority.** Cannot port from IT — must be built natively. ESP body is already correct and authoritative (19-region table + co-official language section + foral law) |
| `spanish-legal-drafting` | 98 | 96 | structural — IT has 12-clause contract structure (Premessa/Definizioni/Oggetto/...); ESP has 10-clause (Partes/Objeto/...) | atto di citazione → acto de citación / demanda; ricorso per cassazione → recurso de casación; parere legale → informe jurídico / dictamen; clausola compromissoria → cláusula compromisoria | Near-direct port; substitute IT Premessa/Definizioni with ESP Partes/Objeto; add LEC-specific sections (already in ESP) |
| `spanish-legal-research` | 155 | 171 | structural — IT has ItalGiure cookie authentication flow; ESP has reduced-mode fallback tables per MCP | massima → máxima / doctrina jurisprudencial; giurisprudenza di legittimità → jurisprudencia de casación; ItalGiure → CENDOJ / poderjudicial.es; ratio decidendi → ratio decidendi | ESP already has reduced-mode tables matching IT pattern. ItalGiure cookie flow not transferable; replace with CENDOJ reference |
| `spanish-legal-strategy` | 167 | 129 | structural — IT has CPC/CPP/CPA riti; ESP has LEC pathways (ordinario/verbal/monitorio/cambiario/ejecutivo). IT has BATNA/WATNA | rito ordinario → procedimiento ordinario (LEC); BATNA/WATNA → mantener; transazione → transacción; onere della prova → carga de la prueba; art. 2697 CC → art. 217 LEC | **Adopt IT BATNA/WATNA table.** Substitute LEC pathways; preserve ESP timeline table |
| `spanish-legal-translation` | 135 | 79 | structural — ESP body is much richer than IT (5 vs 3 categories) | domanda giudiziale → demanda judicial; attore → demandante; convenuto → demandado; ricorso → recurso; sentenza → sentencia; cassazione → casación; falso amico → falso amigo; traduttore giurato → traductor jurado | **ESP is more comprehensive than IT.** Use ESP body |

## v2 ES Glossary — 21 Legal-Method Terms for CONTEXT.md (ticket #43)

| # | IT term | ES term |
|---|---|---|
| 1 | segreto professionale | secreto profesional |
| 2 | attività defensoria / patrocinio | actividad defensiva / defensa letrada |
| 3 | sentenza di legittimità | sentencia de casación / unificación de doctrina (TS) |
| 4 | giurisprudenza di legittimità | jurisprudencia de casación (vinculante para inferiores) |
| 5 | giurisprudenza costante | jurisprudencia consolidada |
| 6 | principio di diritto | principio de derecho |
| 7 | ratio decidendi | ratio decidendi (mantener en latín) |
| 8 | Cassazione / sentenza della Cassazione | Tribunal Supremo (TS) / sentencia del TS |
| 9 | Corte d'Appello (CA) | Audiencia Provincial (AP) |
| 10 | attività di trattamento (dati personali) | tratamiento de datos (personales) |
| 11 | titolare del trattamento | responsable del tratamiento |
| 12 | interessato (GDPR) | interesado (RGPD) |
| 13 | diritto imperativo / norme inderogabili | derecho imperativo / normas imperativas |
| 14 | BATNA / WATNA | BATNA / WATNA (mantener en inglés) |
| 15 | onere della prova | carga de la prueba |
| 16 | termine processuale / dies a quo non computatur | plazo procesal / dies a quo non computatur (mantener latín) |
| 17 | memoria / parere legale | informe jurídico / dictamen |
| 18 | falso amico (traduzione) | falso amigo (traducción) |
| 19 | prompt injection (sicurezza) | inyección de prompt (seguridad) |
| 20 | playbook contrattuale | playbook contractual |
| 21 | contraddittorio (procedimento) | contradictorio (procedimiento) / análisis adversarial |

## Implementation Notes

### Priority order for ticket #42 (t37)

1. **`spanish-jurisdictions`** — highest priority, no IT transfer value; body already authoritative; ensure CCAA statures + foral law + co-official languages all represented
2. **`spanish-document-analysis`** — add 2 IT-only novel concepts (prompt-injection warning + playbook integration subsection)
3. **`legal-5step-framework`** — add new quality gates: `flag_privilegio`, `delta_estratégia > 15%`, citation-integrity gate
4. **`spanish-legal-strategy`** — adopt IT BATNA/WATNA table; substitute LEC pathways for CPC
5. **`adversarial-analysis`** — adopt IT YAML schema for downstream parsing; preserve ES named roles
6. Mechanical substitution pass (regulators/courts/CCAA laws) across: `compliance-frameworks`, `data-protection-law`, `privacy-routing`, `spanish-citation-formats`, `spanish-legal-research`, `spanish-legal-drafting`
7. Apply 21-term glossary uniformly during mechanical pass
8. Keep as-is (already ES-native, no IT gain): `legal-briefing`, `legal-query-refinement`, `output-summarization`, `spanish-legal-translation`

### Acceptance for #42

- All 15 skill SKILL.md files pass `validate-plugin.js` (frontmatter valid, name field slug match)
- No skill body contains Italian legal terms (spot-check 5 skills with `grep -i -E "Cassazione|Garante|attività|interessato|titolare"`)
- Glossary applied: `grep -r "ratio decidendi" bettercallclaude-espana/skills/` returns ≥10 matches across skills (latin kept); `grep -r "BATNA" bettercallclaude-espana/skills/` returns ≥1 match in `spanish-legal-strategy`
- New quality gates in `legal-5step-framework`: `grep -c "flag_privilegio\|delta_estratégia\|integridad de citaciones"` ≥3
- `bettercallclaude-espana.local.md` referenced in `spanish-document-analysis` body
- Injection warning text appears at top of `spanish-document-analysis` (not necessarily)

### Ticket ordering

- #41 (this ticket) → produces this spec + branch `research/v2-skill-translation`
- #42 (t37) → uses this spec row-by-row; PR tematica verso `dev` (split in 2 PRs se > 2000 righe: prima 7 skill legal/data-protection/privacy-routing, poi 8 metodologiche + spanish-*)
- #43 (t38) → applies glossary table in `CONTEXT.md`

### Reference

- ESP source: `/tmp/v2-spec/bettercallclaude-espana/skills/` (worktree on `research/v2-skill-translation`)
- IT reference: `/tmp/ref-it/bettercallclaude_italia/skills/`
- Map C parent: GitHub issue #40