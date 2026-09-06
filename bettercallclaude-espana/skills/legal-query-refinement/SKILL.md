---
name: legal-query-refinement
description: "Diálogo socrático para refinar consultas jurídicas vagas en tareas de investigación accionables. Se activa cuando la consulta del usuario está subespecificada, es ambigua o carece de contexto esencial para el análisis jurídico español. Identifica la información faltante y reformula las consultas con la terminología jurídica española adecuada."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
---

# Refinamiento de la Consulta Jurídica

## Objetivo
Transformar consultas jurídicas vagas o subespecificadas en tareas de investigación precisas y accionables mediante un diálogo socrático. Identificar la información faltante y reformular la consulta usando la terminología jurídica española adecuada.

## Condiciones de Activación
Actívate cuando la consulta del usuario carezca de alguno de los siguientes elementos:
- Jurisdicción (estatal vs. CCAA)
- Dominio jurídico (civil, penal, mercantil, laboral, administrativo, constitucional)
- Posición de la parte (demandante / demandado / tercero)
- Pretensión buscada (condena, declaración, medida cautelar)
- Contexto fáctico (cronología, importes, partes)
- Tipo de output (informe de investigación, contrato, escrito judicial, dictamen)

## Protocolo de Diálogo Socrático

### Ronda 1: Jurisdicción
**Pregunta:** ¿Se trata de una cuestión de derecho estatal o autonómico? ¿Hay alguna Comunidad Autónoma específica involucrada?
**Propósito:** Determinar si aplica el derecho estatal (CC, CP, LEC) o el derecho de las CCAA (sistemas forales: PV, NC, GA).

### Ronda 2: Dominio Jurídico
**Pregunta:** ¿En qué área del derecho se enmarca su consulta? (civil, penal, mercantil, laboral, administrativo, constitucional)
**Propósito:** Dirigir hacia el marco jurídico y las normas procesales correctos.

### Ronda 3: Posición de la Parte
**Pregunta:** ¿Cuál es su posición en el asunto? ¿Actúa como demandante, demandado, o tercero?
**Propósito:** Enmarcar el análisis desde la perspectiva correcta (estrategia ofensiva vs. defensiva).

### Ronda 4: Pretensión Buscada
**Pregunta:** ¿Qué resultado busca? (condena económica, declaración de derechos, medida cautelar, resolución de contrato, etc.)
**Propósito:** Identificar la vía procesal aplicable y los remedios jurídicos.

### Ronda 5: Contexto Fáctico
**Pregunta:** ¿Puede proporcionar los hechos relevantes? (fechas, importes, partes, contratos, documentos)
**Propósito:** Fundamentar el análisis jurídico en hechos concretos.

### Ronda 6: Tipo de Output
**Pregunta:** ¿Qué tipo de respuesta necesita? (informe jurídico, borrador de contrato, escrito judicial, análisis de estrategia)
**Propósito:** Determinar el formato y la profundidad del output.

## Reformulación de la Consulta
Tras recopilar la información, reformula la consulta en una tarea de investigación jurídica estructurada:

### Formato de Consulta Estructurada
```
# Consulta Jurídica Refinada
**Consulta original:** [Pregunta original del usuario]
**Fecha de refinamiento:** [AAAA-MM-DD]

## 1. Jurisdicción
- **Nivel:** [Estatal / Autonómico / Mixto]
- **CCAA:** [Nombre / Ninguna]
- **Derecho foral:** [Aplicable / No aplicable]

## 2. Dominio Jurídico
- **Principal:** [Civil / Penal / Mercantil / Laboral / Administrativo / Constitucional]
- **Subdominio:** [Contratos / Propiedad / Familia / Sociedades / etc.]

## 3. Posición de la Parte
- **Rol:** [Demandante / Demandado / Tercero / Neutral]
- **Intereses:** [Resumen de los objetivos de la parte]

## 4. Pretensión Buscada
- **Principal:** [Condena / Declaración / Medida cautelar / etc.]
- **Secundaria:** [Pretensión alternativa]
- **Importe:** [EUR / No aplicable]

## 5. Resumen Fáctico
- **Cronología:** [Fechas clave]
- **Partes:** [Nombres / roles]
- **Documentos:** [Lista de documentos relevantes]
- **Controversia:** [Conflicto fáctico central]

## 6. Requisitos del Output
- **Tipo:** [Informe / Contrato / Escrito / Estrategia]
- **Idioma:** [ES / EN / Bilingüe]
- **Urgencia:** [Inmediata / Estándar / Baja prioridad]
- **Profundidad:** [Preliminar / Detallada / Exhaustiva]

## 7. Flujo de Trabajo Sugerido
1. [Paso 1: p. ej., investigación jurídica sobre el art. X CC]
2. [Paso 2: p. ej., búsqueda de jurisprudencia de STS sobre la cuestión]
3. [Paso 3: p. ej., redacción de documentos]
4. [Paso 4: p. ej., análisis adversarial]
```

## Sugerencias de Flujo de Trabajo Óptimo
Según la consulta refinada, sugiere la secuencia de skills más eficiente:

| Tipo de Consulta | Flujo de Trabajo Sugerido |
|------------------|---------------------------|
| Cuestión jurídica general | `spanish-legal-research` |
| Revisión de contrato | `spanish-document-analysis` → `spanish-legal-drafting` |
| Planificación de litigio | `legal-query-refinement` → `spanish-legal-research` → `spanish-legal-strategy` |
| Controversia compleja | `legal-briefing` → `spanish-legal-research` → `adversarial-analysis` → `spanish-legal-drafting` |
| Asunto transfronterizo | `spanish-legal-research` → `spanish-legal-translation` → `spanish-legal-drafting` |
| Revisión de cumplimiento | `spanish-document-analysis` → `compliance-frameworks` → `data-protection-law` |

## Formato de Output
```
# Informe de Refinamiento de la Consulta
**Fecha:** [AAAA-MM-DD]

## Consulta Refinada
[Consulta estructurada según el formato anterior]

## Información Faltante Identificada
- [Lista de elementos que el usuario no proporcionó inicialmente]

## Próximos Pasos Sugeridos
1. [Paso del flujo de trabajo 1]
2. [Paso del flujo de trabajo 2]
3. [Paso del flujo de trabajo 3]

## Skills Recomendadas
- [Lista de skills a invocar]
```
