#!/usr/bin/env node
/**
 * BetterCallClaude España Privacy Check Hook
 *
 * PreToolUse hook that detects potential attorney-client privileged content
 * (secreto profesional / Art. 24 LOPJ, Art. 542 CP) in Spanish and English before
 * it leaves the machine via Write, Edit, MultiEdit, Bash, WebFetch, or any
 * MCP tool.
 *
 * Strategy:
 *   - Strong patterns (attorney-specific terms, legal article references)
 *     return "ask" — the user is prompted and can choose to proceed.
 *   - Weak patterns (bare "confidential", "confidencial", "reservado")
 *     return "ask" when a discriminator is present (legal-context
 *     file path or another privilege marker), so routine document footers
 *     do not flood the user with permission prompts.
 *
 * Privacy modes (read from CLAUDE_PLUGIN_USER_CONFIG or default "balanced"):
 *   - strict:   Same pattern matching as balanced but deny instead of ask.
 *              Content without privilege markers passes through so MCP servers
 *              remain usable. Ollama (local) is always exempt.
 *   - balanced:  Strong → ask, weak+context → ask. Default.
 *   - cloud:     Strong → ask, weak → allow (no prompt).
 *
 * Per Anthropic hooks spec, stdin is:
 *   {
 *     session_id, cwd, hook_event_name: "PreToolUse",
 *     tool_name: "Write" | "Edit" | "MultiEdit" | "Bash" | "WebFetch" | "mcp__<server>__<tool>" | ...,
 *     tool_input: { ... }
 *   }
 *
 * A legacy flat shape (tool input fields at the top level) is also accepted
 * as a safety net.
 *
 * Output:
 *   - stdout JSON {hookSpecificOutput:{permissionDecision:"deny"|"ask", ...}}
 *     written when privileged content is detected or strict mode blocks.
 *   - Exit code 0 in all non-error paths.
 */

'use strict';

// ---------------------------------------------------------------------------
// Entry point — reads stdin, classifies content, writes hookSpecificOutput.
// ---------------------------------------------------------------------------

function main() {
  process.stdin.setEncoding('utf8');
  let input = '';
  process.stdin.on('data', (chunk) => { input += chunk; });
  process.stdin.on('end', () => {
    let data;
    try { data = JSON.parse(input); } catch { process.exit(0); }

    const toolName = typeof data.tool_name === 'string' ? data.tool_name : '';
    // Accept both the canonical {tool_input: {...}} shape and a legacy flat shape.
    const toolInput = (data.tool_input && typeof data.tool_input === 'object')
      ? data.tool_input
      : data;

    const content = extractTextFromInput(toolName, toolInput);
    const pathHint = extractPathHint(toolInput);
    const mode = resolvePrivacyMode();

    // Bash file path scanning: check if referenced files live in privileged dirs.
    let bashPathResult = null;
    if (toolName === 'Bash' && typeof toolInput.command === 'string') {
      const filePaths = extractBashFilePaths(toolInput.command);
      for (const fp of filePaths) {
        if (DISCRIMINATOR_PATH.test(fp)) {
          bashPathResult = { category: 'bash-file-path-exfil', strength: 'weak' };
          break;
        }
      }
    }

    if (!content.trim() && !bashPathResult) {
      // No text content and no suspicious file paths — nothing to classify.
      process.exit(0);
    }

    let result = classifyWithMode(content, pathHint, mode, toolName);

    // If content classification found nothing but Bash paths are suspicious, flag it.
    // Cloud mode: weak signals (including file path matches) allowed without prompt.
    if (!result && bashPathResult && mode !== 'cloud') {
      const decision = (mode === 'strict' && !isOllamaTool(toolName)) ? 'deny' : 'ask';
      result = { category: bashPathResult.category, decision };
    }

    if (!result) { process.exit(0); }

    const reason =
      `Possible attorney-client privileged content detected (category: ${result.category}). ` +
      'Spanish law: Art. 24 LOPJ / Art. 542 CP. ' +
      (result.decision === 'deny'
        ? 'This content has been blocked from leaving the machine.'
        : 'Confirm this content is cleared to leave the machine.');

    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: result.decision,
        permissionDecisionReason: reason,
      },
    }));
    process.exit(0);
  });
}

