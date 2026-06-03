# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in BetterCallClaude España, please report it responsibly:

1. **Do not** open a public issue
2. Email **info@bettercallclaude.es** with details
3. Allow reasonable time for response before public disclosure

## Privacy Considerations

The plugin includes a `PreToolUse` hook that scans outgoing tool calls for attorney-client privileged content (*secreto profesional*) before it leaves the machine. This is an assistive layer and does not guarantee compliance.

## Scope

This security policy covers:
- The plugin code (agents, commands, skills, hooks, scripts)
- The bundled ollama MCP server
- MCP server API interactions

It does **not** cover:
- The Cowork Desktop application itself
- Third-party MCP server implementations
- User-generated content

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | Yes       |
