---
description: "Diagnóstico de servidores MCP — prueba cada servidor, informa del estado y del impacto en lenguaje sencillo, sugiere soluciones a los problemas."
tools:
  - Read
  - Grep
  - Glob
  - Bash
  - WebSearch
  - WebFetch
  - Task
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_sentencias_tc
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__search_eurlex
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__draft_documento
  - mcp__plugin_bettercallclaude-espana_congreso-debates__search_debates
  - mcp__plugin_bettercallclaude-espana_doctrina-academica__search_doctrina
  - mcp__plugin_bettercallclaude-espana_derecho-historico__search_legislacion_historica
  - mcp__plugin_bettercallclaude-espana_catalunya-legal__search_norma_civil_cat
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_portico
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy
  - mcp__boe-legislacion__search_boe
  - mcp__cendoj-jurisprudencia__search_jurisprudencia
  - mcp__tribunal-constitucional__search_sentencias_tc
  - mcp__eu-law-esp__search_eurlex
  - mcp__legal-citations-esp__validate_citation
  - mcp__legal-persona-esp__draft_documento
  - mcp__congreso-debates__search_debates
  - mcp__doctrina-academica__search_doctrina
  - mcp__derecho-historico__search_legislacion_historica
  - mcp__catalunya-legal__search_norma_civil_cat
  - mcp__busqueda-general__search_portico
  - mcp__ollama__ollama_check_status
  - mcp__ollama__ollama_classify_privacy
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_metadatos
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_indice
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_bloque
  - mcp__plugin_bettercallclaude-espana_boe-legislacion__get_analisis
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_findiur
  - mcp__plugin_bettercallclaude-espana_busqueda-general__search_multi_source
  - mcp__plugin_bettercallclaude-espana_catalunya-legal__compare_catalan_spanish_civil
  - mcp__plugin_bettercallclaude-espana_catalunya-legal__get_articulo_civil_cat
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_by_tribunal
  - mcp__plugin_bettercallclaude-espana_congreso-debates__search_proyectos_ley
  - mcp__plugin_bettercallclaude-espana_congreso-debates__track_legislative_status
  - mcp__plugin_bettercallclaude-espana_derecho-historico__search_gazeta_historica
  - mcp__plugin_bettercallclaude-espana_derecho-historico__get_texto_historico
  - mcp__plugin_bettercallclaude-espana_doctrina-academica__search_by_autor
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eurlex_document
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__search_curia
  - mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eu_treaty
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_ecli
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_boe_id
  - mcp__plugin_bettercallclaude-espana_legal-citations-esp__extract_citations
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__analizar_caso
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__estrategia_procesal
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__redactar_informe
  - mcp__plugin_bettercallclaude-espana_legal-persona-esp__responder_consulta
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__get_sentencia_tc
  - mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_by_tema
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_generate
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_chat
  - mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models
  - mcp__boe-legislacion__get_legislacion
  - mcp__boe-legislacion__get_metadatos
  - mcp__boe-legislacion__get_texto_consolidado
  - mcp__boe-legislacion__get_indice
  - mcp__boe-legislacion__get_bloque
  - mcp__boe-legislacion__get_analisis
  - mcp__busqueda-general__search_findiur
  - mcp__busqueda-general__search_multi_source
  - mcp__catalunya-legal__compare_catalan_spanish_civil
  - mcp__catalunya-legal__get_articulo_civil_cat
  - mcp__cendoj-jurisprudencia__get_sentencia_by_ecli
  - mcp__cendoj-jurisprudencia__search_by_tribunal
  - mcp__congreso-debates__search_proyectos_ley
  - mcp__congreso-debates__track_legislative_status
  - mcp__derecho-historico__search_gazeta_historica
  - mcp__derecho-historico__get_texto_historico
  - mcp__doctrina-academica__search_by_autor
  - mcp__eu-law-esp__get_eurlex_document
  - mcp__eu-law-esp__search_curia
  - mcp__eu-law-esp__get_eu_treaty
  - mcp__legal-citations-esp__parse_citation
  - mcp__legal-citations-esp__format_citation
  - mcp__legal-citations-esp__convert_to_ecli
  - mcp__legal-citations-esp__convert_to_boe_id
  - mcp__legal-citations-esp__extract_citations
  - mcp__legal-persona-esp__analizar_caso
  - mcp__legal-persona-esp__estrategia_procesal
  - mcp__legal-persona-esp__redactar_informe
  - mcp__legal-persona-esp__responder_consulta
  - mcp__tribunal-constitucional__get_sentencia_tc
  - mcp__tribunal-constitucional__search_by_tema
  - mcp__ollama__ollama_generate
  - mcp__ollama__ollama_chat
  - mcp__ollama__ollama_list_models
