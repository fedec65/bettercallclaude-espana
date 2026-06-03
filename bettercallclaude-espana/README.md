# BetterCallClaude España Plugin

Spain Legal Intelligence — TS/AP/STS/STC precedent research, case strategy, legal drafting, and citation verification across all 17 Autonomous Communities with *secreto profesional* privacy protection.

## Plugin Structure

| Directory | Contents |
|-----------|----------|
| `agents/` | 20 specialist agents (researcher, drafter, strategist, etc.) |
| `commands/` | 21 slash commands (`:legal`, `:research`, `:draft`, etc.) |
| `skills/` | 15 reusable skill modules |
| `hooks/` | PreToolUse privacy hook configuration |
| `scripts/` | Privacy check script (`privacy-check.js`) |
| `mcp-servers/` | Bundled ollama local STDIO server (privacy classifier) |

## Files

- `.claude-plugin/plugin.json` — Plugin manifest and user configuration schema
- `.mcp.json` — MCP server transport configuration
- `hooks/hooks.json` — Hook event bindings

## Documentation

- [CONNECTORS.md](CONNECTORS.md) — MCP server API reference
- [LICENSE](LICENSE) — AGPL-3.0 license

## Packaging

```bash
npm run package
```

Creates `dist/bettercallclaude-espana-<version>.zip` ready for Cowork Desktop installation.
