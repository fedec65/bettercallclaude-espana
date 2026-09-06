---
name: legal-briefing
description: "Coordinación de intake legal previo a la ejecución para asuntos jurídicos españoles complejos. Se activa antes de la ejecución multiagente en litigios, transacciones o revisiones de cumplimiento complejos. Ensambla un panel de especialistas de 3-5 agentes, conduce un cuestionamiento adaptativo, construye un plan de ejecución y asigna una puntuación de complejidad (1-10). Soporta persistencia entre sesiones."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
---

# Briefing Legal

## Objetivo
Coordinar el intake legal previo a la ejecución para asuntos jurídicos españoles complejos. Ensamblar un panel de especialistas, conducir un cuestionamiento adaptativo, construir un plan de ejecución completo y asignar una puntuación de complejidad.

## Condiciones de Activación
Activar para:
- Litigios multijurisdiccionales (estatal + CCAA)
- Litigios de alta cuantía (importe > EUR 100.000)
- Transacciones societarias (M&A, reestructuraciones)
- Investigaciones regulatorias (CNMV, BdE, SEPBLAC, AEPD)
- Marcos contractuales complejos
- Recursos ante el TS o el TC
- Asuntos transfronterizos con elemento español

## Composición del Panel de Especialistas

### Composición del Panel (3–5 Agentes)
| Rol | Skill | Responsabilidad |
|------|-------|----------------|
| **Investigador principal** | `spanish-legal-research` | Investigación jurídica nuclear, legislación, jurisprudencia |
| **Estratega** | `spanish-legal-strategy` | Vía procesal, cronograma, análisis de costes |
| **Especialista documental** | `spanish-legal-drafting` | Redacción de contratos, escritos judiciales, dictámenes |
| **Analista de jurisdicción** | `spanish-jurisdictions` | Derecho de las CCAA, sistemas forales, elección de fuero |
| **Analista de cumplimiento** | `compliance-frameworks` | Cumplimiento normativo, CNMV/BdE/SEPBLAC/AEPD |
| **Especialista en protección de datos** | `data-protection-law` | LOPDGDD, RGPD, asuntos ante la AEPD |
| **Analista adversarial** | `adversarial-analysis` | Prueba de estrés de las posiciones jurídicas |
| **Traductor** | `spanish-legal-translation` | Documentación ES ↔ EN |

**Criterios de selección:**
- Mínimo 3 agentes; máximo 5
- Incluir `spanish-legal-research` en todos los paneles
- Incluir `spanish-legal-strategy` para asuntos contenciosos
- Incluir `compliance-frameworks` para asuntos regulatorios
- Incluir `data-protection-law` para asuntos de datos/privacidad

## Rondas de Cuestionamiento Adaptativo

### Ronda 1: Identificación del Asunto
- ¿Cuál es la cuestión jurídica? (civil, penal, mercantil, laboral, administrativo, constitucional)
- ¿Cuál es la cuantía aproximada en disputa?
- ¿Qué partes intervienen?
- ¿Existe un procedimiento pendiente? (Juzgado, AP, TS, TC)

### Ronda 2: Jurisdicción y Fuero
- ¿Qué CCAA está implicada?
- ¿Se aplica derecho foral? (PV, NC, GA)
- ¿Son relevantes las lenguas cooficiales? (CT, PV, GA, IB, VC)
- ¿Existe una cláusula de elección de fuero?

### Ronda 3: Prueba y Documentos
- ¿Qué documentos existen? (contratos, correos electrónicos, facturas, escritos judiciales)
- ¿Existen informes periciales?
- ¿Cuál es el estado de la recopilación probatoria?
- ¿Existen riesgos de prescripción o caducidad?

### Ronda 4: Objetivos Estratégicos
- ¿Cuál es el resultado deseado?
- ¿La transacción es una opción?
- ¿Cuál es el presupuesto para costas legales?
- ¿Cuál es la sensibilidad temporal?

### Ronda 5: Regulación y Cumplimiento
- ¿Intervienen reguladores? (CNMV, BdE, SEPBLAC, AEPD)
- ¿Existen cuestiones de protección de datos?
- ¿Existen requisitos de cumplimiento sectoriales?
- ¿Existen elementos transfronterizos?

## Puntuación de Complejidad (1–10)

