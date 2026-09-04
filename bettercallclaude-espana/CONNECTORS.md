# Integración de servidores MCP — CONNECTORS

BetterCallClaude España se integra con **12 servidores MCP**: 11 remotos a través del gateway `https://mcp.bettercallclaude.es` (transporte HTTP) y 1 local `ollama` (stdio, privacidad on-machine). Los servidores remotos exponen acceso directo a bases de datos jurídicas españolas: legislación estatal (BOE), jurisprudencia (CENDOJ, Tribunal Constitucional), derecho histórico, doctrina académica, derecho civil catalán, búsquedas agregadas y derecho UE aplicable en España; el servidor local realiza clasificación de privacidad y procesamiento LLM en la propia máquina para contenido privilegiado (Art. 24 LOPJ / Art. 542 CP).

Total: **11 servidores remotos (42 tools) + 1 local (`ollama`, 5 tools) = 12 servidores, 47 tools.**

## Panoramica

| Server | Propósito | Transporte |
|---|---|---|
| `boe-legislacion` | Búsqueda y recuperación de legislación estatal española (BOE — Boletín Oficial del Estado): texto consolidado, metadatos, índice, bloques y análisis jurídico | HTTP |
| `busqueda-general` | Búsqueda agregada en portales jurídicos generalistas: Pórtico Legal, Findiur y búsqueda multi-fuente | HTTP |
| `catalunya-legal` | Derecho civil catalán (Projecte Norma Civil, Universitat de Girona): búsqueda, comparación con el Código Civil español y recuperación de artículos | HTTP |
| `cendoj-jurisprudencia` | Jurisprudencia española del CENDOJ (Centro de Documentación Judicial): Tribunal Supremo, Audiencia Nacional, Audiencias Provinciales y juzgados inferiores | HTTP |
| `congreso-debates` | Actividad parlamentaria del Congreso de los Diputados: proyectos y proposiciones de ley, debates e intervenciones, seguimiento del estado legislativo | HTTP |
| `derecho-historico` | Derecho histórico español: Gaceta histórica (1661–1959) y legislación histórica (s. X a Isabel II) vía CEPC | HTTP |
| `doctrina-academica` | Doctrina académica jurídica de INDRET (UPF), Dialnet e IURIS Digital | HTTP |
| `eu-law-esp` | Derecho de la Unión Europea aplicable en España: EUR-Lex (directivas, reglamentos, decisiones) y Curia (jurisprudencia TJUE), más textos de Tratados UE | HTTP |
| `legal-citations-esp` | Validación, parseo, formateo, conversión y extracción de citas jurídicas españolas (lógica local, sin fuente externa) | HTTP |
| `legal-persona-esp` | Inteligencia jurídica para el ordenamiento español: redacción de documentos (demanda, recurso, contrato, informe…), análisis de casos, estrategia procesal e informes | HTTP |
| `tribunal-constitucional` | Sentencias del Tribunal Constitucional (STC, ATC, DTC) y búsqueda temática | HTTP |
| `ollama` | Procesamiento local de contenido privilegiado: clasificación de privacidad offline y LLM on-machine (generate/chat); **el contenido nunca sale de la máquina** | Local (stdio) |

### Configuracion

Los 11 servidores remotos se conectan automáticamente vía HTTP al gateway `https://mcp.bettercallclaude.es`. El archivo `.mcp.json` del plugin los declara todos y los registra al instalar desde el marketplace. **No requieren instalación local, Node.js ni claves API del usuario** para los servidores remotos. El servidor local `ollama` se lanza por stdio contra `${CLAUDE_PLUGIN_ROOT}/mcp-servers/ollama/dist/index.js`.

Tras instalar el plugin, ejecuta `/mcp` para verificar que los 12 servidores aparecen registrados. Si falta alguno, reinicia Claude Code o Cowork.

### Sin servidores MCP (modo reducido)

