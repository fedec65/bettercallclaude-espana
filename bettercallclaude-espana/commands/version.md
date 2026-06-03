---
description: "Display plugin version, installed components, system status."
---

# version — Plugin Version & System Status

Display the current version of BetterCallClaude España, installed components, and system status.

## Scope
This command operates on the plugin's metadata layer.

## Information Displayed
1. **Plugin Version**: Current version number and release date.
2. **Installed Components**:
   - Commands (list with descriptions)
   - Agents (list with capabilities)
   - Skills (list with descriptions)
   - MCP servers (list with endpoints)
3. **System Status**:
   - Python/Node runtime version
   - Configuration file location (`~/.betterask/config.yaml`)
   - Privacy mode setting
   - Last update check
4. **Legal Framework Version**: Reference versions of tracked legal codes (CC, CP, LEC, CE) based on last BOE update.

## Output
- Version banner
- Component inventory
- System health summary

## Examples
- `/bettercallclaude-espana:version`
- `/bettercallclaude-espana:version --json`

$ARGUMENTS
