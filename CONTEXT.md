# BetterCallClaude España

Legal-AI plugin for Spanish law. Canonical language: Spanish (policy locked in ticket t13 — full Spanish prose, legal content transposed to Spanish law, Italian method structure preserved). Map C status: 15 legacy skills translated to ES (#42 via PR #57/#58, + fix review #60); remaining EN artifacts: 21 command names (#44), agent system prompts (decision pending, #45), docs (#46–#49), README (#54).

## Lingua e convenzioni di stile

- **Spagnolo (es-ES)** per gli artefatti del plugin: body skill, comandi, agent, output MCP, `description:` dei frontmatter. Eccezione documentata: i system prompt degli agent restano in inglese come lingua di lavoro del modello finché #45 non decide (cfr. decisione pending).
- **Italiano** solo per la meta-documentazione interna (`CONTEXT.md`, `AGENTS.md`, issue di processo) — mai nei body delle skill.
- **Slug senza accenti** (directory, file, comandi, chiavi frontmatter); **prosa con accenti**.
- Zero emoji, zero cirillico. Latinismi e anglicismi tecnici mantenuti verbatim dove indicato (`ratio decidendi`, `dies a quo`, `BATNA/WATNA`, `playbook`, `intake`).

## Glossary canonico

Ogni voce: termine canonico (grassetto) + definizione + `_Avoid_` (sinonimo da respingere).

### Flusso del metodo e documenti (Map A)

**contradictorio**:
Fase/stadio di confronto tra parti nel metodo legale. Anche nome file `04-contradictorio.md`. In prosa: `análisis adversarial` come metodo di stress-test della strategia.
_Avoid_: contraddittorio, adversarial (in prosa spagnola)

**plazos**:
Termini processuali o sostantivi; sempre etichettati "indicativos" — mai consulenza legale.
_Avoid_: termini (calco dall'italiano)

**prescripción**:
Estinzione del diritto per decorso del tempo (arts. 1930–1975 CC España).
_Avoid_: prescrizione, prescription (in prosa spagnola)

**cronología**:
Ricostruzione documentata dei fatti di una causa. Slug comandi/file senza accenti (`cronologia-legal`), prosa con accenti (`cronología`).
_Avoid_: cronologia senza accento (in prosa), cronologia italiana

**fuentes**:
File `fuentes.md` in `bcc-output/` — traccia documentale delle fonti MCP consultate.
_Avoid_: fonti

**borrador**:
Bozza del documento prodotto. File `05-borrador-<doc>.md`.
_Avoid_: bozza, redazione

**investigación**:
Ricerca legale. File `02-investigacion.md` (slug senza accenti).
_Avoid_: ricerca

**intake**:
Fase di raccolta iniziale del caso. Termine tecnico mantenuto verbatim (convenzione cross-plugin IT/CH/ESP).
_Avoid_: assunzione, accettazione

**dictamen autonómico**:
Parere su diritto autonomico CCAA. File `dictamen-autonomico-<ccaa>.md`.
_Avoid_: parere (generico), dictamen (senza specificare CCAA)

**patrón de comandos nuevos**:
Sostantivo spagnolo + `-legal` (`mapa-legal`, `percurso-legal`, `cronologia-legal`, `bucle-legal`, `objetivo-legal`). I 21 nomi inglesi esistenti: 15 rinominati in #44 (alias retro-compat), 6 invariati (`briefing`, `federal`, `legal`, `legal-5step`, `version`, `workflow`).
_Avoid_: prefisso `legale-` (italiano), nomi inglesi per comandi nuovi

### Skill ES-native (Map A)

Skill già scritte in spagnolo in Map A — slug invarianti, NON legacy, non vanno tradotte né rinumerate:

**legal-intake**:
Skill di raccolta strutturata del caso (session ID, cuestionamiento adaptativo). Complementare a `legal-briefing` (legacy tradotta).
_Avoid_: trattarla come legacy EN

**legal-wayfinder**:
Skill di raffinamento progressivo della query legale. Complementare a `legal-query-refinement` (legacy tradotta).
_Avoid_: tradurre lo slug in prosa

**legal-chronology**:
Skill di ricostruzione cronologica dei fatti con mappatura scadenze (`deadline-mapping.md`).
_Avoid_: confonderla con la skill legacy `legal-5step-framework` fase cronología

**legal-evaluator**:
Skill di valutazione dell'output (loop-profiles) su più dimensioni.
_Avoid_: inglesismi nel body (già ES)

**citation-content-verify**:
Skill di verifica contenutistica delle citazioni (oltre la forma di `spanish-citation-formats`).
_Avoid_: `citation` come verbo in prosa

**shared**:
Skill condivisa (risorse cross-skill, es. tabella giurisdizioni CCAA).
_Avoid_: includerla nei conteggi delle skill tradotte

### Termini giuridici canonici (transposition IT→ES — spec t36 / #43)

Termini emersi dalla traduzione delle 15 skill legacy: il termine spagnolo è canonico, l'equivalente italiano/inglese tra parentesi è il calco da evitare.

**secreto profesional**:
Riservatezza del letrado su fatti e documenti del cliente (art. 542.3 LOPJ, art. 21 Estatuto General de la Abogacía).
_Avoid_: segreto professionale

**actividad defensiva / defensa letrada**:
Esercizio della difesa tecnica in giudizio.
_Avoid_: attività defensoria, patrocinio

**sentencia de casación / unificación de doctrina**:
Sentenza del TS che unifica dottrina (ricorso in cassazione).
_Avoid_: sentenza di legittimità

**jurisprudencia de casación**:
Giurisprudenza del TS in cassazione, che integra l'ordinamento giuridico quando costituisce dottrina reiterata (art. 1.6 CC).
_Avoid_: giurisprudenza di legittimità

**jurisprudencia consolidada**:
Orientamento giurisprudenziale costante e ripetuto.
_Avoid_: giurisprudenza costante

**principio de derecho**:
Regola giuridica desumibile dalla sentenza (motivo di cassazione).
_Avoid_: principio di diritto

**ratio decidendi**:
Nucleo decisionale del precedente — mantenere in latino.
_Avoid_: tradurla

**Tribunal Supremo (TS) / sentencia del TS**:
Vertice giurisdizionale spagnolo (cassazione civile/penale).
_Avoid_: Cassazione, Corte di Cassazione

**Audiencia Provincial (AP)**:
Organo collegiale provinciale di appello.
_Avoid_: Corte d'Appello

**tratamiento de datos (personales)**:
Operazioni sui dati personali (RGPD).
_Avoid_: attività di trattamento

**responsable del tratamiento**:
Soggetto che determina finalità e mezzi del trattamento (RGPD).
_Avoid_: titolare del trattamento

**interesado (RGPD)**:
Persona fisica i cui dati sono trattati.
_Avoid_: interessato (calco)

**derecho imperativo / normas imperativas**:
Norme inderogabili dalla volontà delle parti.
_Avoid_: diritto imperativo, norme inderogabili

**BATNA / WATNA**:
Migliore/peggiore alternativa all'accordo negoziato — mantenere in inglese (tabella strategia).
_Avoid_: tradurle

**carga de la prueba**:
Onere della prova (art. 217 LEC).
_Avoid_: onere della prova

**plazo procesal / dies a quo non computatur**:
Termine processuale; il dies a quo non si computa — mantenere il latinismo.
_Avoid_: termine processuale (calco), confondere con `plazos` (etichette indicative)

**informe jurídico / dictamen**:
Parere legale scritto (prodotto della skill di drafting). Distinto da `dictamen autonómico` (parere su diritto CCAA).
_Avoid_: memoria (in senso italiano), parere legale

**falso amigo (traducción)**:
Falso amico nella traduzione giuridica ES↔IT.
_Avoid_: falso amico

**inyección de prompt (seguridad)**:
Attacco/rischio di manipolazione del modello via input; warning nelle skill.
_Avoid_: prompt injection (in prosa spagnola)

**playbook contractual**:
Playbook contrattuale per la redazione (es. integrazione `bettercallclaude-espana.local.md`).
_Avoid_: playbook contrattuale, contract playbook

## Stato Map C (aggiornato a #43)

**Fatto:**
- #41 research spec traduzione 15 skill (spec t36) → guida di #42/#43
- #42 traduzione 15 skill legacy EN→ES — PR #57 (legal, 7) + #58 (method, 8), merged su `dev`
- #59/#60 fix review Devin residui (5 bug + 3 analisi + 6 thread re-review), merged su `dev` `b1f8aad`
- #43 CONTEXT.md glossary v2 — PR #61, merged su `dev` `7a5f496`

**Residui (in ordine):**
- #44 rename 15 comandi + alias stub
- #45 ayuda/tool-contracts/sweep
- #46–#49 docs ES (INSTALACION, PLAYBOOK, command-reference, AGENT_ARCHITECTURE)
- #50–#53 evals/testdocs/templates
- #54 README rewrite bilingue
- #55 bump 2.0.0 (marketplace/plugin/package)
- #56 acceptance + release v2.0.0 (`dev` → `main`, tag, GitHub Release, zip)

**Decisione pending:** tradurre i system prompt degli agent allo spagnolo (impatto sulla qualità del prompt — da valutare) oppure mantenerli in inglese come "lingua di lavoro del modello" ed esporre solo le `description:` in spagnolo. Vincolo: zero cirillico, zero emoji; prosa spagnola canonica; italiano solo per meta-documentazione interna.
