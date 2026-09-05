# Wayfinder Map D — research: workflows-ch MCP server (Swiss plugin)

**Ticket:** [#31 / t30](https://github.com/fedec65/bettercallclaude-espana/issues/31)
**Author:** sub-agent (Wayfinder Map D)
**Date:** 2026-09-05
**Scope:** schema, behavior, storage, auth, plugin-side protocol, and Spanish fork feasibility of the `workflows-ch` MCP server that ships with `fedec65/bettercallclaude`.

---

## TL;DR

- `workflows-ch` is an MCP server in **`fedec65/BetterCallClaudeMCP`** (not the plugin repo). It exposes **8 tools** (`list_agents`, `validate_pipeline`, `save_workflow`, `list_workflows`, `get_workflow`, `delete_workflow`, `claim_user_id`, `log_run`) at `https://mcp.bettercallclaude.ch/workflows-ch/mcp` (HTTP Streamable, MCP protocol `2025-06-18`).
- **Storage is Postgres-only** (`pg` Pool, `DATABASE_URL` env var). Schema is 4 tables (`agents_manifest`, `workflows`, `workflow_runs`, `claimed_ids`), idempotent on cold start. No SQLite path; no migration runner.
- **Auth is self-asserted.** `user_id` is a plain string passed as a tool argument — no header plumbing, no token. Uniqueness is enforced by `claimed_ids.user_id PRIMARY KEY`. The "4-fallback chain" is **plugin-side, not server-side**: plugin setting → custom-instructions line → `~/.betterask/config.yaml` → generate `bcc-<8 hex>` + `claim_user_id`.
- **Plugin consumers (only two commands):** `/bettercallclaude:workflow` and `/bettercallclaude:create-workflow`. `legal-loop`/`legal-goal` do **not** call workflows-ch despite the v4.11.0 README framing.
- **Spanish fork landscape:** `fedec65/BetterCallClaudeMCP_Espana` has 11 servers (boe-legislacion, legal-citations-esp, legal-persona-esp, cendoj-jurisprudencia, tribunal-constitucional, eu-law-esp, congreso-debates, doctrina-academica, derecho-historico, catalunya-legal, busqueda-general) but **no `workflows` workspace yet** and **no `workflows-esp` HTTP route**.
- **Licensing:** AGPL-3.0-or-later, both upstream repos. Forking and re-publishing the workspace as `workflows-esp` is permitted and is the pattern the Italian fork (`BetterCallClaudeMCP_Italy` → `workflows-ita`) already follows.
- **Recommended path:** **fork the `mcp-servers/workflows` workspace, swap the manifest for the Spanish plugin's chainable agents, register the new HTTP route, mirror the Italian `workflows-ita` precedent.** Lowest risk, lowest cost, fully precedent.

---

## workflows-ch source location

| Item | Value |
|---|---|
| Repo | `fedec65/BetterCallClaudeMCP` |
| Server workspace | `mcp-servers/workflows/` (npm name `@bettercallclaude/workflows-mcp`) |
| HTTP aggregator wrapper | `mcp-servers-http/src/servers/workflows-ch.ts` |
| Wired HTTP route | `POST /workflows-ch/mcp` (Express, `mcp-servers-http/src/index.ts`) |
| Tests | `mcp-servers-http/src/servers/__tests__/workflows-ch.test.ts` |
| Server self-declared version | `1.1.0` (in both the `createWorkflowsChServer()` constructor and `package.json`) |
| Main HEAD SHA observed | `8f4ccd0cf4d16e6d5eb94ef69b2abb169654bd19` |
| Public endpoint | `https://mcp.bettercallclaude.ch/workflows-ch/mcp` |
| Spec / plan doc | `fedec65/bettercallclaude` → `docs/project-management/2026-08-26-workflows-ch-plan.md` |
| License | AGPL-3.0-or-later |

Repository layout (workspace root):

```
mcp-servers/workflows/
├── package.json          # @bettercallclaude/workflows-mcp v1.1.0
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── index.ts          # barrel
    ├── types.ts          # zod schemas: PipelineStep, UserId, Slug, Visibility, tool inputs
    ├── validate.ts       # AgentManifestEntry, ValidationError, validatePipeline()
    ├── manifest.ts       # AGENTS_MANIFEST — 16 chainable Swiss agents (seeded on boot)
    ├── sql.ts            # SCHEMA_SQL — 4 CREATE TABLE IF NOT EXISTS blocks
    ├── db.ts             # Pool from DATABASE_URL, ensureSchema() idempotent seed
    ├── tools.ts          # WorkflowRow, WorkflowValidationError, 8 tool functions
    └── __tests__/        # (empty in upstream — tests live in mcp-servers-http)
```

`mcp-servers-http/src/servers/workflows-ch.ts` (≈190 LoC) is the **thin MCP boundary**: it declares the 8 tool descriptors (`inputSchema`, `annotations`), validates args with zod at the boundary (so invalid input returns a zod envelope even when `DATABASE_URL` is unset), calls the tool functions, and maps errors into the MCP error envelope (`isError: true` + JSON `text`).

---

## Tool catalog

All 8 tools. Tool names: kebab-case verbs/nouns; no `mcp__…__` prefix server-side, prefix is added by the client (`mcp__plugin_bettercallclaude_workflows-ch__*` and `mcp__workflows-ch__*`, both registered in Swiss commands — see "Plugin-side protocol" below).

| Tool | Purpose | Inputs | Outputs | Errors |
|---|---|---|---|---|
| `list_agents` | Return the 16 chainable Swiss plugin agents with their I/O type sets and MCP server bindings. Used to drive the create-workflow interview. | none | `AgentManifestEntry[]` (16 rows) | zod envelope if arg shape violated (none expected) |
| `validate_pipeline` | Stateless check of a pipeline against the manifest; does **not** persist. Returns `{valid, errors}[]`. | `{ pipeline: PipelineStep[] }` (min 1; `step` ≥ 1; `agent_id`, `purpose` required; `checkpoint?` bool) | `{ valid: boolean, errors: ValidationError[] }` (codes: `unknown_agent`, `incompatible_chaining`, `non_sequential_steps`) | zod envelope on bad input |
| `save_workflow` | Upsert a workflow keyed by `(user_id, slug)`; re-validates server-side before write; bumps `version`. | `{ user_id, slug, name, description, pipeline[], output_spec, visibility?: 'private'|'team'|'public' default 'private' }` | `{ saved: true, workflow: WorkflowRow }` | `WorkflowValidationError` → `{ valid:false, errors }`; zod envelope; or generic DB error envelope |
| `list_workflows` | List active workflows visible to caller (own + optionally team + public). | `{ user_id, include_team?: bool, include_public?: bool }` | array of `{ slug, name, description, visibility, version, updated_at }` | zod envelope |
| `get_workflow` | Fetch one workflow by slug, owner-or-visible check. | `{ user_id, slug }` | `WorkflowRow` (full pipeline + metadata) | throws `'Workflow not found (or not visible to this user_id)'` → generic error envelope |
| `delete_workflow` | Delete one of the caller's own workflows (owner-only — `WHERE user_id = $1`). | `{ user_id, slug }` | `{ deleted: boolean }` | zod envelope |
| `claim_user_id` | Reserve `user_id` in `claimed_ids` table (`ON CONFLICT DO NOTHING`). | `{ user_id }` | `{ claimed: boolean, user_id }` — `claimed:false` if already taken | zod envelope |
| `log_run` | Append an audit row to `workflow_runs`; sets `completed_at` automatically unless `status='running'`. | `{ workflow_id: UUID, user_id, status: 'running'\|'completed'\|'failed'\|'abandoned', output_summary? }` | `{ run_id: UUID }` | zod envelope; FK violation if `workflow_id` doesn't exist (wrapped as generic envelope) |

**Schema constraints (from `src/types.ts`):**

- `user_id`: 1–128 chars, regex `^[A-Za-z0-9._@-]+$`
- `slug`: 1–64 chars, regex `^[a-z0-9][a-z0-9-]*$` (kebab-case)
- `purpose`: 1–500 chars
- `name`: 1–200; `description`/`output_spec`: 1–2000
- `output_summary`: ≤ 4000 chars
- `pipeline[].step`: positive int, must be sequential `1..N` (validator checks `step === i+1`)
- `workflow_id`: must be a UUID

**Error envelope (uniform across all tools):**

```json
// Success
{ "content": [{ "type": "text", "text": "<JSON.stringify(value, null, 2)>" }] }

// Zod input violation
{ "content": [{ "type": "text", "text": "{ \"error\": \"invalid_input\", \"issues\": [...] }" }], "isError": true }

// Pipeline validation failure (save_workflow / validate_pipeline)
{ "content": [{ "type": "text", "text": "{ \"valid\": false, \"errors\": [{ \"code\": \"...\", \"step\": N, \"message\": \"...\" }] }" }], "isError": true }

// Generic
{ "content": [{ "type": "text", "text": "{ \"error\": \"<message>\" }" }], "isError": true }
```

The `Italian fork AGENTS.md` confirms this shape was deliberate: "i tool di `workflows-ita` … non hanno prefisso, per parità di contratto col server svizzero `workflows-ch` … risponde con JSON libero + `isError`, e `WorkflowValidationError` → `{valid:false, errors}`." Spanish fork must mirror this exactly for parity.

**Annotations (from the MCP server `tools/list`):**

| Tool | readOnlyHint | destructiveHint |
|---|---|---|
| `list_agents` | true | false |
| `validate_pipeline` | true | false |
| `save_workflow` | false | false |
| `list_workflows` | true | false |
| `get_workflow` | true | false |
| `delete_workflow` | false | **true** |
| `claim_user_id` | false | false |
| `log_run` | false | false |

---

## Storage backend

**Engine: PostgreSQL** (no other backend supported).

| Aspect | Value |
|---|---|
| Driver | `pg` (node-postgres) ^8.11.0 |
| Connection | `process.env.DATABASE_URL` (mandatory — server throws `DATABASE_URL environment variable is not set …` on first request if absent) |
| Pool size | `max: 5` |
| SSL | `{ rejectUnauthorized: false }` for managed Postgres (Railway); auto-disabled when `DATABASE_URL` matches localhost / 127.0.0.1 / `[::1]` or contains `sslmode=` (local dev + explicit sslmode both respected) |
| Migrations | None — schema is created idempotently on first cold start (`ensureSchema()`), memoized per process |
| Retention | None explicitly defined — `workflow_runs` and `workflows` rows persist until manually deleted; no TTL, no archival |

**Schema (verbatim from `src/sql.ts`):**

```sql
CREATE TABLE IF NOT EXISTS agents_manifest (
    id              SERIAL PRIMARY KEY,
    agent_id        TEXT NOT NULL UNIQUE,
    display_name    TEXT NOT NULL,
    input_types     TEXT[] NOT NULL,
    output_types    TEXT[] NOT NULL,
    mcp_servers     TEXT[] NOT NULL,
    is_terminal     BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS workflows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- requires pgcrypto or pg13+
    user_id         TEXT NOT NULL,
    slug            TEXT NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT NOT NULL,
    pipeline        JSONB NOT NULL,
    output_spec     TEXT NOT NULL,
    visibility      TEXT NOT NULL DEFAULT 'private'
                        CHECK (visibility IN ('private','team','public')),
    status          TEXT NOT NULL DEFAULT 'active'
                        CHECK (status IN ('draft','active','archived')),
    version         INT NOT NULL DEFAULT 1,
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, slug)
);

CREATE TABLE IF NOT EXISTS workflow_runs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id     UUID REFERENCES workflows(id) ON DELETE CASCADE,
    user_id         TEXT NOT NULL,
    started_at      TIMESTAMPTZ DEFAULT now(),
    completed_at    TIMESTAMPTZ,
    status          TEXT CHECK (status IN ('running','completed','failed','abandoned')),
    output_summary  TEXT
);

CREATE TABLE IF NOT EXISTS claimed_ids (
    user_id         TEXT PRIMARY KEY,
    created_at      TIMESTAMPTZ DEFAULT now()
);
```

**Seed on cold start (`ensureSchema`):** every entry of `AGENTS_MANIFEST` is upserted into `agents_manifest` with `ON CONFLICT (agent_id) DO UPDATE`. Memoise the promise per process; reset on error so next request can retry.

**Visibility semantics (from `src/tools.ts`):**

- `list_workflows`: `WHERE status='active' AND (user_id = $1 OR (visibility='team' AND $2) OR (visibility='public' AND $3))`
- `get_workflow`: `WHERE slug=$1 AND status != 'archived' AND (user_id = $2 OR visibility IN ('team','public'))`
- `delete_workflow`: `WHERE user_id = $1 AND slug = $2` (owner-only by construction — no team membership model exists)
- `save_workflow`: upsert keyed on `(user_id, slug)`; bumps `version` and `updated_at`

**Operational notes for a Spanish fork:**

- `gen_random_uuid()` requires `pgcrypto` (or PG ≥ 13 with `pgcrypto` available — Railway's managed Postgres ships it; verify on self-hosted).
- The `team` visibility is intentionally coarse: there is **no team-membership table**. `include_team=true` simply returns every workflow where `visibility='team'`, regardless of caller. Spec deviation called out in the plan doc; should be addressed if Spanish plugin wants true tenancy.
- Schema is anonymous (no GDPR-style identifier hashing). For Spanish deployment under LOPDGDD, consider adding a per-tenant schema or a `tenant_id` column at the fork level.

---

## Auth & user_id resolution chain

**Server-side: there is no authentication.** Every tool takes `user_id` as a plain string parameter. The server enforces only that `user_id` (when claimed) is unique, and that `delete_workflow` matches both `user_id` and `slug`. The plan doc is explicit: *"Server is public/unauthenticated by explicit publisher decision (same as the Italia gateway); `user_id` is self-asserted. Document that use"*. Anyone with a `user_id` value can read all workflows belonging to that ID. This is the **possession-of-secret-as-auth** model — the `user_id` *is* the capability.

**Plugin-side: the "4-fallback chain".** Both `workflow.md` and `create-workflow.md` use the exact same resolution order (verbatim from `commands/workflow.md` lines 76–93):

1. **Plugin setting:** `${user_config.user_id}` if the placeholder resolved to a non-empty value (the placeholder does **not** appear literally).
2. **Custom instructions** (Cowork Desktop): scan session custom instructions for a line `BetterCallClaude workflow user ID: <id>`. This is the durable source on Cowork because instructions survive sandbox wipes.
3. **Local config:** read `~/.betterask/config.yaml`; if it contains `user_id: …`, use that value. Convenience cache — Cowork wipes the sandbox home directory on restart.
4. **Generate-once-claim-persist:** run `openssl rand -hex 8`, build `bcc-<hex>`, call `claim_user_id`; on `claimed: false` (collision, statistically negligible with 64-bit random IDs) regenerate and retry up to 3 attempts; on persistent collision, ask the user to choose manually. On success, **append** `user_id: bcc-<hex>` to `~/.betterask/config.yaml` (the file may also hold `privacy_mode`, so append-only is mandatory — never overwrite).
5. If the config file cannot be written, skip step 4 entirely and **never** fall back to a shared `default` ID. Tell the user to add the ID to Cowork's Instructions line or set the CLI plugin setting.

**Claim-before-use:** for IDs from steps 1, 2, or 3, `claim_user_id` is called once before the first workflow operation. On `claimed: false`, a one-time informational note is shown ("already registered on the server — if it's yours from another machine, ignore; otherwise set a different ID") and execution continues.

**For the Spanish plugin port:** this chain lives **entirely in the command markdown** — no server changes are required to replicate the UX. The Spanish plugin needs to (a) declare a `user_id` setting in `.claude-plugin/plugin.json`, (b) paste the same chain into `comando-workflow.md` / `comando-crear-workflow.md`, and (c) call the Spanish server tool names with the same params.

---

## Plugin-side protocol

Only **two** Swiss plugin commands call `workflows-ch`. Both register the tool under two prefix conventions in the `tools:` frontmatter (the CI check enforces both are present per the v4.11.8 changelog fix):

### `/bettercallclaude:create-workflow`

`commands/create-workflow.md` — interview → validate → save. Calls (in order):

1. *(optional, only if no `user_id` yet)* `claim_user_id(user_id)` — to reserve a freshly generated `bcc-…`.
2. `list_agents()` — to present the table to the user.
3. `validate_pipeline(pipeline)` — every iteration after a fix until `valid: true`.
4. `save_workflow({ user_id, slug, name, description, pipeline, output_spec, visibility? })` — single call, the server re-validates and upserts.

On server-side validation error during `save_workflow` (rare, because the client already validated), the command loops back to step 3 with the server's `errors[]`.

Tool prefix registration: `mcp__plugin_bettercallclaude_workflows-ch__claim_user_id`, `mcp__workflows-ch__claim_user_id`, plus the same pair for `list_agents`, `validate_pipeline`, `save_workflow`.

### `/bettercallclaude:workflow`

`commands/workflow.md` — run a fixed or saved pipeline. Calls (in order):

1. `claim_user_id(user_id)` — once per session, before listing, for any non-default ID.
2. `list_workflows({ user_id, include_public: true })` — to interleave saved workflows with the 5 fixed templates (`litigation-prep`, `due-diligence`, `contract-lifecycle`, `real-estate-closing`, `adversarial-review`).
3. `get_workflow({ user_id, slug })` — when the user picks a saved workflow, to fetch the full `pipeline[]`.

The selected pipeline's `pipeline[].agent_id` names a plugin agent and `pipeline[].checkpoint` controls pause-for-confirmation. Execution is then driven by the same stage-execution logic as a fixed template.

Tool prefix registration: `mcp__plugin_bettercallclaude_workflows-ch__{claim_user_id,list_workflows,get_workflow}`, plus the `mcp__workflows-ch__` variants.

**Also mentioned in:** `commands/setup.md` and `commands/doctor.md` call `list_workflows` for connectivity probing (note: this is a probe, not a consumer); `commands/help.md` and `commands/version.md` reference the server for documentation only.

**Not consumers:** `legal-loop` and `legal-goal` are worker-evaluator cycle commands — they read/write goal records to `bcc-output/goals/<id>.md` and run the legal-evaluator skill, not the workflows-ch server. Their `tools:` frontmatter does **not** list any `workflows-ch__*` tool.

### Call sequence diagram (text)

```
create-workflow                         workflow
─────────────                           ────────
  (resolve user_id)                       (resolve user_id)
       │                                       │
  claim_user_id ──┐                       claim_user_id
                  │                            │
  list_agents     │                       list_workflows (include_public)
                  │                            │
  validate_pipeline (loop)                get_workflow (when picked)
                  │                            │
  save_workflow   │                       [execute pipeline via orchestrator]
                  │
  (next command)  │
```

---

## Spanish MCP repo landscape

**Repo:** `fedec65/BetterCallClaudeMCP_Espana` — default branch `master`, no LICENSE file at the time of the snapshot (license is inferred as AGPL-3.0-or-later by parity with the Swiss repo and the Italian fork; should be verified before any public deployment). 11 workspaces:

| Workspace | Server name in `.mcp.json` | Endpoint |
|---|---|---|
| `boe-legislacion` | `boe-legislacion` | `https://mcp.bettercallclaude.es/boe-legislacion/mcp` |
| `legal-citations-esp` | `legal-citations-esp` | `…/legal-citations-esp/mcp` |
| `legal-persona-esp` | `legal-persona-esp` | `…/legal-persona-esp/mcp` |
| `cendoj-jurisprudencia` | `cendoj-jurisprudencia` | `…/cendoj-jurisprudencia/mcp` |
| `tribunal-constitucional` | `tribunal-constitucional` | `…/tribunal-constitucional/mcp` |
| `eu-law-esp` | `eu-law-esp` | `…/eu-law-esp/mcp` |
| `congreso-debates` | `congreso-debates` | `…/congreso-debates/mcp` |
| `doctrina-academica` | `doctrina-academica` | `…/doctrina-academica/mcp` |
| `derecho-historico` | `derecho-historico` | `…/derecho-historico/mcp` |
| `catalunya-legal` | `catalunya-legal` | `…/catalunya-legal/mcp` |
| `busqueda-general` | `busqueda-general` | `…/busqueda-general/mcp` |
| `shared` | (library) | — |
| `ollama` (local STDIO) | `ollama` | bundled in plugin |

**Absent:** any `workflows` workspace. No `/workflows-esp/mcp` route exists. The Spanish plugin (this repo) does not currently ship a `workflows-esp` server or Spanish equivalents of `create-workflow` / `workflow` commands.

**Spanish plugin `.mcp.json` (this repo):** declares the 11 remote servers + `ollama` local STDIO. No `workflows-esp` entry — consistent with the missing server.

**Precedent reference — the Italian fork:** `fedec65/BetterCallClaudeMCP_Italy` (main SHA `690b992d9d30a82a02efebde07a875a2aab084f0`) ships a `mcp-servers/workflows/` workspace that is a direct port of the Swiss one. Its `AGENTS.md` documents the explicit parity contract: *"i tool di `workflows-ita` … non hanno prefisso, per parità di contratto col server svizzero `workflows-ch` … risponde con JSON libero + `isError`, e `WorkflowValidationError` → `{valid:false, errors}`"*. The Italian CHANGELOG confirms the same 8 tools, same Postgres + `DATABASE_URL` model, same idempotent schema, manifest swapped for the 16 chainable agents of the Italian plugin (with `cantonal` → `regional`). This is the exact template a Spanish port must follow.

---

## Licensing & forking feasibility

- **Swiss MCP repo** (`BetterCallClaudeMCP`): AGPL-3.0-or-later. Both the workspace `package.json` and repo README declare this. The README adds: *"Past commits released under MIT remain available under MIT terms for anyone who obtained them before the relicence date; all commits from the relicence commit forward are AGPL-3.0-or-later."*
- **Italian fork** (`BetterCallClaudeMCP_Italy`): inherits AGPL-3.0-or-later by direct fork lineage (per its `AGENTS.md`).
- **Spanish fork** (`BetterCallClaudeMCP_Espana`): repo has **no LICENSE file at the time of this snapshot**. Until a LICENSE is added, the legal status of the Spanish fork is ambiguous — recommend adding `LICENSE` (AGPL-3.0-or-later) on the next housekeeping PR before publishing any new workspace derived from upstream.
- **Feasibility:** **Fully feasible.** Forking the `mcp-servers/workflows` workspace into the Spanish repo and re-publishing as `mcp-servers/workflows` (HTTP route `/workflows-esp/mcp`) is the same fork-and-modify operation the Italian fork performed. Required changes for Spanish:
  1. Swap `AGENTS_MANIFEST` (`src/manifest.ts`) for the 16 chainable Spanish plugin agents and their I/O type contracts — must match what the plugin's `commands/*.md` and `agents/*.md` actually accept/produce.
  2. Bump server version (Italian fork went to `1.1.0`; Spanish should pick a distinct `1.0.0` or mirror versioning).
  3. Add HTTP route in `mcp-servers-http/src/index.ts` and `src/servers/workflows-esp.ts`.
  4. Update `mcp-servers-http/src/servers/__tests__/workflows-ch.test.ts` (or add a sibling `workflows-esp.test.ts`) with the new tool count.
  5. Mirror the Italian `AGENTS.md` parity clause naming `workflows-esp` instead of `workflows-ita`.
  6. (Optional but recommended) Drop `team` visibility or gate it behind a future team-membership table; the upstream `team` model is a known leaky abstraction.
  7. Add or update a Spanish README entry pointing at `mcp.bettercallclaude.es/workflows-esp/mcp`.

**AGPL caveat:** if the Spanish deployment exposes this server over the network (it does — the Railway aggregator), the AGPL §13 obligation kicks in: *"if you modify the Program, … you must provide the source … to all users interacting with it through a network server."* The Spanish repo must remain public and the workspace source must remain visible. Both are satisfied by the existing fork layout.

---

## Risks / unknowns

| # | Risk | Severity | Notes |
|---|---|---|---|
| 1 | `gen_random_uuid()` may fail on managed Postgres without `pgcrypto` pre-installed | low | Railway Postgres ships it; verify on the Spanish deployment target |
| 2 | `team` visibility has no membership table → any caller with `include_team=true` reads all team workflows | medium | Inherited design limitation; consider gating or removing in the Spanish fork |
| 3 | `user_id` is the only capability — leak = full read/write to that namespace | high (by design) | Document prominently in Spanish plugin's `PRIVACY.md`; recommend rotating on suspected leak |
| 4 | No retention policy on `workflow_runs` — table grows unbounded | low | Acceptable for the Swiss usage pattern; add a cron sweep if Spanish plugin sees heavier use |
| 5 | `pipeline[].step` strict-sequential check can surprise clients that pre-validate locally and renumber inconsistently | low | Always validate server-side; never trust client numbering |
| 6 | Schema is shared across tenants — no per-tenant schema or row-level security | medium | Consider `SET LOCAL app.user_id = …` + RLS policies if multi-tenancy matters for Spanish |
| 7 | The Spanish plugin's chainable agent count and identity may differ from the Swiss 16 → manifest must be hand-curated | medium | Audit `bettercallclaude-espana/agents/*.md` before drafting `manifest.ts`; never copy the Swiss list verbatim |
| 8 | `BetterCallClaudeMCP_Espana` has no LICENSE file yet | medium | Add AGPL-3.0-or-later before publishing the new workspace |
| 9 | The Swiss plugin README (v4.11.0) overrides the spec on 5 points — Spanish fork must consciously decide each deviation (manifest size, `user_id` as plain param, URL path, target file, MCP prefix) | low | The Italian fork chose to mirror all Swiss deviations; recommend Spanish do the same for tool-surface parity |
| 10 | `cowork_desktop` config interpolation: `claim_user_id` resolution depends on `${user_config.user_id}` — verify the Spanish plugin's `.claude-plugin/plugin.json` declares the setting | low | Already present in the Swiss repo (per its `plugin.json` description); mirror in Spanish |

---

## Recommended path forward

Three options, one-line trade-off each:

1. **Italian-style port (recommended).** Add `mcp-servers/workflows/` to `BetterCallClaudeMCP_Espana` as a fork of the Swiss workspace with the Spanish agent manifest, wire `POST /workflows-esp/mcp` in the aggregator, and ship Spanish equivalents of `/crear-workflow` and `/workflow` in the plugin. **Trade-off:** adds ~1 small workspace + 2 command files; preserves 100% tool-surface parity with Swiss and Italian, so cross-plugin learning and tooling transfers for free.

2. **Swiss-direct fork with no Italian refactoring.** Fork `BetterCallClaudeMCP` itself into the Spanish org as a parallel repo (e.g. `BetterCallClaudeMCP_es-fork`) and replace one workspace at a time. **Trade-off:** heavier upfront fork cost (full monorepo, full CI, full Railway deploy) but no shared-trunk coupling — easier to diverge from Swiss conventions later.

3. **Skip the server, keep the command UX.** Leave `workflows-ch` server-side work for later and only add the `create-workflow` / `workflow` commands pointing at the existing `mcp.bettercallclaude.ch/workflows-ch/mcp` endpoint. **Trade-off:** zero backend work and zero infrastructure, but Spanish users share the Swiss server — manifest is locked to the Swiss 16 agents, no data residency for ES users, and the AGPL-§13 compliance becomes a question of whether the Spanish plugin counts as "users interacting with [the Swiss] network server".
