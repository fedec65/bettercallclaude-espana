# Playbook — BetterCallClaude España

Guía de **uso práctico** del plugin para despachos y departamentos legales: perfil del estudio, flujos de trabajo recomendados, orquestación de comandos y buenas prácticas de privacidad.

## 1. Introducción

BetterCallClaude España expone 21 agentes especializados en derecho español, comandos de orquestación, skills con vocabulario y marcos propios, y servidores MCP con acceso a BOE, CENDOJ, TC, EUR-Lex y fuentes autonómicas. Su ámbito cubre el ordenamiento español — normativa estatal y autonómica de las 17 CCAA, jurisprudencia TS/AP/TC, derecho de la UE y doctrina — y sus agentes aplican exclusivamente skills y servidores MCP del plugin. Este playbook explica cómo aprovecharlos en el trabajo diario de un despacho o departamento legal.

**Diferencia entre INSTALACION y PLAYBOOK:** `INSTALACION.md` cubre la **instalación** del plugin, la plantilla local y los flujos persistentes; este documento cubre el **uso práctico**. Ambos se complementan con `docs/AGENT_ARCHITECTURE.md` (topología de agentes y enrutado directo) y `docs/command-reference.md` (referencia completa de comandos).

Los comandos usan nombres en español desde v2.0 (`/investigacion`, `/borrador`, `/validar`, …). Los nombres v1.x (`/research`, `/draft`, `/validate`, …) siguen activos como alias deprecados hasta v2.1.0 — ver la tabla de renombrado en `INSTALACION.md` §4.

## 2. Perfil del despacho (playbook local)

El plugin personaliza su comportamiento leyendo un playbook local — `bettercallclaude-espana.local.md` — con los datos y preferencias del despacho. Se busca en este orden:

1. `.claude/bettercallclaude-espana.local.md` (Claude Code).
2. `bettercallclaude-espana.local.md` en la carpeta compartida (Cowork Desktop).
3. `.claude/legal.local.md` (compatibilidad Anthropic).
4. Ningún archivo → defaults españoles.

El perfil no es decorativo: calibra el análisis de documentos (posiciones contractuales estándar y umbrales de riesgo), los criterios del triage de NDA (duración máxima aceptable, ámbito de la confidencialidad) y el estilo de los documentos finales (idioma, carpeta de salida `bcc-output`).

Si no existe ningún archivo de perfil, los comandos aplican los **defaults españoles** y lo hacen constar en la salida — por ejemplo, `/triage-nda` clasifica con los umbrales por defecto (duración máxima de 5 años) y recomienda crear el playbook, sin crearlo por sí solo.

La forma más sencilla de crearlo es `/start`, que guía el alta con 5-6 preguntas y genera el archivo. Estructura mínima:

```markdown
## Perfil del despacho

- **Nombre y sede**: Bufete García & Asociados, Madrid
- **Tipo**: bufete / departamento in-house / asesoría fiscal-contable
- **Comunidades autónomas principales**: Madrid, Cataluña
- **Lenguas de trabajo**: ES, EN, CA
- **Ley aplicable por defecto**: derecho español
- **Foro predefinido**: Juzgados de Madrid / Audiencia Provincial de Madrid
- **Umbrales de confidencialidad**: NDA máximo 3 años; cláusula penal ≤ 10 %
```

Ver `INSTALACION.md` §3 para la plantilla completa (`templates/bettercallclaude-espana.local.md.example.es`) y los campos de estilo y formato. En Claude Code el archivo vive en `.claude/` del proyecto del despacho, de modo que todo el equipo lo comparte.

## 3. Flujos de trabajo recomendados

| Escenario | Flujo recomendado | Notas |
|-----------|-------------------|-------|
| Búsqueda jurisprudencial | `/investigacion` → `/precedente` → `/borrador` | Memo con STS/SAP/STC verificado antes de redactar |
| Redacción de contrato | skill `legal-intake` (briefing) → `/borrador` → `/validar` | Valida el formato de las citas por lotes |
| Due diligence inmobiliaria | `/cronologia-legal` + `/autonomico` | Cronología documentada + derecho de la CCAA |
| Compliance RGPD/LOPDGDD | `/analizar-doc` + `@spanish-data-protection-expert` | Detecta cláusulas y evalúa cumplimiento |
| Triage de NDA | `/triage-nda` | Verdicto GREEN/YELLOW/RED según umbrales del playbook |
| Preparación de litigio | `/investigacion` → `/estrategia` → `/borrador` | Vía procesal conforme a la LEC y análisis coste-beneficio |

### 3.1 Notas por escenario

