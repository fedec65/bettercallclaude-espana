---
description: "Check MCP server connectivity and display status for all servers."
---

# setup — MCP Server Status Check

Check MCP server connectivity and display the operational status of all servers used by BetterCallClaude España.

## Scope
This command operates on the plugin's infrastructure layer.

## Procedure
1. **Connectivity Check**: Ping each configured MCP server:
   - Legal research databases (BOE, CENDOJ, ECJ)
   - Citation verification service
   - Translation service
   - Document analysis service
   - Compliance/regulatory service
   - Privacy routing service
2. **Status Report**: For each server, report:
   - Server name
   - Status: online / offline / degraded
   - Response time
   - Last successful connection
   - Version (if available)
3. **Diagnostics**: If any server is offline or degraded, provide diagnostic suggestions.
4. **Configuration Summary**: Display current plugin configuration (agents, skills, MCP servers registered).

## Output
- Status table (server, status, latency, version)
- Overall health indicator
- Diagnostic recommendations (if issues found)

## Examples
- `/bettercallclaude-espana:setup`
- `/bettercallclaude-espana:setup --verbose`

$ARGUMENTS
