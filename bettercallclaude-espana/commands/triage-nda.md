---
description: "Triage de NDA según el derecho español — clasifica como GREEN (estándar) / YELLOW (revisión) / RED (problemas) usando umbrales del playbook y criterios legales españoles. Soporta archivo único o lote (carpeta)."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__boe-legislacion__search_boe
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__boe-legislacion__get_legislacion
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__legal-citations-esp__validate_citation
  - mcp__legal-citations-esp__parse_citation
  - mcp__legal-citations-esp__format_citation
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_classify_privacy
  - mcp__ollama__ollama_list_models
  - Task
---

# Triage NDA — Derecho Español

Eres invocado mediante `/bettercallclaude-espana:triage-nda`. Aplica la skill `spanish-document-analysis` en **modo triage NDA** para analizar uno o más NDA según los criterios del derecho español y el playbook local del usuario.

**Convención de salida**: escribe los informes de triage en `bcc-output/YYYY-MM-DD-<slug>/triage-nda-<doc>.md`. En modo lote, escribe también una tabla resumen. En chat muestra solo el veredicto (GREEN/YELLOW/RED) con un resumen de 2-3 líneas por NDA. Ver `skills/shared/SKILL.md`.

**Ámbito del plugin**: usa exclusivamente agentes, skills y servidores MCP de BetterCallClaude España para todo el trabajo legal. No delegues a skills o agentes externos al plugin. La lectura de archivos y las operaciones de sistema están exentas.

## Carga del Playbook

Antes de iniciar el triage, busca el playbook local en el orden de precedencia:
1. `.claude/bettercallclaude-espana.local.md`
2. `bettercallclaude-espana.local.md` en la carpeta compartida
3. `.claude/legal.local.md` (compatibilidad Anthropic)
4. Ningún archivo encontrado → usa los defaults españoles y nota: *"Ningún playbook local encontrado. Uso los defaults españoles. Crea un `bettercallclaude-espana.local.md` para umbrales personalizados — ver `templates/` para ejemplos."*

Extrae del playbook:
- Duración máxima aceptable del NDA
- Ámbito de la definición de "información confidencial"
- Umbrales de cláusula penal (Art. 1152–1154 CC)
- Preferencias de ley aplicable y foro
- Reglas y umbrales de escalada

## Archivo Único vs. Modo Lote

- **Archivo único**: el usuario proporciona un NDA → produce un informe de triage completo.
- **Modo lote**: el usuario proporciona una carpeta o varios archivos → produce una **tabla resumen** (archivo | veredicto | cuestiones clave) seguida de informes individuales por cada NDA.

Detecta el modo lote cuando la entrada referencie una ruta de carpeta, varios archivos, o use patrones glob.

## Clasificación de Triage (Criterios Españoles)

### GREEN — Aprobación Estándar
Todos los siguientes:
- Ley aplicable: derecho español
- Foro competente: Juzgados/TSJ españoles
- Duración: dentro del umbral del playbook (default: 5 años si no hay playbook)
- Obligaciones: recíprocas (NDA bilateral)
- Ninguna cláusula penal anómala
- Perímetro de confidencialidad: estándar
- Ningún conflicto con normas imperativas

### YELLOW — Revisión Legal Recomendada
Uno o más de los siguientes:
- Ley aplicable: derecho extranjero pero foro alcanzable (Reglamento (UE) 1215/2012 — Bruselas I bis)
- Cláusula penal presente pero dentro de umbrales del playbook (Art. 1152–1154 CC)
- Duración excede el umbral del playbook
- Cláusulas de no solicitación presentes (sin equivalente estatutario exacto en España — criterio jurisprudencial)
- Asimetrías significativas entre las partes
- NDA unilateral (una sola parte obligada)

### RED — Problemas Sustanciales
Uno o más de los siguientes:
- Renuncia a derechos irrenunciables (normas imperativas — CE arts. 9, 10, 14, 38; principios generales del CC)
- Garantías o indemnizaciones ilimitadas
- Cláusula de no responsabilidad por dolo o culpa grave (Art. 1102 CC)
- Foro exótico fuera del Reglamento (UE) 1215/2012 sin razones de negocio
- Pactos de no competencia problemáticos (Arts. 1411–1419 ET, contexto laboral)
- Violaciones evidentes del RGPD (es. transferencia de datos transfronteriza sin garantías adecuadas)
- Obligaciones de confidencialidad perpetuas o irrevocables sin excepciones razonables (la jurisprudencia del TS sobre perpetuidades marca automáticamente RED)

## Formato de Salida

### Informe NDA Único

```
## Informe Triage NDA

**Archivo**: [filename]
**Veredicto**: [GREEN / YELLOW / RED] — [motivación 2-3 frases]

### Análisis Cláusula por Cláusula
| Cláusula | Valoración | Base Jurídica | Redline Sugerida |
|----------|-----------|---------------|------------------|
| Ley aplicable | [valoración] | [referencia] | [si aplica] |
| Foro competente | [valoración] | [referencia] | [si aplica] |
| Duración | [valoración] | [referencia] | [si aplica] |
| Perímetro de confidencialidad | [valoración] | [referencia] | [si aplica] |
| Cláusula penal | [valoración] | Art. 1152–1154 CC | [si aplica] |
| No solicitación | [valoración] | [referencia] | [si aplica] |
| No competencia | [valoración] | Arts. 1411–1419 ET | [si aplica] |
| Responsabilidad / Indemnización | [valoración] | Art. 1102 CC | [si aplica] |
| Protección de datos | [valoración] | RGPD (Reg. (UE) 2016/679) + LO 3/2018 | [si aplica] |
| Resolución | [valoración] | Art. 1504 CC | [si aplica] |

### Escalada (solo YELLOW/RED)
[Lista de elementos que requieren revisión humana según las reglas de escalada del playbook]

### Verificación de Fuentes
[Referencias verificadas vía boe-legislacion: lista. Referencias no verificadas marcadas en consecuencia.]
```

### Tabla Resumen de Lote

```
## Triage NDA Lote — Resumen

| # | Archivo | Veredicto | Cuestiones Clave |
|---|---------|-----------|------------------|
| 1 | [nombre] | GREEN/YELLOW/RED | [síntesis] |
| 2 | [nombre] | GREEN/YELLOW/RED | [síntesis] |
| ... | ... | ... | ... |

[Informes individuales siguen debajo]
```

## Verificación de Fuentes

Verifica los referidos normativos citados vía MCP `boe-legislacion` cuando el servidor esté disponible. Si no está, marca los referidos como *"(no verificado)"*.

## Anulación de Derecho Imperativo

Si el playbook contiene posiciones en conflicto con normas imperativas españolas, señálalas explícitamente:
> **Atención**: la posición del playbook "[posición]" está en conflicto con [norma imperativa]. La norma imperativa prevalece — esta posición del playbook no se aplica.

---

## Consulta del Usuario

$ARGUMENTS
