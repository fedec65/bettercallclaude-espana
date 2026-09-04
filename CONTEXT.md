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
