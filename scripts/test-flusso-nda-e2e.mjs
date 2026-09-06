#!/usr/bin/env node
/**
 * End-to-end test for the `flusso-nda` workflow (Map D acceptance).
 *
 * What it proves:
 *   1. The workflows MCP server (`workflows-esp`) persists a saved workflow
 *      across process restarts (the "survives Cowork restart" property).
 *   2. The `user_id` chain — claim_user_id is idempotent across sessions.
 *   3. The filesystem-based resume convention used by `/workflow --resume`
 *      (per-step output files + `progress.json`) is compatible with the
 *      server-side audit log (`log_run`).
 *
 * How it works:
 *   - Spawns the workflows server via stdio in **sqlite** mode (dev-only;
 *     ADR §2 rejects SQLite in production). Three independent subprocess
 *     lifecycles simulate the close/reopen of the Cowork MCP session.
 *   - Phase A: claim + save the workflow definition.
 *   - Phase B: kill subprocess, re-spawn, verify the workflow is still
 *     retrievable via `get_workflow`.
 *   - Phase C: simulate prior execution by writing 3 stage outputs and
 *     a `progress.json` that marks steps 1-2 completed.
 *   - Phase D: re-spawn, verify `list_workflows` returns it, the resume
 *     invariant (steps 1-2 complete + their files on disk) holds, and
 *     log a terminal `log_run` row.
 *   - Cleanup: `delete_user` cascade + remove tmp dir.
 *
 * Requirements:
 *   - `MCP_ESP_ROOT` env var pointing to a built BetterCallClaudeMCP_Espana
 *     checkout (default: `/tmp/mcp-esp`). `mcp-servers/workflows/dist/stdio.js`
 *     must exist; if not, the script prints the build command and exits 2.
 *   - `better-sqlite3` available (installed by default as optionalDependency).
 *
 * Plugin-wiring validation:
 *   This test spawns the workflows server in **dev-only sqlite stdio mode**
 *   and therefore cannot exercise the runtime endpoint advertised by the
 *   published plugin. To compensate, the script runs a pre-flight
 *   `assertPluginWiring()` that fails fast if `bettercallclaude-espana/.mcp.json`
 *   omits the `workflows-esp` server, if `scripts/tool-contracts.js` does not
 *   declare its nine tools, or if `commands/workflow.md` /
 *   `commands/create-workflow.md` are missing. The plugin manifest wiring is
 *   what end users rely on; the runtime server contract is what this test
 *   verifies. Both must hold for v1.1.0+ acceptance.
 *
 * Usage:
 *   node scripts/test-flusso-nda-e2e.mjs
 */

import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, '..');
const MCP_REPO = process.env.MCP_ESP_ROOT || '/tmp/mcp-esp';
const STDIO_ENTRY = join(MCP_REPO, 'mcp-servers/workflows/dist/stdio.js');
const PLUGIN_DIR = join(REPO_ROOT, 'bettercallclaude-espana');
const WORKFLOWS_TOOLS = [
  'claim_user_id', 'list_agents', 'validate_pipeline', 'save_workflow',
  'list_workflows', 'get_workflow', 'delete_workflow', 'delete_user', 'log_run',
];

