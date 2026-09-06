#!/usr/bin/env node
/**
 * Shared tool contracts for the ESP plugin.
 *
 * Single source of truth for the curated maps that drive MCP frontmatter:
 *   - SERVER_TOOLS           server → tool list (canonical inventory)
 *   - AGENT_SERVER_MAP       agent → servers it must expose
 *   - MULTI_AGENT_COMMANDS   orchestrator commands that must whitelist `Task`
 *   - GENERIC_TOOLS          built-in tools every agent/command/skill gets
 *
 * Consumed by both scripts/generate-tool-frontmatter.js (which writes the
 * `tools:` blocks) and scripts/check-tool-names.js (which verifies the pairing
 * convention AND — since the FU3 access-check extension — that agents expose
 * the servers mapped here, orchestrators carry `Task`, and skills never do).
 *
 * Keeping the maps in one module means a change to a contract is picked up by
 * the generator and the checker together; a second copy would let the two
 * drift apart — the exact regression class this check exists to catch.
 */

// Server → list of tools (canonical contract: docs/MCP_TOOLS.md lines 79-94).
// 11 remote servers (42 tools) + 1 local stdio (ollama, 5 tools) = 12 servers, 47 tools.
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
  ollama: ['ollama_check_status', 'ollama_generate', 'ollama_chat', 'ollama_classify_privacy', 'ollama_list_models'],
};

const TOOL_TO_SERVERS = {};
for (const [server, tools] of Object.entries(SERVER_TOOLS)) {
  for (const tool of tools) {
    if (!TOOL_TO_SERVERS[tool]) TOOL_TO_SERVERS[tool] = [];
    TOOL_TO_SERVERS[tool].push(server);
  }
}

const COMMAND_SKILL_MAP = {
  'analisis-adversarial.md': ['adversarial-analysis'],
  'analizar-doc.md': ['spanish-document-analysis'],
  'borrador.md': ['spanish-legal-drafting'],
  'briefing.md': ['legal-briefing'],
  'cita.md': ['spanish-citation-formats'],
  'estrategia.md': ['spanish-legal-strategy'],
  'federal.md': ['spanish-legal-research', 'spanish-jurisdictions'],
  'investigacion.md': ['spanish-legal-research'],
  'legal-5step.md': ['legal-5step-framework', 'spanish-legal-research', 'spanish-legal-strategy', 'adversarial-analysis', 'spanish-legal-drafting', 'spanish-citation-formats'],
  'legal.md': ['spanish-legal-research', 'legal-briefing'],
  'precedente.md': ['spanish-legal-research'],
  'refinar.md': ['legal-query-refinement'],
  'resumir.md': ['output-summarization'],
  'traducir.md': ['spanish-legal-translation'],
  'validar.md': ['spanish-citation-formats'],
};

// Agent → server MCP map (curated from each agent's description / role).
// Curator derives here: researcher → jurisprudence, legislation, doctrine, TC.
// citation → legal-citations-esp. drafter → legal-persona-esp.
// data-protection → legal-persona-esp + eu-law-esp. autonomico → derecho-historico
// + catalunya-legal + congreso-debates (CCAA legislative history + Catalonia +
// parliamentary). compliance → busqueda-general. strategy / risk →
// legal-persona-esp. judicial / advocate / adversary → legal-persona-esp.
// procedure → legal-persona-esp. realestate / corporate / fiscal →
// legal-persona-esp. briefing / chronology-builder → legal-persona-esp.
// orchestrator → legal-persona-esp. translator / summarizer / prompt-engineer →
// nessun MCP server (no need for verbatim BOE/CENDOJ tools).
const AGENT_SERVER_MAP = {
  'adversary.md': ['legal-persona-esp'],
  'advocate.md': ['cendoj-jurisprudencia', 'tribunal-constitucional', 'doctrina-academica', 'legal-persona-esp'],
  'autonomic.md': ['derecho-historico', 'catalunya-legal', 'congreso-debates'],
  'briefing.md': ['legal-persona-esp'],
  'chronology-builder.md': ['legal-persona-esp'],
  'citation.md': ['legal-citations-esp'],
  'compliance.md': ['busqueda-general', 'legal-persona-esp'],
  'corporate.md': ['legal-persona-esp'],
  'data-protection.md': ['legal-persona-esp', 'eu-law-esp'],
  'drafter.md': ['legal-persona-esp'],
  'fiscal.md': ['legal-persona-esp'],
  'judicial.md': ['legal-persona-esp'],
  'orchestrator.md': ['legal-persona-esp'],
  'procedure.md': ['legal-persona-esp'],
  'prompt-engineer.md': [],
  'realestate.md': ['legal-persona-esp'],
  'researcher.md': ['cendoj-jurisprudencia', 'boe-legislacion', 'tribunal-constitucional', 'doctrina-academica'],
  'risk.md': ['legal-persona-esp'],
  'strategist.md': ['legal-persona-esp'],
  'summarizer.md': [],
  'translator.md': [],
};

// Commands that dispatch sub-agents / orchestrate multi-agent pipelines and
// therefore require the `Task` tool in their frontmatter. Curated from the
// prose of each command file (Map B / wayfinder / doctor / briefing / etc.).
// Skills are reference material and NEVER receive `Task`.
const MULTI_AGENT_COMMANDS = new Set([
  'legal.md',
  'legal-5step.md',
  'briefing.md',
  'workflow.md',
  'mapa-legal.md',
  'percurso-legal.md',
  'cronologia-legal.md',
  'bucle-legal.md',
  'objetivo-legal.md',
  'triage-nda.md',
  'start.md',
  'doctor.md',
]);

const GENERIC_TOOLS = ['Read', 'Grep', 'Glob', 'Bash', 'WebSearch', 'WebFetch'];

// Naming conventions: hosts differ (scoped names on Claude Code CLI and current
// Cowork builds, bare server names on older Cowork builds).
const SCOPED_PREFIX = 'mcp__plugin_bettercallclaude-espana_';
const BARE_PREFIX = 'mcp__';

function fullyQualified(tool, server) {
  return `${SCOPED_PREFIX}${server}__${tool}`;
}

function bareQualified(tool, server) {
  return `${BARE_PREFIX}${server}__${tool}`;
}

module.exports = {
  SERVER_TOOLS,
  TOOL_TO_SERVERS,
  COMMAND_SKILL_MAP,
  AGENT_SERVER_MAP,
  MULTI_AGENT_COMMANDS,
  GENERIC_TOOLS,
  SCOPED_PREFIX,
  BARE_PREFIX,
  fullyQualified,
  bareQualified,
};
