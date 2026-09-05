# BetterCallClaude España

Legal-AI plugin for Spanish law. Canonical language: Spanish (policy locked in ticket t13 — full Spanish prose, legal content transposed to Spanish law, Italian method structure preserved). Legacy artifacts in English (15 skills, 21 command names) remain until Map C revisits them.

## Language

**contradictorio**:
Fase/stadio di confronto tra parti nel metodo legale. Anche nome file `04-contradictorio.md`.
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
Sostantivo spagnolo + `-legal` (`mapa-legal`, `percurso-legal`, `cronologia-legal`, `bucle-legal`, `objetivo-legal`). I 21 nomi inglesi esistenti restano fino a decisione Map C.
_Avoid_: prefisso `legale-` (italiano), nomi inglesi per comandi nuovi

## Lingua: prossima migrazione (Map C)

**Canonical language plugin**: spagnolo (ESP). Le skill ad alto contatto utente (research, drafting, strategy) sono prioritarie. NON tradurre adesso — solo documento il piano per Map C.

**File di prosa ancora in inglese da tradurre** (inventario iniziale — aggiornare in Map C):

- `bettercallclaude-espana/skills/spanish-legal-research/SKILL.md` — ricerca legale, evidenze BOE/CENDOJ/TC/doctrina. Tool rinominati già allineati alla convenzione canonica (issue 2 della PR #29). Priorità: **alta** (skill user-facing, primo contatto col plugin).
- `bettercallclaude-espana/skills/data-protection-law/SKILL.md` — riferimenti residui a nomi tool pre-ritiro (`search_legislation`, `get_article`); la prosa del protocollo è ancora in inglese. Priorità: **media** (specialistica, non primo contatto).
- `bettercallclaude-espana/skills/legal-chronology/SKILL.md` — già spagnolo per il corpo principale; verificare riferimenti secondari. Priorità: **bassa** (corpo già localizzato).
- `bettercallclaude-espana/agents/*.md` — prosa del system prompt in inglese per molti agent (`advocate.md`, `adversary.md`, `researcher.md`, `judicial.md`, `procedure.md`, `corporate.md`, `realestate.md`, `compliance.md`, `risk.md`, `summarizer.md`, `translator.md`, `briefing.md`, `drafter.md`, `fiscal.md`, `citation.md`, `data-protection.md`, `autonomic.md`, `orchestrator.md`, `prompt-engineer.md`). Priorità: **media** (prosa interna al system prompt, non esposta all'utente finale).
- `bettercallclaude-espana/skills/spanish-citation-formats/SKILL.md` — da verificare.
- `bettercallclaude-espana/skills/spanish-jurisdictions/SKILL.md` — da verificare.
- `bettercallclaude-espana/skills/spanish-legal-strategy/SKILL.md` — da verificare.
- `bettercallclaude-espana/skills/spanish-document-analysis/SKILL.md` — da verificare.
- `bettercallclaude-espana/skills/spanish-legal-drafting/SKILL.md` — da verificare.
- `bettercallclaude-espana/skills/spanish-legal-translation/SKILL.md` — bilingue per definizione, gestire caso per caso.

**Decisione pending per Map C**: tradurre il system prompt degli agent allo spagnolo (impatto sulla qualità del prompt stesso — da valutare) oppure mantenere l'ingernese come "lingua di lavoro del modello" ed esporre solo le descrizioni `description:` in spagnolo (prosa utente-facing).

Vincolni sempre: zero cirillico, zero emoji, prosa in spagnolo canonico, italiano solo per meta-documentazione interna (CONTEXT.md, AGENTS.md).