---

# BetterCallClaude España — Diagnóstico

Eres invocado mediante `/bettercallclaude-espana:doctor`. Diagnostica el estado de todos los servidores MCP de BetterCallClaude España e informa de los resultados en lenguaje sencillo.

## Paso 1: Verificación de la pasarela

Verifica la pasarela HTTP MCP:

- Haz una petición `HEAD https://mcp.bettercallclaude.es/`.
- Si obtienes un código 2xx o 3xx, anota "Pasarela en línea".
- Si falla, anota "Pasarela no alcanzable" y el impacto probable.

Nota: esta comprobación verifica la accesibilidad de la base de la pasarela, no cada uno de los 11 servidores remotos — para eso está el Paso 2.

## Paso 2: Verificación de Cada Servidor

Para cada uno de los 12 servidores MCP, usa un **enfoque de dos etapas**:

**Etapa A — Disponibilidad del tool**: Comprueba si el tool del servidor aparece en la lista de tools disponibles. Si no aparece, marca el servidor como "no conectado" de inmediato.

**Etapa B — Llamada ligera** (solo si la Etapa A tuvo éxito): Haz una llamada mínima para confirmar la capacidad de respuesta.

| Servidor | Qué proporciona | Llamada de prueba |
|----------|-----------------|-------------------|
| boe-legislacion | Legislación estatal (BOE, consolidada) | `search_boe` (mínima) |
| cendoj-jurisprudencia | Jurisprudencia TS/AP/TSJ (CENDOJ) | `search_jurisprudencia` (mínima) |
| tribunal-constitucional | Sentencias del Tribunal Constitucional | `search_sentencias_tc` (mínima) |
| eu-law-esp | Derecho UE en español (EUR-Lex) | `search_eurlex` (mínima) |
| legal-citations-esp | Validación y formateo de citas | `validate_citation` (mínima) |
| legal-persona-esp | Generación de documentos y cálculo de plazos | `draft_documento` (mínima) |
| congreso-debates | Proyectos de ley, debates y estado de tramitación | `search_debates` (mínima) |
| doctrina-academica | Doctrina académica y búsqueda de autores | `search_doctrina` (mínima) |
| derecho-historico | Legislación histórica (BOE/Gazeta histórica) | `search_legislacion_historica` (mínima) |
| catalunya-legal | Derecho civil catalán (DOGC, TSJC) | `search_norma_civil_cat` (mínima) |
| busqueda-general | Búsqueda transversal (Pórtico, Findiur) | `search_portico` (mínima) |
| ollama (local, stdio) | LLM local + clasificación de privacidad offline | Solo Etapa A — los propios tools son la sonda |

**Matiz sobre ollama** (servidor local):

- `ollama_check_status` requiere el demonio de Ollama en marcha: si el tool aparece en la lista (Etapa A) pero la llamada falla, marca "configurado pero no responde" — un estado degradado distinto de "no conectado".
- `ollama_classify_privacy` funciona 100% offline: basta con que el tool aparezca en la lista para marcarlo como "configurado".

## Paso 3: Sondeo de la Ruta de Agente

Los Pasos 1–2 verifican los conectores desde la **sesión principal**. Este paso verifica la **ruta de agente** — la vía que se rompió en la release suiza v4.11.5, cuando los agentes del plugin no veían ningún tool MCP ("No such tool available: mcp__normattiva__…") mientras la sesión principal funcionaba con normalidad.

Despacha el agente especialista en citas del plugin vía Task (usa el nombre con ámbito, es. `bettercallclaude-espana:spanish-citation-expert`) con exactamente este prompt:

> Llama al tool MCP del servidor legal-citations-esp cuyo nombre termina en `validate` con la cita "STS 12345/2020". No uses ningún otro tool. Informa SOLO de: (1) el nombre exacto del tool llamado, (2) "OK" más la cita devuelta, o el mensaje de error literal.

Interpreta el resultado:

- El agente informa de un nombre de tool + "OK" → ruta de agente sana; anota "Ruta de agente: OK".
- El agente informa de "No such tool available" (o no encuentra ningún tool MCP del servidor legal-citations-esp) → **ruta de agente rota**: los agentes del plugin no alcanzan los conectores aunque la sesión principal pueda. Dile al usuario que actualice BetterCallClaude España a la última versión y que vuelva a ejecutar `/bettercallclaude-espana:doctor`; si el problema persiste, que lo notifique en https://github.com/fedec65/bettercallclaude-espana/issues incluyendo esta salida.
- El tool Task no está disponible en el contexto actual (p. ej. dentro de una sesión anidada) → marca la ruta como "no verificable" y sugiere volver a ejecutar `/bettercallclaude-espana:doctor` en una sesión principal limpia.

