#!/usr/bin/env node
/**
 * Generate and apply `tools:` YAML frontmatter for agents, skills, and commands.
 *
 * Every MCP tool is whitelisted under BOTH naming conventions, because hosts
 * differ (scoped names on Claude Code CLI and current Cowork builds, bare
 * server names on older Cowork builds):
 *   scoped: mcp__plugin_bettercallclaude-espana_<server>__<tool>
 *   bare:   mcp__<server>__<tool>
 *
 * Usage:
 *   node scripts/generate-tool-frontmatter.js          # dry-run (print only)
 *   node scripts/generate-tool-frontmatter.js --apply  # modify files in place
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const agentsDir = path.join(root, 'bettercallclaude-espana', 'agents');
const skillsDir = path.join(root, 'bettercallclaude-espana', 'skills');
const commandsDir = path.join(root, 'bettercallclaude-espana', 'commands');
const apply = process.argv.includes('--apply');

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
  'adversarial.md': ['adversarial-analysis'],
  'briefing.md': ['legal-briefing'],
  'cite.md': ['spanish-citation-formats'],
  'doc-analyze.md': ['spanish-document-analysis'],
  'draft.md': ['spanish-legal-drafting'],
  'federal.md': ['spanish-legal-research', 'spanish-jurisdictions'],
  'legal-5step.md': ['legal-5step-framework', 'spanish-legal-research', 'spanish-legal-strategy', 'adversarial-analysis', 'spanish-legal-drafting', 'spanish-citation-formats'],
  'legal.md': ['spanish-legal-research', 'legal-briefing'],
  'precedent.md': ['spanish-legal-research'],
  'refine.md': ['legal-query-refinement'],
  'research.md': ['spanish-legal-research'],
  'strategy.md': ['spanish-legal-strategy'],
  'summarize.md': ['output-summarization'],
  'translate.md': ['spanish-legal-translation'],
  'validate.md': ['spanish-citation-formats'],
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

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function extractBareToolNames(text) {
  const found = new Set();
  for (const tool of Object.keys(TOOL_TO_SERVERS)) {
    const re = new RegExp(`\\b${tool}\\b`, 'g');
    if (re.test(text)) found.add(tool);
  }
  return [...found];
}

function resolveServer(tool, text) {
  const candidates = TOOL_TO_SERVERS[tool] || [];
  if (candidates.length === 1) return candidates[0];

  const serverHints = {
    'boe-legislacion': /boe-legislacion/i,
    'busqueda-general': /busqueda-general/i,
    'catalunya-legal': /catalunya-legal/i,
    'cendoj-jurisprudencia': /cendoj-jurisprudencia/i,
    'congreso-debates': /congreso-debates/i,
    'derecho-historico': /derecho-historico/i,
    'doctrina-academica': /doctrina-academica/i,
    'eu-law-esp': /eu-law-esp/i,
    'legal-citations-esp': /legal-citations-esp/i,
    'legal-persona-esp': /legal-persona-esp/i,
    'tribunal-constitucional': /tribunal-constitucional/i,
    ollama: /ollama/i,
  };

  for (const server of candidates) {
    if (serverHints[server] && serverHints[server].test(text)) {
      return server;
    }
  }

  return candidates[0];
}

const SCOPED_PREFIX = 'mcp__plugin_bettercallclaude-espana_';
const BARE_PREFIX = 'mcp__';

function fullyQualified(tool, server) {
  return `${SCOPED_PREFIX}${server}__${tool}`;
}

// Every MCP entry whitelisted under one naming convention must also be
// whitelisted under the other — hosts differ (scoped vs bare server names).
// Applied to the merged list so both computed and pre-existing entries get
// their twin (agents carry curated lists the text analysis cannot recompute).
function twinExpand(entries) {
  const out = new Set(entries);
  for (const e of entries) {
    if (e.startsWith(SCOPED_PREFIX)) {
      out.add(BARE_PREFIX + e.slice(SCOPED_PREFIX.length));
    } else if (e.startsWith(BARE_PREFIX)) {
      out.add(SCOPED_PREFIX + e.slice(BARE_PREFIX.length));
    }
  }
  return [...out];
}

// When a file references any tool of a server, grant the full toolset of that server
// (frontmatter convention of this repo: complete per-server sets).
function serversFromResolved(resolved) {
  const servers = new Set();
  for (const r of Object.values(resolved)) servers.add(r.server);
  return servers;
}

function fqForServers(servers) {
  const tools = new Set();
  for (const server of servers) {
    for (const tool of SERVER_TOOLS[server]) tools.add(fullyQualified(tool, server));
  }
  return tools;
}

function analyzeFile(filePath) {
  const text = readFile(filePath);
  const bare = extractBareToolNames(text);
  const resolved = {};
  for (const tool of bare) {
    const server = resolveServer(tool, text);
    resolved[tool] = { server, fq: fullyQualified(tool, server) };
  }
  return { bare, resolved, text };
}

function skillServers(skillName) {
  const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
  if (!fs.existsSync(skillPath)) return new Set();
  const { resolved } = analyzeFile(skillPath);
  return serversFromResolved(resolved);
}

function commandTools(cmdFile) {
  const text = readFile(cmdFile);
  const bare = extractBareToolNames(text);
  const servers = new Set();

  for (const tool of bare) {
    servers.add(resolveServer(tool, text));
  }

  const base = path.basename(cmdFile);
  const skills = COMMAND_SKILL_MAP[base] || [];
  for (const skill of skills) {
    for (const server of skillServers(skill)) servers.add(server);
  }

  const tools = new Set(GENERIC_TOOLS);
  for (const fq of fqForServers(servers)) tools.add(fq);

  // Multi-agent orchestrators dispatch sub-agents via the Task tool. Skills are
  // reference material — they never get Task.
  if (MULTI_AGENT_COMMANDS.has(base)) tools.add('Task');

  return [...tools];
}

// Agent tool list: GENERIC_TOOLS + full per-server sets from AGENT_SERVER_MAP.
// Curated (not text-analyzed) so the curation logic in `insertToolsIntoFrontmatter`
// can preserve any pre-existing entries — agents keep their hand-picked allowlist,
// we only add the canonical MCP entries for the servers they need.
function agentTools(agentPath) {
  const base = path.basename(agentPath);
  const servers = new Set(AGENT_SERVER_MAP[base] || []);
  const tools = new Set(GENERIC_TOOLS);
  for (const fq of fqForServers(servers)) tools.add(fq);
  return [...tools];
}

// Stale = MCP entry (scoped or bare form) whose server is a known ESP server
// but whose tool is not in SERVER_TOOLS. Third-party MCP servers and non-MCP
// (built-in) entries are never pruned.
function isStaleMcpEntry(entry) {
  let rest = null;
  if (entry.startsWith(SCOPED_PREFIX)) rest = entry.slice(SCOPED_PREFIX.length);
  else if (entry.startsWith(BARE_PREFIX)) rest = entry.slice(BARE_PREFIX.length);
  else return false;
  const m = rest.match(/^(.+?)__(.+)$/);
  if (!m) return false;
  const [, server, tool] = m;
  return Object.prototype.hasOwnProperty.call(SERVER_TOOLS, server)
    && !SERVER_TOOLS[server].includes(tool);
}

function insertToolsIntoFrontmatter(content, tools) {
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fmMatch) return null;

  const rest = content.slice(fmMatch[0].length);

  // Drop the existing tools: block but keep its entries: regeneration is a
  // union (computed ∪ existing) — except MCP entries for known ESP servers
  // whose tool is no longer in SERVER_TOOLS, which are pruned (the inventory
  // is the contract; e.g. phantom ollama tools from an earlier inventory).
  const oldLines = fmMatch[1].split('\n');
  const existing = [];
  const lines = [];
  let skippingTools = false;
  for (const line of oldLines) {
    if (/^tools:\s*$/.test(line)) {
      skippingTools = true;
      continue;
    }
    if (skippingTools && /^  - /.test(line)) {
      existing.push(line.replace(/^  - /, ''));
      continue;
    }
    skippingTools = false;
    lines.push(line);
  }

  const kept = existing.filter((e) => !isStaleMcpEntry(e));
  const merged = twinExpand([...new Set([...kept, ...tools])]);
  const toolsYaml = 'tools:\n' + merged.map(t => `  - ${t}`).join('\n');

  // Preserve the original `tools:` position when one existed (we just dropped
  // it above, so reinsert in place). Otherwise insert after model: (ESP agent
  // convention places model: between description: and tools:), then after
  // description:, then append at end of frontmatter.
  let insertAt = -1;

  // 1. If `model:` is in the post-drop lines, insert after it (preserves the
  //    description → model → tools ordering used by every ESP agent).
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('model:')) {
      insertAt = i + 1;
      break;
    }
  }

  // 2. Otherwise after description: (skipping multi-line continuations).
  if (insertAt === -1) {
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('description:')) {
        insertAt = i + 1;
        while (insertAt < lines.length && lines[insertAt].match(/^\s+/) && !lines[insertAt].includes(':')) {
          insertAt++;
        }
        break;
      }
    }
  }

  // 3. Otherwise append at end of frontmatter.
  if (insertAt === -1) insertAt = lines.length;

  lines.splice(insertAt, 0, toolsYaml);
  return `---\n${lines.join('\n')}\n---\n${rest}`;
}

function processFile(filePath, tools) {
  const content = readFile(filePath);
  const updated = insertToolsIntoFrontmatter(content, tools);
  if (!updated) {
    console.error(`Could not parse frontmatter: ${filePath}`);
    return false;
  }
  if (apply) {
    fs.writeFileSync(filePath, updated);
    console.log(`Updated: ${path.relative(root, filePath)}`);
  } else {
    console.log(`--- ${path.relative(root, filePath)}`);
    console.log(updated.split('\n').slice(0, 20).join('\n'));
    console.log('...');
  }
  return true;
}

console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}\n`);

let ok = 0;
let fail = 0;

// Agents: whitelists are curated per agent — keep the existing entries and
// only add the missing naming-convention twins (no text-analysis additions).
// `agentTools` populates GENERIC_TOOLS + canonical MCP entries for the servers
// declared in AGENT_SERVER_MAP; the curation logic in `insertToolsIntoFrontmatter`
// preserves any pre-existing entries not in this list.
for (const agentFile of fs.readdirSync(agentsDir).filter(f => f.endsWith('.md'))) {
  const agentPath = path.join(agentsDir, agentFile);
  if (processFile(agentPath, agentTools(agentPath))) ok++;
  else fail++;
}

for (const skillDir of fs.readdirSync(skillsDir)) {
  const skillPath = path.join(skillsDir, skillDir, 'SKILL.md');
  if (!fs.existsSync(skillPath)) continue;
  const { resolved } = analyzeFile(skillPath);
  const tools = new Set(GENERIC_TOOLS);
  for (const fq of fqForServers(serversFromResolved(resolved))) tools.add(fq);
  if (processFile(skillPath, [...tools])) ok++;
  else fail++;
}

for (const cmdFile of fs.readdirSync(commandsDir).filter(f => f.endsWith('.md'))) {
  const cmdPath = path.join(commandsDir, cmdFile);
  if (processFile(cmdPath, commandTools(cmdPath))) ok++;
  else fail++;
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);