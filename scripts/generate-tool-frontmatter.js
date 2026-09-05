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

// Curated maps and naming conventions live in scripts/tool-contracts.js —
// the single source of truth shared with scripts/check-tool-names.js, so the
// checker verifies the same contracts this generator writes.
const {
  SERVER_TOOLS,
  TOOL_TO_SERVERS,
  COMMAND_SKILL_MAP,
  AGENT_SERVER_MAP,
  MULTI_AGENT_COMMANDS,
  GENERIC_TOOLS,
  SCOPED_PREFIX,
  BARE_PREFIX,
  fullyQualified,
} = require('./tool-contracts');

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