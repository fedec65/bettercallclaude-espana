# MCP Tool Inventory — BetterCallClaude España

**CORRECTED 2026-09-04** — the first version of this inventory was derived from `bettercallclaude-espana/CONNECTORS.md` and is superseded. CONNECTORS.md documents tool names that **do not exist** on the deployed servers. The true source of truth is the server implementations in [`fedec65/BetterCallClaudeMCP_Espana`](https://github.com/fedec65/BetterCallClaudeMCP_Espana) (`mcp-servers/<server>/src/server.ts`), verified live via MCP `tools/list` handshakes against `https://mcp.bettercallclaude.es` (probed 2026-09-04: `legal-citations-esp` and `boe-legislacion` both match the repo exactly).

**UPDATED 2026-09-04 (t16)** — the `ollama` entry in the first correction was itself wrong: it was derived from the old CONNECTORS.md, and the live probes covered only the remote gateway servers. The plugin bundles ollama at `bettercallclaude-espana/mcp-servers/ollama` (verified against both `src/index.ts` and `dist/index.js`): it exposes **5 tools, all prefixed `ollama_`**. The unprefixed `translate`/`summarize` tools do not exist.

**UPDATED 2026-09-05 (Map D / t32)** — added the `workflows-esp` server (persistent multi-agent workflows; IT `workflows-ita` parity). Inventory derived from the implementation in [`fedec65/BetterCallClaudeMCP_Espana`](https://github.com/fedec65/BetterCallClaudeMCP_Espana) (`mcp-servers/workflows/src/server.ts`): **9 tools**. `claim_user_id`, `list_agents` and `validate_pipeline` are live; the other six (`save_workflow`, `list_workflows`, `get_workflow`, `delete_workflow`, `log_run`, `delete_user`) are registered stubs returning `not_implemented` until the full integration release. Deployment of `/workflows-esp/mcp` on the gateway is pending.

Consumed by `scripts/generate-tool-frontmatter.js` (parity floor script) and `scripts/check-tool-names.js` (parity guard). Do not edit the `SERVER_TOOLS` map by hand — re-derive from this file when tools change.

Total: **12 remote servers (51 tools) + 1 local (`ollama`, 5 tools) = 13 servers, 56 tools.**

## Tool map

| Server | Tool | Scoped form | Bare form |
|---|---|---|---|
| `boe-legislacion` | `search_boe` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__search_boe` | `mcp__boe-legislacion__search_boe` |
| `boe-legislacion` | `get_legislacion` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_legislacion` | `mcp__boe-legislacion__get_legislacion` |
| `boe-legislacion` | `get_metadatos` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_metadatos` | `mcp__boe-legislacion__get_metadatos` |
| `boe-legislacion` | `get_texto_consolidado` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_texto_consolidado` | `mcp__boe-legislacion__get_texto_consolidado` |
| `boe-legislacion` | `get_indice` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_indice` | `mcp__boe-legislacion__get_indice` |
| `boe-legislacion` | `get_bloque` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_bloque` | `mcp__boe-legislacion__get_bloque` |
| `boe-legislacion` | `get_analisis` | `mcp__plugin_bettercallclaude-espana_boe-legislacion__get_analisis` | `mcp__boe-legislacion__get_analisis` |
| `busqueda-general` | `search_portico` | `mcp__plugin_bettercallclaude-espana_busqueda-general__search_portico` | `mcp__busqueda-general__search_portico` |
| `busqueda-general` | `search_findiur` | `mcp__plugin_bettercallclaude-espana_busqueda-general__search_findiur` | `mcp__busqueda-general__search_findiur` |
| `busqueda-general` | `search_multi_source` | `mcp__plugin_bettercallclaude-espana_busqueda-general__search_multi_source` | `mcp__busqueda-general__search_multi_source` |
| `catalunya-legal` | `search_norma_civil_cat` | `mcp__plugin_bettercallclaude-espana_catalunya-legal__search_norma_civil_cat` | `mcp__catalunya-legal__search_norma_civil_cat` |
| `catalunya-legal` | `compare_catalan_spanish_civil` | `mcp__plugin_bettercallclaude-espana_catalunya-legal__compare_catalan_spanish_civil` | `mcp__catalunya-legal__compare_catalan_spanish_civil` |
| `catalunya-legal` | `get_articulo_civil_cat` | `mcp__plugin_bettercallclaude-espana_catalunya-legal__get_articulo_civil_cat` | `mcp__catalunya-legal__get_articulo_civil_cat` |
| `cendoj-jurisprudencia` | `search_jurisprudencia` | `mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_jurisprudencia` | `mcp__cendoj-jurisprudencia__search_jurisprudencia` |
| `cendoj-jurisprudencia` | `get_sentencia_by_ecli` | `mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__get_sentencia_by_ecli` | `mcp__cendoj-jurisprudencia__get_sentencia_by_ecli` |
| `cendoj-jurisprudencia` | `search_by_tribunal` | `mcp__plugin_bettercallclaude-espana_cendoj-jurisprudencia__search_by_tribunal` | `mcp__cendoj-jurisprudencia__search_by_tribunal` |
| `congreso-debates` | `search_proyectos_ley` | `mcp__plugin_bettercallclaude-espana_congreso-debates__search_proyectos_ley` | `mcp__congreso-debates__search_proyectos_ley` |
| `congreso-debates` | `search_debates` | `mcp__plugin_bettercallclaude-espana_congreso-debates__search_debates` | `mcp__congreso-debates__search_debates` |
| `congreso-debates` | `track_legislative_status` | `mcp__plugin_bettercallclaude-espana_congreso-debates__track_legislative_status` | `mcp__congreso-debates__track_legislative_status` |
| `derecho-historico` | `search_gazeta_historica` | `mcp__plugin_bettercallclaude-espana_derecho-historico__search_gazeta_historica` | `mcp__derecho-historico__search_gazeta_historica` |
| `derecho-historico` | `search_legislacion_historica` | `mcp__plugin_bettercallclaude-espana_derecho-historico__search_legislacion_historica` | `mcp__derecho-historico__search_legislacion_historica` |
| `derecho-historico` | `get_texto_historico` | `mcp__plugin_bettercallclaude-espana_derecho-historico__get_texto_historico` | `mcp__derecho-historico__get_texto_historico` |
| `doctrina-academica` | `search_doctrina` | `mcp__plugin_bettercallclaude-espana_doctrina-academica__search_doctrina` | `mcp__doctrina-academica__search_doctrina` |
| `doctrina-academica` | `search_by_autor` | `mcp__plugin_bettercallclaude-espana_doctrina-academica__search_by_autor` | `mcp__doctrina-academica__search_by_autor` |
| `eu-law-esp` | `search_eurlex` | `mcp__plugin_bettercallclaude-espana_eu-law-esp__search_eurlex` | `mcp__eu-law-esp__search_eurlex` |
| `eu-law-esp` | `get_eurlex_document` | `mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eurlex_document` | `mcp__eu-law-esp__get_eurlex_document` |
| `eu-law-esp` | `search_curia` | `mcp__plugin_bettercallclaude-espana_eu-law-esp__search_curia` | `mcp__eu-law-esp__search_curia` |
| `eu-law-esp` | `get_eu_treaty` | `mcp__plugin_bettercallclaude-espana_eu-law-esp__get_eu_treaty` | `mcp__eu-law-esp__get_eu_treaty` |
| `legal-citations-esp` | `validate_citation` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__validate_citation` | `mcp__legal-citations-esp__validate_citation` |
| `legal-citations-esp` | `parse_citation` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__parse_citation` | `mcp__legal-citations-esp__parse_citation` |
| `legal-citations-esp` | `format_citation` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__format_citation` | `mcp__legal-citations-esp__format_citation` |
| `legal-citations-esp` | `convert_to_ecli` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_ecli` | `mcp__legal-citations-esp__convert_to_ecli` |
| `legal-citations-esp` | `convert_to_boe_id` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__convert_to_boe_id` | `mcp__legal-citations-esp__convert_to_boe_id` |
| `legal-citations-esp` | `extract_citations` | `mcp__plugin_bettercallclaude-espana_legal-citations-esp__extract_citations` | `mcp__legal-citations-esp__extract_citations` |
| `legal-persona-esp` | `draft_documento` | `mcp__plugin_bettercallclaude-espana_legal-persona-esp__draft_documento` | `mcp__legal-persona-esp__draft_documento` |
| `legal-persona-esp` | `analizar_caso` | `mcp__plugin_bettercallclaude-espana_legal-persona-esp__analizar_caso` | `mcp__legal-persona-esp__analizar_caso` |
| `legal-persona-esp` | `estrategia_procesal` | `mcp__plugin_bettercallclaude-espana_legal-persona-esp__estrategia_procesal` | `mcp__legal-persona-esp__estrategia_procesal` |
| `legal-persona-esp` | `redactar_informe` | `mcp__plugin_bettercallclaude-espana_legal-persona-esp__redactar_informe` | `mcp__legal-persona-esp__redactar_informe` |
| `legal-persona-esp` | `responder_consulta` | `mcp__plugin_bettercallclaude-espana_legal-persona-esp__responder_consulta` | `mcp__legal-persona-esp__responder_consulta` |
| `tribunal-constitucional` | `search_sentencias_tc` | `mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_sentencias_tc` | `mcp__tribunal-constitucional__search_sentencias_tc` |
| `tribunal-constitucional` | `get_sentencia_tc` | `mcp__plugin_bettercallclaude-espana_tribunal-constitucional__get_sentencia_tc` | `mcp__tribunal-constitucional__get_sentencia_tc` |
| `tribunal-constitucional` | `search_by_tema` | `mcp__plugin_bettercallclaude-espana_tribunal-constitucional__search_by_tema` | `mcp__tribunal-constitucional__search_by_tema` |
| `workflows-esp` | `claim_user_id` | `mcp__plugin_bettercallclaude-espana_workflows-esp__claim_user_id` | `mcp__workflows-esp__claim_user_id` |
| `workflows-esp` | `list_agents` | `mcp__plugin_bettercallclaude-espana_workflows-esp__list_agents` | `mcp__workflows-esp__list_agents` |
| `workflows-esp` | `validate_pipeline` | `mcp__plugin_bettercallclaude-espana_workflows-esp__validate_pipeline` | `mcp__workflows-esp__validate_pipeline` |
| `workflows-esp` | `save_workflow` | `mcp__plugin_bettercallclaude-espana_workflows-esp__save_workflow` | `mcp__workflows-esp__save_workflow` |
| `workflows-esp` | `list_workflows` | `mcp__plugin_bettercallclaude-espana_workflows-esp__list_workflows` | `mcp__workflows-esp__list_workflows` |
| `workflows-esp` | `get_workflow` | `mcp__plugin_bettercallclaude-espana_workflows-esp__get_workflow` | `mcp__workflows-esp__get_workflow` |
| `workflows-esp` | `delete_workflow` | `mcp__plugin_bettercallclaude-espana_workflows-esp__delete_workflow` | `mcp__workflows-esp__delete_workflow` |
| `workflows-esp` | `delete_user` | `mcp__plugin_bettercallclaude-espana_workflows-esp__delete_user` | `mcp__workflows-esp__delete_user` |
| `workflows-esp` | `log_run` | `mcp__plugin_bettercallclaude-espana_workflows-esp__log_run` | `mcp__workflows-esp__log_run` |
| `ollama` *(local stdio)* | `ollama_check_status` | `mcp__plugin_bettercallclaude-espana_ollama__ollama_check_status` | `mcp__ollama__ollama_check_status` |
| `ollama` | `ollama_generate` | `mcp__plugin_bettercallclaude-espana_ollama__ollama_generate` | `mcp__ollama__ollama_generate` |
| `ollama` | `ollama_chat` | `mcp__plugin_bettercallclaude-espana_ollama__ollama_chat` | `mcp__ollama__ollama_chat` |
| `ollama` | `ollama_classify_privacy` | `mcp__plugin_bettercallclaude-espana_ollama__ollama_classify_privacy` | `mcp__ollama__ollama_classify_privacy` |
| `ollama` | `ollama_list_models` | `mcp__plugin_bettercallclaude-espana_ollama__ollama_list_models` | `mcp__ollama__ollama_list_models` |

## Per-server tool counts

| Server | Tools |
|---|---:|
| `boe-legislacion` | 7 |
| `busqueda-general` | 3 |
| `catalunya-legal` | 3 |
| `cendoj-jurisprudencia` | 3 |
| `congreso-debates` | 3 |
| `derecho-historico` | 3 |
| `doctrina-academica` | 2 |
| `eu-law-esp` | 4 |
| `legal-citations-esp` | 6 |
| `legal-persona-esp` | 5 |
| `tribunal-constitucional` | 3 |
| `workflows-esp` | 9 |
| `ollama` *(local)* | 5 |
| **Total** | **56** |

## Server → tool list (compact form for `SERVER_TOOLS` in `scripts/generate-tool-frontmatter.js`)

```js
const SERVER_TOOLS = {
  'boe-legislacion': ['search_boe', 'get_legislacion', 'get_metadatos', 'get_texto_consolidado', 'get_indice', 'get_bloque', 'get_analisis'],
  'busqueda-general': ['search_portico', 'search_findiur', 'search_multi_source'],
  'catalunya-legal': ['search_norma_civil_cat', 'compare_catalan_spanish_civil', 'get_articulo_civil_cat'],
  'cendoj-jurisprudencia': ['search_jurisprudencia', 'get_sentencia_by_ecli', 'search_by_tribunal'],
  'congreso-debates': ['search_proyectos_ley', 'search_debates', 'track_legislative_status'],
  'derecho-historico': ['search_gazeta_historica', 'search_legislacion_historica', 'get_texto_historico'],
  'doctrina-academica': ['search_doctrina', 'search_by_autor'],
  'eu-law-esp': ['search_eurlex', 'get_eurlex_document', 'search_curia', 'get_eu_treaty'],
  'legal-citations-esp': ['validate_citation', 'parse_citation', 'format_citation', 'convert_to_ecli', 'convert_to_boe_id', 'extract_citations'],
  'legal-persona-esp': ['draft_documento', 'analizar_caso', 'estrategia_procesal', 'redactar_informe', 'responder_consulta'],
  'tribunal-constitucional': ['search_sentencias_tc', 'get_sentencia_tc', 'search_by_tema'],
  'workflows-esp': ['claim_user_id', 'list_agents', 'validate_pipeline', 'save_workflow', 'list_workflows', 'get_workflow', 'delete_workflow', 'delete_user', 'log_run'],
  'ollama': ['ollama_check_status', 'ollama_generate', 'ollama_chat', 'ollama_classify_privacy', 'ollama_list_models'],
};
```

## CONNECTORS.md discrepancies (why this correction matters)

*(Historical record — CONNECTORS.md was rewritten to the deployed surface in wayfinder t16; the table below documents the pre-rewrite errors for audit.)* The pre-rewrite `bettercallclaude-espana/CONNECTORS.md` documented 31 tools whose names almost never matched the deployed reality. Only 4 names coincided:

| Server | CONNECTORS.md claims | Actually deployed |
|---|---|---|
| `boe-legislacion` | `search_legislation`, `get_article`, `lookup_statute`, `find_related` | `search_boe`, `get_legislacion`, `get_metadatos`, `get_texto_consolidado`, `get_indice`, `get_bloque`, `get_analisis` |
| `legal-citations-esp` | `validate_citation`, `format_citation`, `parse_citation`, `standardize_document_citations` | `validate_citation`, `parse_citation`, `format_citation` + `convert_to_ecli`, `convert_to_boe_id`, `extract_citations` |
| `legal-persona-esp` | `analyze_document`, `draft_document`, `analyze_strategy` | `draft_documento`, `analizar_caso`, `estrategia_procesal`, `redactar_informe`, `responder_consulta` (Spanish names) |
| `cendoj-jurisprudencia` | `search_decisions`, `get_decision`, `get_fundamento`, `get_headnote`, `get_case_brief`, `find_leading_cases`, `find_citations` | `search_jurisprudencia`, `get_sentencia_by_ecli`, `search_by_tribunal` |
| `tribunal-constitucional` | `search_tc`, `get_tc_decision` | `search_sentencias_tc`, `get_sentencia_tc`, `search_by_tema` |
| `eu-law-esp` | `search_eu_law`, `get_directive`, `get_cjue_case` | `search_eurlex`, `get_eurlex_document`, `search_curia`, `get_eu_treaty` |
| `congreso-debates` | `search_debates`, `get_iniciativa_legislativa` | `search_debates` + `search_proyectos_ley`, `track_legislative_status` |
| `doctrina-academica` | `search_doctrine`, `get_commentary_for_article` | `search_doctrina`, `search_by_autor` |
| `derecho-historico` | `search_historical` | `search_gazeta_historica`, `search_legislacion_historica`, `get_texto_historico` |
| `catalunya-legal` | `search_dogc`, `search_tsjc`, `get_civil_catala` | `search_norma_civil_cat`, `compare_catalan_spanish_civil`, `get_articulo_civil_cat` |
| `busqueda-general` | `search_all` | `search_portico`, `search_findiur`, `search_multi_source` |

**Signature discrepancy** — `format_citation`: CONNECTORS.md documents `target_language: ES|EN`; the implementation takes `format: official|short|apa`. Skills and commands must use the real signature.

**Consequence for the existing plugin**: no ESP agent/command/skill currently whitelists any `mcp__*` tool (frontmatter `tools:` blocks list only built-ins). Combined with the wrong CONNECTORS.md names, any whitelist written from CONNECTORS.md would have pointed at non-existent tools. The parity scripts must derive from this file, not from CONNECTORS.md.

## Tool-purpose groupings (for skill `tools:` design)

| Grouping | Servers | Use case |
|---|---|---|
| **Legislation** | `boe-legislacion`, `eu-law-esp` (EUR-Lex), `derecho-historico`, `catalunya-legal` | State/EU/historical/Catalan statute lookup |
| **Jurisprudence** | `cendoj-jurisprudencia`, `tribunal-constitucional`, `eu-law-esp` (Curia) | TS/AP/Juzgados, TC, CJEU decisions |
| **Citations** | `legal-citations-esp` | validate/parse/format/convert/extract Spanish citations |
| **Intelligence** | `legal-persona-esp` | draft/analyze/strategy/report/consultation (Spanish-law persona) |
| **Legislative history** | `congreso-debates` | proyectos de ley, debates, status tracking |
| **Doctrine** | `doctrina-academica` | search doctrina, search by autor |
| **Cross-source** | `busqueda-general` | Pórtico, Findiur, multi-source search |
| **Local / privacy** | `ollama` | offline privacy classification + local LLM generate/chat for PRIVILEGED content |

## Convention check (parity guard contract)

Every `tools:` entry in every agent/command/skill frontmatter that whitelists an MCP tool must list it under **both**:

1. `mcp__plugin_bettercallclaude-espana_<server>__<tool>` (scoped — Claude Code CLI and current Cowork builds)
2. `mcp__<server>__<tool>` (bare — older Cowork builds)

A missing twin silently strips the tool from the agent's allowlist on the host that uses the other convention — the "No such tool available" regression that bit CH in v4.11.5 and IT pre-v2.3.0.

`scripts/check-tool-names.js` enforces this contract; it fails CI on any violation.

## Gaps vs IT (confirmed against the actual implementation)

1. **No `compute_deadlines` tool** — IT's `legal-persona-ita` has `legal-persona-ita_compute_deadlines`; ESP's `legal-persona-esp` (draft_documento, analizar_caso, estrategia_procesal, redactar_informe, responder_consulta) has no equivalent. Procedural plazos fall back to the table in `legal-chronology/references/deadline-mapping.md`, every plazo labeled indicative. (Ticket t14.)
2. **~~No `workflows` server.~~ RESOLVED 2026-09-05 (Map D / t32).** ESP now ships `workflows-esp` (`.mcp.json` + this inventory + `create-workflow`/`workflow` commands). Parity with IT's `workflows-ita`: `claim_user_id`, `list_agents`, `validate_pipeline` are live; `save_workflow`, `list_workflows`, `get_workflow`, `delete_workflow`, `log_run`, `delete_user` are registered stubs returning `not_implemented` until the full server integration is deployed. (Originally ticket t15.)
3. **No `citation-verify` server.** IT's `citation-verify-ita_check_existence` maps to ESP's `legal-citations-esp__validate_citation`; the `citation-content-verify` skill can also use `extract_citations` (batch extraction from text) — a capability IT lacks. (Ticket t11.)
4. **`ollama` is local stdio** — parity script emits both naming forms; confirm Cowork behavior after `npm run package`.
