#!/usr/bin/env node
/**
 * Check MCP tool parity and access guarantees in `tools:` frontmatter of
 * agents, commands, and skills.
 *
 * PART 1 — Naming-convention pairing:
 * Every MCP entry whitelisted under one naming convention must also be
 * whitelisted under the other:
 *   scoped (Claude Code CLI / current Cowork): mcp__plugin_bettercallclaude-espana_<server>__<tool>
 *   bare   (older Cowork Desktop builds):       mcp__<server>__<tool>
 *
 * A missing twin silently strips the tool from the agent's allowlist on the host that
 * uses the other convention — the "No such tool available" regression (Swiss v4.11.5).
 *
 * PART 2 — Access guarantees (FU3, Devin review #11 on PR #29):
 * Pairing alone does not prove an agent can still reach the tools its role
 * requires — the curated contracts in scripts/tool-contracts.js are written by
 * scripts/generate-tool-frontmatter.js but were never enforced in CI, so a
 * hand-edit of one frontmatter could silently strip an agent's access. This
 * script now verifies, against the same contracts:
 *   (a) every agent listed in AGENT_SERVER_MAP exposes — under BOTH naming
 *       conventions — every tool of every server the map assigns it
 *       (under-whitelist only: extra servers an agent may expose are allowed);
 *   (b) every command in MULTI_AGENT_COMMANDS whitelists `Task` (it dispatches
 *       sub-agents);
 *   (c) no skill whitelists `Task` (skills are reference material).
 *
 * Usage:
 *   node scripts/check-tool-names.js            # check (exit 1 on violation)
 *
 * To regenerate a file's tools: block, see scripts/generate-tool-frontmatter.js.
 */

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const pluginDir = path.join(root, 'bettercallclaude-espana');

const {
  SERVER_TOOLS,
  AGENT_SERVER_MAP,
  MULTI_AGENT_COMMANDS,
  SCOPED_PREFIX,
  BARE_PREFIX,
  fullyQualified,
  bareQualified,
} = require('./tool-contracts');

const AGENTS_DIR = path.join(pluginDir, 'agents');
const COMMANDS_DIR = path.join(pluginDir, 'commands');
const SKILLS_DIR = path.join(pluginDir, 'skills');

function collectMdFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // skills/<name>/SKILL.md
      const skill = path.join(p, 'SKILL.md');
      if (fs.existsSync(skill)) out.push(skill);
    } else if (entry.name.endsWith('.md')) {
      out.push(p);
    }
  }
  return out;
}

function extractToolsList(content) {
  const fm = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) return null;
  const lines = fm[1].split('\n');
  const tools = [];
  let inTools = false;
  for (const line of lines) {
    if (/^tools:\s*$/.test(line)) { inTools = true; continue; }
    if (inTools) {
      const m = line.match(/^\s+-\s+(\S+)\s*$/);
      if (m) { tools.push(m[1]); continue; }
      // Any other non-indented key ends the block
      if (/^\S/.test(line)) break;
    }
  }
  return tools;
}

function parseMcpEntry(entry) {
  let rest = null;
  let scoped = false;
  if (entry.startsWith(SCOPED_PREFIX)) {
    rest = entry.slice(SCOPED_PREFIX.length);
    scoped = true;
  } else if (entry.startsWith(BARE_PREFIX)) {
    rest = entry.slice(BARE_PREFIX.length);
  } else {
    return null; // generic tool (Read, Bash, Task, ...)
  }
  const i = rest.indexOf('__');
  if (i === -1) return null; // server-level pattern like mcp__<server>
  return { server: rest.slice(0, i), tool: rest.slice(i + 2), scoped };
}

function twinOf(e) {
  return e.scoped
    ? `${BARE_PREFIX}${e.server}__${e.tool}`
    : `${SCOPED_PREFIX}${e.server}__${e.tool}`;
}

const violations = [];
let filesChecked = 0;
let mcpEntries = 0;
let agentsChecked = 0;
let commandsChecked = 0;
let skillsChecked = 0;

function fileTools(file) {
  return extractToolsList(fs.readFileSync(file, 'utf8')) || [];
}

// ---------- PART 1: naming-convention pairing ----------

