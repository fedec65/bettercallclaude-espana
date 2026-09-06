# Perfiles de Loop — Detalle

## citas-limpias

**Objetivo**: anti-alucinación. Cada cita en el artefacto es validada via MCP.

**Worker**: agente de redacción (via `/borrador`)
**Evaluador**: especialista en citas (agente citation)

**Condiciones de éxito**:
- R1: cada cita traza a un resultado MCP de `legal-citations-esp`
- R2: cada cita textual es verbatim de la fuente
- Ninguna cita inventada o no verificable
- Formato de cita conforme a `spanish-citation-formats`

**Tools MCP usados**: `legal-citations-esp` → `validate_citation`, `extract_citations`

**Iteraciones por defecto**: 3

---

## borrador-listo

**Objetivo**: quality gate de redacción. El artefacto satisface citas + estructura + afirmaciones con apoyo.

**Worker**: drafter (via `/borrador`)
**Evaluador**: analista judicial (agente judicial)

**Condiciones de éxito**:
- Todos los criterios de `citas-limpias` (R1, R2)
- Estructura del documento coherente
- Cada afirmación legal apoyada por fuente
- Formato conforme al tipo de documento (escrito, dictamen, contrato)

**Tools MCP usados**: `legal-citations-esp`, `boe-legislacion`

**Iteraciones por defecto**: 5

---

## contradictorio-convergencia

**Objetivo**: stress-test iterativo hasta la convergencia de la posición legal o máximo de iteraciones.

**Worker**: advocate (agente advocate)
**Evaluador**: adversary + judicial (agentes adversary y judicial)

**Condiciones de éxito**:
- La posición legal resiste las objeciones del adversario
- Las vulnerabilidades identificadas han sido abordadas
- El evaluador no encuentra nuevas objeciones sustanciales
- Convergencia: score estable durante 2 iteraciones

**Tools MCP usados**: `cendoj-jurisprudencia` (precedentes), `tribunal-constitucional` (constitucional), `boe-legislacion` (normativa)

**Iteraciones por defecto**: 5

---

## nda-lote-limpio

**Objetivo**: completitud del triage NDA para carpetas enteras.

**Worker**: analista de documentos (via `/triage-nda`)
**Evaluador**: especialista en compliance (agente compliance)

**Condiciones de éxito**:
- Cada NDA de la carpeta tiene un veredicto (GREEN/YELLOW/RED)
- Cada cláusula crítica está analizada
- Los umbrales del playbook se aplican correctamente
- Ningún NDA saltado o analizado solo parcialmente

**Tools MCP usados**: `boe-legislacion` (verificación de referencias)

**Iteraciones por defecto**: 3

---

## seguimiento-normativo

**Objetivo**: seguimiento de cambios normativos y jurisprudenciales relevantes.

**Worker**: researcher (agente researcher)
**Evaluador**: compliance (agente compliance)

**Condiciones de éxito**:
- BOE consultado para cambios recientes (`search_boe`, `get_texto_consolidado`)
- CENDOJ consultado para nuevos criterios (`search_jurisprudencia`); el Tribunal Constitucional para doctrina constitucional (`search_sentencias_tc`)
- Congreso consultado para normas en trámite (`track_legislative_status`)
- Cada cambio relevante identificado y clasificado por impacto
- Report estructurado con fecha, fuente, impacto

**Tools MCP usados**: `boe-legislacion`, `cendoj-jurisprudencia`, `tribunal-constitucional`, `congreso-debates`, `eu-law-esp` (derecho UE), `catalunya-legal` (derecho civil catalán)

**Iteraciones por defecto**: 1 (one-pass-por-ejecución, programable)

**Nota**: este perfil está pensado para ejecuciones periódicas (p. ej. semanales). Una única iteración produce el report de los cambios desde el último check. Para la programación automática (Cowork, cron, sesiones programadas) y el formato del archivo de temas vigilados, ver `references/scheduling-seguimiento-normativo.md`.

---

## timeline-sourced

**Objetivo**: procedencia de la cronología. Cero eventos sin fuente; disciplina R1/R2 aplicada a los hechos.

**Worker**: chronology-builder (via `/cronologia-legal`)
**Evaluador**: especialista en citas (agente citation)

**Condiciones de éxito**:
- Cada evento de la cronología tiene una fuente trazable (documento + locus)
- Cero eventos sin procedencia en cualquier output
- Todos los conflictos de fechas señalados explícitamente con ambas fechas y las fuentes
- Todos los marcadores de plazo anclados a un evento con fuente y etiquetados indicativos

**Tools MCP usados**: verificación de las fuentes contra los documentos del caso (lookup documento + locus); `legal-citations-esp` para eventuales citas legales en el texto de los eventos

**Iteraciones por defecto**: 5

**Scoring**: (eventos con fuente verificada / eventos totales) * 100; cualquier conflicto de fechas no señalado o plazo no anclado es un FAIL automático

**Nota**: el chronology-builder extrae; el agente citation verifica la procedencia. Un evento sin documento+locus es el equivalente fáctico de una cita fabricada y no puede pasar jamás. En caso de FAIL: cada evento sin fuente, conflicto no señalado o plazo flotante se devuelve al worker como finding accionable.