Si los servidores remotos están inaccesibles, el plugin degrada a **modo reducido**: las skills y comandos siguen funcionando con el conocimiento jurídico español integrado en el modelo, pero no pueden buscar en bases de datos en vivo, verificar la existencia de citas ni acceder a la legislación vigente. Las tareas sensibles a exactitud de fuente deben marcar sus citas como **no verificadas**. Ejecuta `/bettercallclaude-espana:setup` para diagnosticar la conectividad y el estado de cada servidor.

> Los servidores remotos usan `StreamableHTTPServerTransport` (HTTP con handshake `tools/list`). Confirma que tu backend soporta este protocolo.

---

## boe-legislacion

Legislación estatal española consolidada del **BOE (Boletín Oficial del Estado)**. Búsqueda full-text, recuperación por identificador BOE, navegación por bloques y análisis jurídico.

| Tool | Descripción |
|------|-------------|
| `search_boe` | Búsqueda de normas BOE con filtros: `query_text` (string, full-text en el texto de la norma), `titulo` (string, búsqueda en el título), `rango` (string, código de tipo: p. ej. `1300` Ley, `1400` Real Decreto), `departamento` (string, código del departamento emisor), `materia` (string, código de materia del vocabulario controlado), `numero_oficial` (string, p. ej. `40/2015`), `fecha_publicacion_desde` (string, `YYYYMMDD`), `fecha_publicacion_hasta` (string, `YYYYMMDD`), `fecha_disposicion_desde` (string, `YYYYMMDD`), `fecha_disposicion_hasta` (string, `YYYYMMDD`), `limit` (number, default `50`, `-1` para todos), `offset` (number, default `0`) |
| `get_legislacion` | Recupera la norma consolidada completa por identificador BOE. Parámetros: `id` (string, **requerido**; p. ej. `BOE-A-2015-10566`) — devuelve metadatos, análisis, metadatos ELI y texto consolidado |
| `get_metadatos` | Solo metadatos de la norma BOE. Parámetros: `id` (string, **requerido**) |
| `get_texto_consolidado` | Texto consolidado estructurado en bloques HTML (artículos, preámbulo, etc.). Parámetros: `id` (string, **requerido**) |
| `get_indice` | Índice de bloques/artículos de la norma. Parámetros: `id` (string, **requerido**) |
| `get_bloque` | Un bloque concreto (artículo, preámbulo, etc.) por `id_bloque`. Parámetros: `id` (string, **requerido**), `id_bloque` (string, **requerido**; p. ej. `a1`, `a2`, `pr`, `dd`, `df`) — usar `get_indice` primero |
| `get_analisis` | Análisis jurídico de la norma: materias, notas y referencias a normas anteriores/posteriores. Parámetros: `id` (string, **requerido**) |

## busqueda-general

Búsqueda agregada en portales jurídicos generalistas: **Pórtico Legal** (portal jurídico generalista) y **Findiur** (búsqueda jurídica con IA).

| Tool | Descripción |
|------|-------------|
| `search_portico` | Búsqueda en Pórtico Legal. Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |
| `search_findiur` | Búsqueda en Findiur. Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |
| `search_multi_source` | Búsqueda simultánea en Pórtico Legal y Findiur. Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |

## catalunya-legal

Derecho civil catalán (**Projecte Norma Civil**, Universitat de Girona) y comparación con el Código Civil español.

| Tool | Descripción |
|------|-------------|
| `search_norma_civil_cat` | Búsqueda en la normativa civil catalana. Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |
| `compare_catalan_spanish_civil` | Compara el derecho civil catalán con el Código Civil español para un artículo o tema. Parámetros: `articulo` (string, **requerido**) |
| `get_articulo_civil_cat` | Recupera un artículo concreto del derecho civil catalán. Parámetros: `id` (string, **requerido**) |

## cendoj-jurisprudencia

Jurisprudencia española del **CENDOJ (Centro de Documentación Judicial)**: Tribunal Supremo, Audiencia Nacional, Audiencias Provinciales y juzgados inferiores.