for (const dir of [AGENTS_DIR, COMMANDS_DIR, SKILLS_DIR]) {
  if (!fs.existsSync(dir)) continue;
  for (const file of collectMdFiles(dir)) {
    const tools = extractToolsList(fs.readFileSync(file, 'utf8'));
    if (!tools) continue;
    filesChecked++;
    const set = new Set(tools);
    for (const entry of tools) {
      const parsed = parseMcpEntry(entry);
      if (!parsed) continue;
      mcpEntries++;
      const twin = twinOf(parsed);
      if (!set.has(twin)) {
        violations.push({ file: path.relative(root, file), entry, twin });
      }
    }
  }
}

// ---------- PART 2: access guarantees (FU3) ----------

// (a) Agents must expose every tool of every server AGENT_SERVER_MAP assigns them.
// Under-whitelist only: an agent exposing MORE servers than mapped is allowed.
for (const [agentFile, servers] of Object.entries(AGENT_SERVER_MAP)) {
  if (!servers || servers.length === 0) continue; // e.g. translator/summarizer: no MCP
  const filePath = path.join(AGENTS_DIR, agentFile);
  if (!fs.existsSync(filePath)) {
    violations.push({ file: path.relative(root, filePath), entry: `agent listed in AGENT_SERVER_MAP but file missing` });
    continue;
  }
  agentsChecked++;
  const set = new Set(fileTools(filePath));
  for (const server of servers) {
    for (const tool of SERVER_TOOLS[server] || []) {
      const scoped = fullyQualified(tool, server);
      const bare = bareQualified(tool, server);
      if (!set.has(scoped)) {
        violations.push({ file: path.relative(root, filePath), entry: `agent missing required tool`, missing: scoped });
      }
      if (!set.has(bare)) {
        violations.push({ file: path.relative(root, filePath), entry: `agent missing required tool`, missing: bare });
      }
    }
  }
}

// (b) Orchestrator commands must whitelist Task.
for (const cmdFile of MULTI_AGENT_COMMANDS) {
  const filePath = path.join(COMMANDS_DIR, cmdFile);
  if (!fs.existsSync(filePath)) {
    violations.push({ file: path.relative(root, filePath), entry: `command listed in MULTI_AGENT_COMMANDS but file missing` });
    continue;
  }
  commandsChecked++;
  const set = new Set(fileTools(filePath));
  if (!set.has('Task')) {
    violations.push({ file: path.relative(root, filePath), entry: `multi-agent command missing Task tool` });
  }
}

// (c) Skills never whitelist Task.
if (fs.existsSync(SKILLS_DIR)) {
  for (const entry of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = path.join(SKILLS_DIR, entry.name, 'SKILL.md');
    if (!fs.existsSync(skillPath)) continue;
    skillsChecked++;
    const set = new Set(fileTools(skillPath));
    if (set.has('Task')) {
      violations.push({ file: path.relative(root, skillPath), entry: `skill must NOT whitelist Task (reference material)` });
    }
  }
}

if (violations.length) {
  console.error(`FAIL: ${violations.length} access/parity violation${violations.length === 1 ? '' : 's'}:\n`);
  for (const v of violations) {
    console.error(`  ${v.file}`);
    if (v.twin) {
      console.error(`    has:    ${v.entry}`);
      console.error(`    misses: ${v.twin}`);
    } else if (v.missing) {
      console.error(`    ${v.entry}: ${v.missing}`);
    } else {
      console.error(`    ${v.entry}`);
    }
  }
  console.error('\nBoth naming conventions must be whitelisted (hosts differ: scoped vs bare server names).');
  console.error('Agents must expose every tool of their AGENT_SERVER_MAP servers; orchestrator commands');
  console.error('need Task; skills must never carry Task.');
  console.error('Fix: edit the frontmatter, or regenerate with `node scripts/generate-tool-frontmatter.js --apply`.');
  process.exit(1);
}

console.log(`OK: ${filesChecked} files checked, ${mcpEntries} MCP entries, all paired under both naming conventions.`);
console.log(`OK: ${agentsChecked} mapped agents expose their required server tools, ${commandsChecked} orchestrator commands carry Task, ${skillsChecked} skills carry no Task.`);