- **Búsqueda jurisprudencial**: `/investigacion` localiza la jurisprudencia relevante (TS, AP, TC) y elabora el memo; `/precedente` analiza la cadena de precedentes STS/SAP/STC; `/borrador` produce el informe final con formato de cita correcto.
- **Redacción de contrato**: la skill `legal-intake` fija el contexto y las posiciones del despacho; `/borrador` redacta el contrato, escrito o informe; `/validar` comprueba las citas en lote (formato, existencia y coherencia).
- **Due diligence inmobiliaria**: `/cronologia-legal` construye la cronología documentada del asunto (cada evento con fuente obligatoria); `/autonomico` analiza el régimen de la CCAA concreta (p. ej. derecho civil catalán para operaciones en Cataluña).
- **Compliance RGPD/LOPDGDD**: `/analizar-doc` identifica problemas y extrae cláusulas; la revisión con `@spanish-data-protection-expert` aplica los criterios de la AEPD y del RGPD.
- **Triage de NDA**: `/triage-nda` clasifica el documento como GREEN (estándar), YELLOW (revisión) o RED (problemas) usando los umbrales del playbook y criterios del derecho español.
- **Preparación de litigio**: sobre la investigación previa, `/estrategia` desarrolla la estrategia procesal — riesgos, análisis coste-beneficio y vía procesal conforme a la LEC.

Los mismos escenarios se ejecutan como **plantillas fijas de `/workflow`** (`litigation-prep`, `due-diligence`, `contract-lifecycle`, `realestate-closing`). Para los **flujos persistentes** — guardar un flujo propio, gestionarlo (`list`, `show`, `delete`) y reanudarlo con `--resume` — ver `INSTALACION.md` §2.

## 4. Comandos de orquestación

- **`/legal`** — gateway principal: clasifica la intención, resuelve la jurisdicción y enruta al agente o comando especializado. Es el punto de entrada recomendado para consultas no estructuradas.
- **`/legal-5step`** — marco completo en 5 pasos: intake → investigación → estrategia → análisis adversarial → borrador. Útil para asuntos complejos que requieren el ciclo entero.
- **`/briefing`** — briefing estructurado previo a la ejecución: ensambla el panel de especialistas, recoge el contexto del asunto y construye el plan de trabajo.
- **`/workflow`** — ejecuta flujos multi-agente desde plantillas fijas (`litigation-prep`, `due-diligence`, `contract-lifecycle`, `realestate-closing`); para flujos guardados persistentes, ver `INSTALACION.md` §2.
- **`/start`** — onboarding: verifica la conectividad MCP, guía la creación del playbook local y muestra ejemplos según el perfil del usuario.
- **`/analizar-doc`** y **`/investigacion`** — acceso directo a tareas concretas (análisis de un documento, investigación) cuando no hace falta pasar por el gateway.

### 4.1 ¿Comando o agente directo?

- **Tarea acotada** (verificar una cita, analizar una cláusula, traducir un pasaje): enruta directo al agente con `@spanish-*` (p. ej. `@spanish-citation-expert`, `@spanish-legal-translator`, `@spanish-data-protection-expert`) — ver `docs/AGENT_ARCHITECTURE.md`.
- **Asunto complejo**: deja que `/legal` clasifique la intención y enrute, o aplica `/legal-5step` para cubrir el ciclo completo (intake → investigación → estrategia → adversarial → borrador) con control de calidad en cada fase.
- **Proceso repetible**: si el mismo flujo se repite entre asuntos, consérvalo como flujo persistente y reanúdalo cuando entre material nuevo — gestión de flujos en `INSTALACION.md` §2.

## 5. Buenas prácticas de privacidad

- El hook **`secreto profesional`** (Art. 24 LOPJ / Art. 542 CP) revisa las llamadas salientes a herramientas en busca de indicios de información privilegiada antes de ejecutarlas. Aplica también al contenido de los workflows.
- Modos configurables **strict / balanced / cloud**: ajustan la política de privacidad según la sensibilidad del asunto.
- **Ollama (local)**: en modo strict el hook no bloquea estas llamadas (el contenido no sale de la máquina); úsalo para los documentos más sensibles en lugar de los servidores en la nube.
- Datos personales: trata conforme a la LOPDGDD (Ley Orgánica 3/2018) y al RGPD (Reglamento UE 2016/679). En los flujos persistentes, el `user_id` es la única clave de acceso — trátalo como credencial (ver `INSTALACION.md` §2.2).
- Incluye siempre el disclaimer profesional en las salidas. El control de calidad del plugin (p. ej. `/validar`) comprueba el formato y la existencia de las citas contra las fuentes MCP; la verificación final de una cita antes de presentarla en un escrito sigue siendo responsabilidad del profesional.
- El playbook **no puede derogar el derecho imperativo**: si una preferencia del despacho choca con una norma, el plugin lo señala y aplica la ley (p. ej. límites de supresión de la LOPDGDD §17).

## 6. Personalización

Para adaptar el plugin a un despacho concreto:

1. Ejecuta `/start` y responde la entrevista (5-6 preguntas): genera `.claude/bettercallclaude-espana.local.md` y verifica la conectividad MCP.
2. Revisa el archivo generado frente al perfil del §2; la plantilla completa con los campos de estilo se describe en `INSTALACION.md` §3.
3. Consulta `docs/AGENT_ARCHITECTURE.md` para enrutar directamente a un agente con `@spanish-*`.
4. Revisa `docs/command-reference.md` para la sintaxis completa de cada comando.

En Cowork Desktop, coloca el playbook en la carpeta compartida (precedencia 2 del §2) para que sobreviva al reinicio del sandbox; en Claude Code, la carpeta `.claude/` del proyecto es el lugar natural.
