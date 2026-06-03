---
description: "View or change privacy mode (strict/balanced/cloud). Settings stored in ~/.betterask/config.yaml."
---

# privacy — Privacy Mode Management

View or change the privacy mode for BetterCallClaude España. Privacy settings are stored in `~/.betterask/config.yaml`.

## Scope
This command operates on the plugin's configuration layer.

## Privacy Modes

### strict
- All processing happens locally.
- No data leaves the local environment.
- MCP servers that require external calls are disabled or proxied.
- Use for matters involving professional secrecy (secreto profesional, Art. 24 LOPJ, Art. 542 CP), client confidential data, or sensitive personal data under GDPR/LOPDGDD.

### balanced (default)
- Anonymous queries may use external MCP servers (BOE search, citation verification).
- Document content is not transmitted externally.
- Good balance between capability and confidentiality.

### cloud
- Full external MCP server access enabled.
- Document analysis and translation may use cloud APIs.
- Highest capability, lowest privacy.
- Not recommended for matters subject to secreto profesional.

## Procedure
1. **View**: Display current privacy mode and implications.
2. **Change**: Update the mode in `~/.betterask/config.yaml` and reload configuration.
3. **Validate**: Confirm all MCP servers are compatible with the selected mode.

## Output
- Current privacy mode
- Mode description and implications
- Compatible MCP servers
- Configuration file path

## Examples
- `/bettercallclaude-espana:privacy`
- `/bettercallclaude-espana:privacy --set strict`
- `/bettercallclaude-espana:privacy --set balanced`
- `/bettercallclaude-espana:privacy --set cloud`

$ARGUMENTS
