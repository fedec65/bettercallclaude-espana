# Mapping Consulta Refinada → Workflow

Tras el refinamiento de la consulta, recomienda el workflow óptimo según el tipo de cuestión:

| Tipo de Cuestión | Comando Recomendado | Cuándo |
|------------------|---------------------|-------|
| Investigación legislativa / precedentes | `/investigacion` | Pregunta sobre qué dice la ley |
| Estrategia procesal | `/estrategia` | Evaluación de riesgo, probabilidad |
| Redacción de documento | `/borrador` | Contrato, escrito, dictamen |
| Análisis de documento existente | `/analizar-doc` | Review de contrato, verificación de escrito |
| Triage NDA | `/triage-nda` | NDA pendiente de clasificar |
| Cuestión compleja end-to-end | `/legal-5step` | Pipeline completa necesaria |
| Multidominio con plan | `/briefing` | ≥ 3 dominios, plan de ejecución |
| Traducción jurídica | `/traducir` | ES ↔ EN con precisión terminológica |
| Análisis adversarial | `/analisis-adversarial` | Stress test de la argumentación |
| Cadena de precedentes | `/precedente` | Evolución jurisprudencial |
| Reconstrucción de cronología | `/cronologia-legal` | Línea temporal de hechos con plazos |

## Señales para Pipeline Completa (legal-5step)

Recomienda `/legal-5step` cuando:
- La cuestión requiere tanto investigación como estrategia y redacción
- El usuario pide un "dictamen completo" o "análisis de cero a documento"
- Son necesarios quality gates entre fases
- El usuario quiere trazabilidad completa de las fuentes