| Tool | Descripción |
|------|-------------|
| `search_jurisprudencia` | Búsqueda en sentencias del CENDOJ con filtros: `texto` (string, búsqueda libre), `tribunal` (string, nombre o código: p. ej. `TS`, `AN`, `AP Barcelona`), `fecha_desde` (string, `DD/MM/YYYY`), `fecha_hasta` (string, `DD/MM/YYYY`), `ecli` (string, identificador ECLI), `numero_roj` (string, número ROJ), `materia` (string), `limit` (number, default `10`) |
| `get_sentencia_by_ecli` | Recupera una sentencia por ECLI. Parámetros: `ecli` (string, **requerido**; p. ej. `ECLI:ES:TS:2020:599`) |
| `search_by_tribunal` | Búsqueda por tribunal con rango de fechas opcional. Parámetros: `tribunal` (string, **requerido**; p. ej. `Tribunal Supremo`, `Audiencia Nacional`, `AP Madrid`), `fecha_desde` (string, `DD/MM/YYYY`), `fecha_hasta` (string, `DD/MM/YYYY`), `limit` (number, default `10`) |

## congreso-debates

Actividad parlamentaria del **Congreso de los Diputados**: proyectos y proposiciones de ley, debates e intervenciones, seguimiento del estado legislativo.

| Tool | Descripción |
|------|-------------|
| `search_proyectos_ley` | Búsqueda de proyectos y proposiciones de ley con filtros: `texto` (string), `legislatura` (string, p. ej. `XV`), `tipo` (string: `proyecto_ley`, `proposicion_ley`, `proposicion_no_ley`), `limit` (number, default `10`) |
| `search_debates` | Búsqueda en debates e intervenciones parlamentarias. Parámetros: `texto` (string, **requerido**), `legislatura` (string), `limit` (number, default `10`) |
| `track_legislative_status` | Estado legislativo de un proyecto/proposición por número y año. Parámetros: `numero` (string, **requerido**), `anyo` (string, **requerido**) |

## derecho-historico

Derecho histórico español: **Gaceta histórica (1661–1959)** y **legislación histórica (s. X a Isabel II)** vía CEPC.

| Tool | Descripción |
|------|-------------|
| `search_gazeta_historica` | Búsqueda en la colección de la Gaceta histórica (1661–1959). Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |
| `search_legislacion_historica` | Búsqueda en legislación histórica (s. X a Isabel II). Parámetros: `query` (string, **requerido**), `limit` (number, default `10`) |
| `get_texto_historico` | Recupera un texto jurídico histórico por identificador. Parámetros: `id` (string, **requerido**) |

## doctrina-academica

Doctrina académica jurídica de **INDRET (UPF)**, **Dialnet** e **IURIS Digital**.

| Tool | Descripción |
|------|-------------|
| `search_doctrina` | Búsqueda de doctrina académica con filtro de fuente opcional. Parámetros: `query` (string, **requerido**), `source` (string: `indret`, `dialnet`, `iuris`; omitir para todas), `limit` (number, default `10`) |
| `search_by_autor` | Búsqueda por nombre de autor/a. Parámetros: `autor` (string, **requerido**), `limit` (number, default `10`) |

## eu-law-esp

Derecho de la Unión Europea aplicable en España. Acceso a **EUR-Lex** (directivas, reglamentos, decisiones) y **Curia** (jurisprudencia TJUE), más textos de los Tratados UE.

| Tool | Descripción |
|------|-------------|
| `search_eurlex` | Búsqueda en EUR-Lex (legislación UE). Parámetros: `query` (string, **requerido**; p. ej. `GDPR`, `consumer protection`), `lang` (string, código de idioma: `es`, `en`, `fr`, `de`; default `es`), `limit` (number, default `10`) |
| `get_eurlex_document` | Recupera un documento UE por CELEX. Parámetros: `celex` (string, **requerido**; p. ej. `32016R0679`), `lang` (string, default `es`) |
| `search_curia` | Búsqueda de jurisprudencia del TJUE en Curia. Parámetros: `query` (string, **requerido**; número de asunto o término: p. ej. `C-311/18`, `Schrems`), `lang` (string, default `es`), `limit` (number, default `10`) |
| `get_eu_treaty` | Texto de un Tratado UE. Parámetros: `treaty` (string, **requerido**: `tfeu`, `teu`, `euratom`, `charta-derechos-fundamentales`), `lang` (string, default `es`) |