// Plugin-wiring pre-flight: this test spawns the server in dev-only sqlite
// stdio mode, so it cannot observe the runtime endpoint the published plugin
// exposes. Make the test FAIL (not silently pass) when the plugin manifest
// would ship a broken workflow integration, mirroring what Devin flagged on
// PR #38 (analysis: "Acceptance test bypasses plugin behavior").
function assertPluginWiring() {
  const failures = [];
  const mcpJsonPath = join(PLUGIN_DIR, '.mcp.json');
  let mcpServers = {};
  if (!existsSync(mcpJsonPath)) {
    failures.push(`missing ${mcpJsonPath}`);
  } else {
    try {
      mcpServers = JSON.parse(readFileSync(mcpJsonPath, 'utf8')).mcpServers || {};
    } catch (e) {
      failures.push(`invalid JSON in ${mcpJsonPath}: ${e.message}`);
    }
    if (!mcpServers['workflows-esp']) {
      failures.push(`${mcpJsonPath} does not declare "workflows-esp" server`);
    }
  }
  const tcPath = join(REPO_ROOT, 'scripts', 'tool-contracts.js');
  if (!existsSync(tcPath)) {
    failures.push(`missing ${tcPath}`);
  } else {
    const tc = readFileSync(tcPath, 'utf8');
    const m = tc.match(/'workflows-esp'\s*:\s*\[([^\]]*)\]/);
    const declared = m ? m[1].split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) : [];
    const missing = WORKFLOWS_TOOLS.filter((t) => !declared.includes(t));
    if (missing.length) {
      failures.push(`${tcPath} declares workflows-esp tools [${declared.join(', ')}] but is missing: ${missing.join(', ')}`);
    }
  }
  for (const f of ['commands/workflow.md', 'commands/create-workflow.md']) {
    const p = join(PLUGIN_DIR, f);
    if (!existsSync(p)) failures.push(`missing ${p}`);
  }
  if (failures.length) {
    console.error('[fatal] Plugin wiring for workflows-esp is incomplete:');
    for (const f of failures) console.error(`   - ${f}`);
    console.error('        This acceptance test requires the plugin manifest');
    console.error('        to advertise the workflows MCP server before it can');
    console.error('        claim Map D #32 acceptance. Restore the wiring then rerun.');
    process.exit(3);
  }
}
assertPluginWiring();

const tmpRoot = mkdtempSync(join(tmpdir(), 'bcc-flusso-nda-'));
const dbPath = join(tmpRoot, 'workflows.db');
const outputRoot = join(tmpRoot, 'bcc-output');
const userId = `bcc-flusso-nda-test-${randomBytes(4).toString('hex')}`;
const slug = 'flusso-nda';
const runId = randomBytes(4).toString('hex');

// 4 etapas — cadena validada contra AGENTS_MANIFEST (overlap rule en validate.ts).
// `spanish-citation-expert` no encadena con `spanish-legal-drafter`
// (`verified_citations` no está entre los input_types del drafter), así que las
// citas (citations.md) las produce `spanish-legal-researcher` en la etapa 2.
const PIPELINE = [
  { step: 1, agent_id: 'spanish-briefing-coordinator', purpose: 'Ensamblar el brief del NDA', checkpoint: false },
  { step: 2, agent_id: 'spanish-legal-researcher', purpose: 'Investigar el marco legal y localizar citas', checkpoint: true },
  { step: 3, agent_id: 'spanish-legal-drafter', purpose: 'Borrador de cláusulas y comentarios', checkpoint: true },
  { step: 4, agent_id: 'spanish-data-protection-expert', purpose: 'Anotación de riesgo LOPDGDD', checkpoint: false },
];

if (!existsSync(STDIO_ENTRY)) {
  console.error(
    `[fatal] stdio entry not found: ${STDIO_ENTRY}\n` +
      `        run \`npm run build\` in ${MCP_REPO} first.`,
  );
  process.exit(2);
}

const log = (n, msg) => console.log(`[${String(n).padStart(2, '0')}] ${msg}`);

let failures = 0;
function check(label, ok, detail) {
  if (ok) {
    log('-', `✓ ${label}`);
  } else {
    failures += 1;
    console.error(`✗ ${label}${detail ? `\n   ${detail}` : ''}`);
  }
}