## Paso 4: Mostrar Resultados

Presenta los resultados en la lengua del usuario, sin jerga técnica. Ejemplo:

```
╔══════════════════════════════════════════════════════════╗
  BetterCallClaude España — Diagnóstico de Servicios
╠══════════════════════════════════════════════════════════╣

  Servicio                          Estado        Impacto si ausente
  ─────────                          ──────        ──────────────────
  Legislación estatal (BOE)          ✓ activo      —
  Jurisprudencia TS/AP/TSJ (CENDOJ)  ⚠ degradado   Búsqueda de precedentes solo manual
  Tribunal Constitucional            ✓ activo      —
  Derecho UE (EUR-Lex)               ✓ activo      —
  Validación de citas                ✓ activo      —
  Generación de documentos           ✓ activo      —
  Proyectos de ley y debates         ✓ activo      —
  Doctrina académica                 ✓ activo      —
  Derecho histórico                  ✓ activo      —
  Derecho civil catalán              ✓ activo      —
  Búsqueda transversal (Pórtico)     ✓ activo      —
  LLM local + privacidad             ✓ activo      —

  Servicios activos: 11/12
  Ruta de agente (MCP vía subagente): ✓ operativa

╚══════════════════════════════════════════════════════════╝
```

Usa símbolos claros: ✓ activo, ⚠ degradado, ✗ no conectado.

## Paso 5: Guía

### Todos los servidores activos:
> Todos los servicios están operativos. BetterCallClaude España funciona a plena capacidad.

### Algunos servidores no disponibles:
Para cada servidor no disponible, explica en lenguaje sencillo:

| Servidor | Impacto si no está disponible |
|----------|-------------------------------|
| boe-legislacion | Los textos legales no se recuperan en tiempo real. Las citas de artículos se basan en los conocimientos del modelo. Consultar: boe.es |
| cendoj-jurisprudencia | La búsqueda de jurisprudencia del TS/AP/TSJ no está disponible. Consultar: CENDOJ (poderjudicial.es) |
| tribunal-constitucional | La búsqueda de sentencias del TC no está disponible. Consultar: tribunalconstitucional.es |
| eu-law-esp | El derecho UE en español no es accesible automáticamente. Consultar: eur-lex.europa.eu |
| legal-citations-esp | Las citas no se validan automáticamente — verificar manualmente. |
| legal-persona-esp | La generación automática de documentos legales no está disponible vía MCP. |
| congreso-debates | El seguimiento de proyectos de ley y debates no está disponible. Consultar: congreso.es |
| doctrina-academica | La búsqueda en doctrina académica no está disponible. |
| derecho-historico | La legislación histórica (BOE/Gazeta histórica) no está disponible. |
| catalunya-legal | La búsqueda en derecho civil catalán (DOGC/TSJC) no está disponible. |
| busqueda-general | La búsqueda transversal (Pórtico, Findiur) no está disponible. |
| ollama (local) | La clasificación de privacidad offline y el LLM local no están disponibles — todo el contenido se enruta por servidores cloud. |

Nota: la verificación de la existencia de las citas en España se realiza vía `legal-citations-esp` (`validate_citation`); la verificación de contenido de fondo corresponde a la skill `citation-content-verify`.

### Correcciones sugeridas:
> Si un servicio resulta no disponible:
> 1. Reiniciar Cowork Desktop (o Claude Code)
> 2. Verificar la conexión a internet
> 3. Volver a ejecutar `/bettercallclaude-espana:doctor` pasados unos minutos
> 4. Si el problema persiste, el servicio podría estar temporalmente offline — en los portales con protección anti-bot (TS, TC), es un comportamiento esperado

### Pasarela no alcanzable:
> La pasarela MCP no es alcanzable.
> Causas posibles: falta de conexión a internet, bloqueo del firewall, servicio temporalmente no disponible.
> BetterCallClaude España funciona en modo reducido: los análisis se basan en los conocimientos del modelo sin acceso a las bases de datos.

## Referencia de Errores del Backend

| Error | Causa probable | Solución |
|-------|----------------|----------|
| HTTP 429 | Demasiadas peticiones | Esperar un momento y reintentar |
| Timeout / HTTP 5xx | Servicio temporalmente no disponible | Reintentar más tarde |
| ECONNREFUSED | El servidor no alcanza la API externa | Verificar la conexión a internet |
| 0 resultados | Consulta sin coincidencias o anti-bot activo | Probar términos de búsqueda más amplios o consultar directamente el portal |

---

## Consulta del Usuario

$ARGUMENTS