## legal-citations-esp

Validación, parseo, formateo, conversión y extracción de citas jurídicas españolas. **Lógica local**, sin fuente externa — disponible incluso sin conectividad.

| Tool | Descripción |
|------|-------------|
| `validate_citation` | Valida si una cita jurídica española está bien formada. Soporta identificadores BOE, ECLI, Ley/Ley Orgánica, variantes de Real Decreto, sentencias (STS, STSJ, AN, AP, JPI), Circular, Orden y Resolución. Parámetros: `citation` (string, **requerido**; p. ej. `BOE-A-2015-10566`, `ECLI:ES:TS:2020:599`, `Ley 39/2015`) |
| `parse_citation` | Descompone una cita en sus componentes estructurados (tipo, forma normalizada, URL si disponible, número, año, órgano). Parámetros: `citation` (string, **requerido**) |
| `format_citation` | Formatea una cita en un estilo elegido. Parámetros: `citation` (string, **requerido**), `format` (string, **requerido**: `official`, `short`, `apa`) |
| `convert_to_ecli` | Convierte una cita de sentencia (p. ej. `STS 123/2020`) a su forma ECLI (`ECLI:ES:TS:2020:123`). Solo funciona con formatos de sentencia convertibles. Parámetros: `citation` (string, **requerido**) |
| `convert_to_boe_id` | Intenta convertir una cita a identificador BOE. Devuelve el BOE ID si la cita ya lo es; en caso contrario `null` (la conversión requiere lookup en base de datos). Parámetros: `citation` (string, **requerido**) |
| `extract_citations` | Extrae todas las citas jurídicas españolas de un texto. Parámetros: `text` (string, **requerido**) |

## legal-persona-esp

Inteligencia jurídica para el ordenamiento español: redacción de documentos (demanda, recurso, contrato, informe…), análisis de casos, estrategia procesal, informes jurídicos estructurados y respuesta a consultas. Devuelve prompts estructurados (system + user) que el LLM del cliente usa para generar el contenido.

| Tool | Descripción |
|------|-------------|
| `draft_documento` | Redacta un documento jurídico español. Parámetros: `tipo` (string, **requerido**: `demanda`, `escrito`, `contrato`, `recurso`, `informe`, `poder`, `memorial`, `providencia`, `minuta`, `carta`, `consulta`), `detalles` (string, **requerido**; descripción detallada: partes, hechos, fundamentos), `formato` (string: `completo` borrador pleno, o `esquema` solo estructura; default `completo`) |
| `analizar_caso` | Análisis jurídico estructurado de un caso (normativa aplicable, jurisprudencia, estrategia procesal, fortalezas/debilidades, acciones). Parámetros: `hechos` (string, **requerido**), `pretensiones` (string, **requerido**), `area_derecho` (string, **requerido**: `civil`, `penal`, `laboral`, `administrativo`, `mercantil`, `constitucional`), `jurisdiccion` (string: `civil`, `penal`, `social`, `contencioso-administrativo`, `mercantil`), `fase_procesal` (string: `previo`, `primera instancia`, `apelación`, `casación`, `ejecución`) |
| `estrategia_procesal` | Diseña una estrategia procesal (tribunal, vía procesal, cautelares, prueba, plazos, riesgos). Parámetros: `hechos` (string, **requerido**), `pretensiones` (string, **requerido**), `area_derecho` (string, **requerido**), `parte` (string, **requerido**: `demandante`, `demandado`, `querellante`, `imputado`, `recurrente`, `recurrido`), `presupuesto` (string, restricciones presupuestarias) |
| `redactar_informe` | Redacta un informe jurídico estructurado (dictamen) sobre una cuestión jurídica. Parámetros: `asunto` (string, **requerido**), `hechos` (string, **requerido**), `preguntas` (string, **requerido**; preguntas jurídicas concretas), `area_derecho` (string) |
| `responder_consulta` | Responde a una consulta jurídica general con respuesta estructurada (normativa, jurisprudencia, conclusión). Parámetros: `consulta` (string, **requerido**), `contexto` (string), `area_derecho` (string) |