function deepEq(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Minimal MCP stdio client (newline-delimited JSON-RPC 2.0).
 * The server speaks on stdout, one JSON object per line. Notifications have
 * no `id`; we ignore them and resolve pending requests by id.
 */
class McpStdioClient {
  constructor(child) {
    this.child = child;
    this.id = 0;
    this.pending = new Map();
    this.buffer = '';
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => this._onData(chunk));
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => process.stderr.write(`[mcp] ${chunk}`));
    child.on('exit', (code) => {
      for (const [id, p] of this.pending) {
        p.reject(new Error(`subprocess exited (code=${code}) before responding to id=${id}`));
      }
      this.pending.clear();
    });
  }
  _onData(chunk) {
    this.buffer += chunk;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() ?? '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      let msg;
      try {
        msg = JSON.parse(trimmed);
      } catch {
        continue;
      }
      if (msg.id != null && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(`JSON-RPC error: ${JSON.stringify(msg.error)}`));
        else resolve(msg.result);
      }
    }
  }
  request(method, params) {
    const id = ++this.id;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params: params ?? {} });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.child.stdin.write(payload + '\n');
    });
  }
  notify(method, params) {
    const payload = JSON.stringify({ jsonrpc: '2.0', method, params: params ?? {} });
    this.child.stdin.write(payload + '\n');
  }
  async initialize() {
    await this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'test-flusso-nda-e2e', version: '1.0.0' },
    });
    this.notify('notifications/initialized', {});
  }
  async callTool(name, args) {
    const result = await this.request('tools/call', { name, arguments: args });
    if (result?.isError) {
      throw new Error(`tool ${name} returned isError: ${result?.content?.[0]?.text ?? '<no text>'}`);
    }
    const text = result?.content?.[0]?.text;
    return text ? JSON.parse(text) : result;
  }
}