// ---------------------------------------------------------------------------
// Content extraction
// ---------------------------------------------------------------------------

/** Collect every string in the tool input relevant to content egress. */
function extractTextFromInput(toolName, input) {
  const parts = [];

  // Canonical scalar fields across built-in tools
  const scalarFields = [
    'content',      // Write
    'new_string',   // Edit
    'old_string',   // Edit (for context gating)
    'prompt',       // WebFetch, Task
    'query',        // WebSearch, many MCP search tools
    'url',          // WebFetch
    'command',      // Bash (only scanned when matcher includes Bash)
  ];
  for (const k of scalarFields) {
    if (typeof input[k] === 'string') parts.push(input[k]);
  }

  // MultiEdit: tool_input.edits[].{new_string,old_string}
  if (Array.isArray(input.edits)) {
    for (const e of input.edits) {
      if (e && typeof e === 'object') {
        if (typeof e.new_string === 'string') parts.push(e.new_string);
        if (typeof e.old_string === 'string') parts.push(e.old_string);
      }
    }
  }

  // MCP tools: input shape is arbitrary. Walk every string leaf.
  if (toolName.startsWith('mcp__')) {
    walkStrings(input, (s) => parts.push(s));
  }

  return parts.join('\n');
}

/** Extract a filesystem path hint from the tool input, if present. */
function extractPathHint(input) {
  const candidates = ['file_path', 'path', 'target_file', 'target', 'notebook_path'];
  for (const k of candidates) {
    if (typeof input[k] === 'string') return input[k];
  }
  return '';
}

/**
 * Extract file paths referenced in a Bash command string.
 * Catches: @filepath (curl --data-binary), < filepath (redirect),
 * and arguments to cat/head/tail/less/more/base64/xxd/od/strings.
 */