## tribunal-constitucional

Sentencias del **Tribunal Constitucional**: tipos `STC` (sentencia), `ATC` (auto), `DTC` (declaración).

| Tool | Descripción |
|------|-------------|
| `search_sentencias_tc` | Búsqueda de sentencias del TC con filtros: `texto` (string), `numero` (string, número de decisión), `anyo` (string), `tipo` (string: `STC`, `ATC`, `DTC`), `materia` (string), `limit` (number, default `10`) |
| `get_sentencia_tc` | Recupera una decisión del TC por número y año. Parámetros: `numero` (string, **requerido**), `anyo` (string, **requerido**) |
| `search_by_tema` | Búsqueda por materia/tema. Parámetros: `tema` (string, **requerido**), `limit` (number, default `10`) |

## ollama

Procesamiento local de contenido jurídico español: **clasificación de privacidad offline** y **LLM on-machine** para contenido privilegiado. El contenido **nunca sale de la máquina**: este servidor corre en `stdio` contra `${CLAUDE_PLUGIN_ROOT}/mcp-servers/ollama/dist/index.js` y aplica las garantías de los Art. 24 LOPJ y Art. 542 CP (secreto profesional). Todos los tools llevan el prefijo `ollama_`.

| Tool | Descripción |
|------|-------------|
| `ollama_check_status` | Comprueba si Ollama está corriendo en local: estado online, versión, modelos instalados con tamaños y recomendaciones para tareas jurídicas españolas. Úsalo antes de `ollama_generate` o `ollama_chat`. Parámetros: ninguno |
| `ollama_generate` | Generación local con Ollama para contenido **PRIVILEGED** (Art. 24 LOPJ / Art. 542 CP) que no debe viajar a APIs en la nube: comunicaciones abogado-cliente, opiniones jurídicas, estrategia procesal. Requiere Ollama en local (`ollama serve`). Parámetros: `model` (string, **requerido**), `prompt` (string, **requerido**), `system_prompt` (string), `temperature` (number 0.0–2.0), `max_tokens` (number) |
| `ollama_chat` | Chat multi-turno con historial de mensajes sobre contenido privilegiado. Requiere Ollama en local. Parámetros: `model` (string, **requerido**), `messages` (array, **requerido**: `{role: system|user|assistant, content}`), `temperature` (number 0.0–2.0), `max_tokens` (number) |
| `ollama_classify_privacy` | Clasifica texto por nivel de privacidad jurídica española mediante detección de patrones (`PRIVILEGED`, `CONFIDENTIAL`, `PUBLIC`). Funciona **100% offline** — no requiere Ollama ni conexión a red. Detecta: secreto profesional, secreto de las comunicaciones, secreto del abogado, privilegio de la defensa, Art. 24 LOPJ, Art. 542 CP, attorney-client privilege, etc. Devuelve nivel, patrones detectados y guía de enrutamiento (qué puede viajar a la nube y qué no). Parámetros: `text` (string, **requerido**) |
| `ollama_list_models` | Lista los modelos Ollama instalados (nombre, tamaño, cuantización) con recomendaciones por tarea jurídica: análisis legal (modelos grandes: mixtral, llama3), clasificación rápida (pequeños: phi, gemma), multilingüe ES/EN (aya, qwen), embeddings documentales. Requiere Ollama en local. Parámetros: ninguno |

---

*Servidores remotos verificados contra la superficie desplegada vía handshakes MCP `tools/list` (2026-09-04); el servidor local `ollama` verificado contra el código incluido en el plugin (`mcp-servers/ollama`, `src` y `dist`). El inventario machine-readable de tools vive en `docs/MCP_TOOLS.md` del repositorio y es la fuente de verdad para los scripts `scripts/generate-tool-frontmatter.js` y `scripts/check-tool-names.js`.*