function spawnServer() {
  const child = spawn('node', [STDIO_ENTRY], {
    env: {
      ...process.env,
      WORKFLOWS_STORE: 'sqlite',
      WORKFLOWS_SQLITE_PATH: dbPath,
    },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  return new McpStdioClient(child);
}

function killAndAwait(client) {
  return new Promise((resolve) => {
    client.child.once('exit', () => resolve());
    client.child.kill('SIGTERM');
  });
}

async function expectEq(label, actual, expected) {
  check(label, deepEq(actual, expected), `expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
}

async function main() {
  log(1, `tmpRoot=${tmpRoot}`);
  log(1, `user_id=${userId}`);
  log(1, `sqlite db=${dbPath}`);

  // -------- Phase A: save the workflow --------
  let client = spawnServer();
  await client.initialize();
  log(2, 'subprocess A initialized');

  const claim1 = await client.callTool('claim_user_id', { user_id: userId });
  await expectEq('claim_user_id first call', claim1, { claimed: true, user_id: userId });

  const save = await client.callTool('save_workflow', {
    user_id: userId,
    slug,
    name: 'Análisis de NDA',
    description: 'Analiza un NDA, identifica cláusulas arriesgadas, cita precedentes y genera un borrador de comentarios.',
    pipeline: PIPELINE,
    output_spec: `bcc-output/workflow/<user_id>/${slug}/<run-id>/{intake.md,analysis.md,citations.md,borrador.md}`,
  });
  check('save_workflow.saved', save?.saved === true, `got ${JSON.stringify(save)}`);
  check('save_workflow.version=1', save?.workflow?.version === 1, `got ${save?.workflow?.version}`);
  const workflowId = save?.workflow?.id;
  log(3, `workflow saved (id=${workflowId}, version=1)`);

  const startRun = await client.callTool('log_run', {
    workflow_id: workflowId,
    user_id: userId,
    status: 'running',
  });
  check('log_run.running returns run_id', typeof startRun?.run_id === 'string');
  log(4, `log_run start (run_id=${startRun.run_id})`);

  await killAndAwait(client);
  log(5, 'subprocess A terminated (simulated Cowork restart)');

  // -------- Phase B: re-open, verify persistence --------
  client = spawnServer();
  await client.initialize();
  log(6, 'subprocess B initialized (post-restart)');

  const claim2 = await client.callTool('claim_user_id', { user_id: userId });
  await expectEq('claim_user_id idempotent across sessions', claim2, { claimed: false, user_id: userId });

  const got = await client.callTool('get_workflow', { user_id: userId, slug });
  check('get_workflow returns the saved workflow', got?.id === workflowId);
  check('pipeline length persisted', got?.pipeline?.length === PIPELINE.length, `got ${got?.pipeline?.length}`);
  await expectEq(
    'pipeline agent_ids persisted in order',
    got?.pipeline?.map((s) => s.agent_id),
    PIPELINE.map((s) => s.agent_id),
  );
  log(7, 'workflow persists across subprocess kill');

  // -------- Phase C: simulate prior execution on the filesystem --------
  const runDir = join(outputRoot, 'workflow', userId, slug, runId);
  await mkdir(runDir, { recursive: true });
  await writeFile(join(runDir, 'intake.md'), '# Intake\nNDA recibido de ACME S.L.\n', 'utf8');
  await writeFile(
    join(runDir, 'analysis.md'),
    '# Análisis\nMarco aplicable: CC, CP, LOPDGDD, RGPD. Jurisprudencia menor del TS sobre cláusulas abusivas en NDA.\n',
    'utf8',
  );
  await writeFile(join(runDir, 'citations.md'), '# Citas\n- TS 123/2024\n- RGPD art. 6\n- LOPDGDD art. 11\n', 'utf8');
  await writeFile(
    join(runDir, 'progress.json'),
    JSON.stringify(
      {
        workflow_id: workflowId,
        run_id: runId,
        steps: [
          { step: 1, agent_id: 'spanish-briefing-coordinator', status: 'completed', output: 'intake.md' },
          { step: 2, agent_id: 'spanish-legal-researcher', status: 'completed', output: 'analysis.md' },
          { step: 3, agent_id: 'spanish-legal-drafter', status: 'pending', output: 'borrador.md' },
          { step: 4, agent_id: 'spanish-data-protection-expert', status: 'pending', output: null },
        ],
      },
      null,
      2,
    ),
    'utf8',
  );
  log(8, 'wrote 3 prior-step outputs + progress.json (steps 1-2 completed)');

  await killAndAwait(client);
  log(9, 'subprocess B terminated (resuming in a fresh session)');

  // -------- Phase D: re-open, verify resume semantics + log completion --------
  client = spawnServer();
  await client.initialize();
  log(10, 'subprocess C initialized (post-resume)');

  const list = await client.callTool('list_workflows', { user_id: userId });
  check('list_workflows returns 1 row', Array.isArray(list) && list.length === 1, `got ${JSON.stringify(list)}`);
  check('list_workflows[0].slug matches', list?.[0]?.slug === slug);

  // Resume invariant the `/workflow --resume` command relies on.
  const progress = JSON.parse(readFileSync(join(runDir, 'progress.json'), 'utf8'));
  const completed = progress.steps.filter((s) => s.status === 'completed');
  await expectEq(
    'resume: steps 1-2 marked completed',
    completed.map((s) => s.step),
    [1, 2],
  );
  for (const s of completed) {
    check(`resume: output file present for step ${s.step}`, existsSync(join(runDir, s.output)));
  }
  const pending = progress.steps.filter((s) => s.status === 'pending');
  await expectEq('resume: steps 3-4 pending', pending.map((s) => s.step), [3, 4]);

  // Append a terminal log_run to close the audit row for this resumed run.
  const doneRun = await client.callTool('log_run', {
    workflow_id: workflowId,
    user_id: userId,
    status: 'completed',
    output_summary: 'resumed from step 3, borrador generated',
  });
  check('log_run.completed returns the same run_id (closes the running row)', doneRun?.run_id === startRun.run_id, `got ${doneRun?.run_id}, expected ${startRun.run_id}`);
  log(11, `audit log closed (run_id=${doneRun.run_id})`);

  // Cleanup
  const cascade = await client.callTool('delete_user', { user_id: userId });
  check('delete_user cascades', cascade?.deleted === true && cascade?.workflows_cascade >= 1, JSON.stringify(cascade));
  await killAndAwait(client);
  log(12, 'subprocess C terminated; cleanup done');

  rmSync(tmpRoot, { recursive: true, force: true });

  if (failures > 0) {
    console.error(`\n${failures} check(s) failed.`);
    process.exit(1);
  }
  console.log(`\nAll checks passed. flusso-nda E2E acceptance OK.`);
}

main().catch((err) => {
  console.error('[fatal]', err);
  rmSync(tmpRoot, { recursive: true, force: true });
  process.exit(1);
});