function extractBashFilePaths(command) {
  if (typeof command !== 'string') return [];
  const paths = [];

  // @filepath (curl --data-binary @/path/to/file)
  const atPattern = /@(\/[^\s;|&"']+)/g;
  let m;
  while ((m = atPattern.exec(command)) !== null) paths.push(m[1]);

  // < filepath (input redirection)
  const redirectPattern = /<\s*(\/[^\s;|&"']+)/g;
  while ((m = redirectPattern.exec(command)) !== null) paths.push(m[1]);

  // cat/head/tail/less/more/base64/xxd/od/strings followed by filepath(s)
  const cmdPattern = /\b(?:cat|head|tail|less|more|base64|xxd|od|strings)\s+((?:\/[^\s;|&"']+\s*)+)/gi;
  while ((m = cmdPattern.exec(command)) !== null) {
    const args = m[1].trim().split(/\s+/);
    for (const a of args) {
      if (a.startsWith('/')) paths.push(a);
    }
  }

  return paths;
}

function walkStrings(node, emit, depth) {
  if (depth === undefined) depth = 0;
  if (depth > 6) return; // hard cap to avoid pathological MCP payloads
  if (typeof node === 'string') { emit(node); return; }
  if (Array.isArray(node)) {
    for (const n of node) walkStrings(n, emit, depth + 1);
    return;
  }
  if (node && typeof node === 'object') {
    for (const v of Object.values(node)) walkStrings(v, emit, depth + 1);
  }
}

// ---------------------------------------------------------------------------
// Privacy mode resolution
// ---------------------------------------------------------------------------

const fs = require('node:fs');
const path = require('node:path');

const VALID_MODES = ['strict', 'balanced', 'cloud'];
const MODE_SEVERITY = { cloud: 0, balanced: 1, strict: 2 };
const DEFAULT_MODE = 'balanced';

/**
 * Read privacy_mode with the following precedence:
 *   1. CLAUDE_PLUGIN_USER_CONFIG env var (JSON, set by Cowork Desktop)
 *   2. ~/.betterask/config.yaml file (set by /bettercallclaude-espana:privacy command)
 *      — the file can only RAISE severity above the default (balanced).
 *        A file requesting 'cloud' (less restrictive) is ignored.
 *   3. Default: 'balanced'
 */
function resolvePrivacyMode() {
  // 1. Try env var (Cowork Desktop userConfig) — trusted source, no restriction.
  const raw = process.env.CLAUDE_PLUGIN_USER_CONFIG;
  if (raw) {
    try {
      const cfg = JSON.parse(raw);
      const m = (cfg.privacy_mode || '').toLowerCase().trim();
      if (VALID_MODES.includes(m)) return m;
    } catch { /* ignore malformed config */ }
  }

  // 2. Try ~/.betterask/config.yaml — can only raise, never lower.
  try {
    const home = process.env.HOME || process.env.USERPROFILE || '';
    const cfgPath = path.join(home, '.betterask', 'config.yaml');
    const content = fs.readFileSync(cfgPath, 'utf8');
    const match = content.match(/^privacy_mode:\s*(\S+)/m);
    if (match) {
      const m = match[1].toLowerCase().trim();
      if (VALID_MODES.includes(m) && MODE_SEVERITY[m] >= MODE_SEVERITY[DEFAULT_MODE]) {
        return m;
      }
    }
  } catch { /* file not found or unreadable — use default */ }

  return DEFAULT_MODE;
}

// ---------------------------------------------------------------------------
// Pattern classification
// ---------------------------------------------------------------------------

// Strong: high-precision privilege markers. Word-boundary-anchored.
// In balanced/cloud modes these return "ask" (user prompted).
const STRONG_PATTERNS = [
  // Spanish — attorney-specific
  { rx: /\bsecreto\s+profesional\b/i,                          cat: 'secreto-profesional' },
  { rx: /\bsecreto\s+de\s+las\s+comunicaciones\b/i,           cat: 'secreto-comunicaciones' },
  { rx: /\bsecreto\s+del\s+abogado\b/i,                       cat: 'secreto-abogado' },
  { rx: /\bconfidencialidad\s+abogado[-\s]?cliente\b/i,      cat: 'confidencialidad-abogado-cliente' },
  { rx: /\bprivilegio\s+de\s+la\s+defensa\b/i,                cat: 'privilegio-defensa' },
  { rx: /\bsecreto\s+del\s+mandato\b/i,                       cat: 'secreto-mandato' },
  { rx: /\bdeber\s+de\s+secreto\b/i,                          cat: 'deber-secreto' },
  { rx: /\bobligaci[oó]n\s+de\s+secreto\b/i,                  cat: 'obligacion-secreto' },
  { rx: /\bsecreto\s+profesional\s+del\s+abogado\b/i,        cat: 'secreto-profesional-abogado' },

  // English — privilege terms
  { rx: /\battorney[- ]client\s+privilege\b/i,                cat: 'attorney-client-privilege-en' },
  { rx: /\blegal\s+professional\s+privilege\b/i,              cat: 'legal-professional-privilege-en' },
  { rx: /\bsolicitor[- ]client\s+privilege\b/i,               cat: 'solicitor-client-privilege-en' },
  { rx: /\bprivileged\s+(and\s+)?confidential\b/i,            cat: 'privileged-confidential-en' },
  { rx: /\bwork[- ]product\s+(doctrine|privilege)\b/i,       cat: 'work-product-en' },

  // Legal article references — language-agnostic
  { rx: /\bArt\.?\s*24\s*LOPJ\b/i,                           cat: 'art-24-lopj' },
  { rx: /\bArt\.?\s*542\s*CP\b/i,                            cat: 'art-542-cp' },
  { rx: /\bArt\.?\s*21\s*Estatuto\s+General\b/i,             cat: 'art-21-estatuto-abogacia' },
  { rx: /\bArt\.?\s*458\s*CP\b/i,                            cat: 'art-458-cp' },
  { rx: /\bArt\.?\s*419\s*CP\b/i,                            cat: 'art-419-cp' },
];

// Weak: low-precision terms. Trigger only with a discriminator present.
const WEAK_PATTERNS = [
  { rx: /\bconfidencial\b/i,        cat: 'confidencial-bare' },
  { rx: /\breservado\b/i,          cat: 'reservado-bare' },
  { rx: /\bprivado\b/i,            cat: 'privado-bare' },
  { rx: /\bconfidential\b/i,       cat: 'confidential-bare' },
];

// Legal-context path segments that raise a weak match to actionable.
const DISCRIMINATOR_PATH = new RegExp(
  '(^|[\\\\/])' +
  '(cliente[s]?|abogado[s]?|caso[s]?|expediente[s]?|dossier|dossiers' +
  '|asunto[s]?|procedimiento[s]?|materia[s]?|privileged|matter|matters|case[-_]files' +
  '|juicio[s]?|pleito[s]?|recurso[s]?|demanda[s]?|escrito[s]?)' +
  '([\\\\/.]|$)',
  'i'
);

// Legal-context content markers (client/case references, process terms).
const DISCRIMINATOR_CONTENT = new RegExp(
  '\\b(' +
  'cliente[s]?|mandante[s]?|mandatario[s]?|representado[s]?' +
  '|abogado[s]?|procurador[as]?|letrado[s]?' +
  '|expediente[s]?|numero\s+de\s+procedimiento|referencia\s+de\s+asunto' +
  '|procedimiento[s]?|juicio[s]?|pleito[s]?|recurso[s]?' +
  '|demanda[s]?|escrito[s]?|alegacion[es]?' +
  ')\\b',
  'i'
);

/**
 * Classify content and return {category, strength} or null.
 * strength: 'strong' or 'weak' — used by callers to pick deny vs ask.
 */
function classify(content, pathHint) {
  for (const p of STRONG_PATTERNS) {
    if (p.rx.test(content)) return { category: p.cat, strength: 'strong' };
  }
  for (const p of WEAK_PATTERNS) {
    if (p.rx.test(content) && hasDiscriminator(content, pathHint)) {
      return { category: p.cat + '+context', strength: 'weak' };
    }
  }
  return null;
}

/** Check if a tool name refers to the local Ollama MCP server. */
function isOllamaTool(toolName) {
  return typeof toolName === 'string' && toolName.startsWith('mcp__ollama__');
}

/**
 * Apply privacy mode logic on top of classify().
 * Returns {category, decision} or null.
 *
 * @param {string} toolName — tool being invoked (used for Ollama exemption)
 */
function classifyWithMode(content, pathHint, mode, toolName) {
  if (mode === 'strict') {
    // Ollama is local — always exempt from strict blocking.
    if (isOllamaTool(toolName)) return null;
    // Strict applies balanced-like pattern matching but with deny instead of ask.
    // Content without privilege markers is allowed through so MCP servers remain usable.
    const result = classify(content, pathHint);
    if (result) return { category: result.category, decision: 'deny' };
    return null;
  }

  const result = classify(content, pathHint);
  if (!result) return null;

  if (result.strength === 'strong') {
    // Strong patterns prompt the user — they can choose to proceed.
    return { category: result.category, decision: 'ask' };
  }

  // Weak patterns:
  if (mode === 'cloud') {
    // In cloud mode, weak patterns are allowed without prompt.
    return null;
  }

  // balanced (default): weak patterns prompt for confirmation.
  return { category: result.category, decision: 'ask' };
}

function hasDiscriminator(content, pathHint) {
  if (pathHint && DISCRIMINATOR_PATH.test(pathHint)) return true;
  if (DISCRIMINATOR_CONTENT.test(content)) return true;
  // Two distinct weak markers co-occurring is itself suspicious.
  let weakHits = 0;
  for (const p of WEAK_PATTERNS) if (p.rx.test(content)) weakHits++;
  return weakHits >= 2;
}

// ---------------------------------------------------------------------------
// Module export for tests; run as script when invoked directly.
// ---------------------------------------------------------------------------

module.exports = {
  classify,
  classifyWithMode,
  isOllamaTool,
  resolvePrivacyMode,
  extractTextFromInput,
  extractPathHint,
  extractBashFilePaths,
  hasDiscriminator,
  STRONG_PATTERNS,
  WEAK_PATTERNS,
  DISCRIMINATOR_PATH,
  MODE_SEVERITY,
  DEFAULT_MODE,
};

if (require.main === module) {
  main();
}