| Puntuación | Descripción | Tamaño del panel | Esfuerzo estimado |
|-------|-------------|------------|-----------------|
| 1–2 | Consulta simple, cuestión única | 1–2 agentes | 1–2 horas |
| 3–4 | Asunto estándar, solo derecho estatal | 2–3 agentes | 2–4 horas |
| 5–6 | Multicuestión, posible derecho de CCAA | 3–4 agentes | 4–8 horas |
| 7–8 | Litigio complejo, solapamiento regulatorio | 4–5 agentes | 8–16 horas |
| 9–10 | Alta cuantía, multijurisdiccional, recursos | 5 agentes | 16+ horas |

**Factores de puntuación:**
- Número de dominios jurídicos implicados (+1 por dominio)
- Complejidad del derecho de CCAA (+2 si se aplica derecho foral)
- Solapamiento regulatorio (+1 por regulador)
- Nivel de recurso (+1 si TS, +2 si TC)
- Elementos transfronterizos (+1)
- Cuantía en disputa (+1 si > EUR 500.000)
- Urgencia (+1 si < 30 días)

## Construcción del Plan de Ejecución

### Estructura del Plan
```
# Plan de Ejecución
**Asunto:** [Materia]
**Complejidad:** [Puntuación]/10
**Panel:** [Skills de los agentes]
**Fecha:** [AAAA-MM-DD]

## Fase 1: Investigación y Análisis
- **Agente:** [Skill]
- **Tareas:** [Tareas de investigación específicas]
- **Entregable:** [Formato de salida]
- **Plazo:** [Cronograma relativo]

## Fase 2: Estrategia y Posicionamiento
- **Agente:** [Skill]
- **Tareas:** [Desarrollo de la estrategia]
- **Entregable:** [Formato de salida]
- **Plazo:** [Cronograma relativo]

## Fase 3: Prueba Adversarial
- **Agente:** [Skill]
- **Tareas:** [Prueba de estrés de las posiciones]
- **Entregable:** [Formato de salida]
- **Plazo:** [Cronograma relativo]

## Fase 4: Redacción
- **Agente:** [Skill]
- **Tareas:** [Preparación de documentos]
- **Entregable:** [Formato de salida]
- **Plazo:** [Cronograma relativo]

## Fase 5: Revisión y Consolidación
- **Agente:** [Skill]
- **Tareas:** [Revisión de calidad, resumen]
- **Entregable:** [Formato de salida]
- **Plazo:** [Cronograma relativo]

## Persistencia Entre Sesiones
- **ID de sesión:** [Identificador]
- **Estado:** [Investigación completada / Estrategia pendiente / Borrador pendiente]
- **Próxima acción:** [Qué reanudar]
```

## Soporte de Persistencia Entre Sesiones
- Asignar un identificador de sesión único
- Documentar las fases completadas y las tareas pendientes
- Almacenar los hallazgos clave y las citaciones para garantizar la continuidad
- Anotar cualquier pregunta que requiera input del usuario antes de reanudar

## Formato de Salida
```
# Informe de Briefing Legal
**Asunto:** [Materia]
**Fecha:** [AAAA-MM-DD]
**Aviso legal:** Este briefing tiene fines de planificación. La ejecución requiere un abogado colegiado español.

## 1. Resumen del Asunto
[Resumen de 2–3 frases]

## 2. Puntuación de Complejidad
**Puntuación:** [X]/10
**Justificación:** [Desglose de la puntuación]

## 3. Panel de Especialistas
| # | Skill | Rol | Tareas |
|---|-------|------|-------|
| 1 | [Skill] | [Rol] | [Tareas] |

## 4. Resultados del Cuestionamiento Adaptativo
- **Ronda 1 (ID del asunto):** [Hallazgos clave]
- **Ronda 2 (Jurisdicción):** [Hallazgos clave]
- **Ronda 3 (Prueba):** [Hallazgos clave]
- **Ronda 4 (Estrategia):** [Hallazgos clave]
- **Ronda 5 (Cumplimiento):** [Hallazgos clave]

## 5. Plan de Ejecución
[Plan por fases como el anterior]

## 6. Cuestiones Abiertas
- [Preguntas que requieren input del usuario antes de proceder]

## 7. Persistencia Entre Sesiones
- **ID de sesión:** [ID]
- **Estado:** [Listo para ejecutar / En espera de input del usuario]
- **Próximo paso:** [Acción]
```
