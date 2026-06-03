# BetterCallClaude España Plugin

<p align="center">
  <img src="docs/images/logo.png" alt="Mejor llamaré Claude" width="400">
</p>

<p align="center"><strong>Inteligencia jurídica española para Cowork Desktop</strong></p>

BetterCallClaude España ofrece investigación de jurisprudencia TS/AP/STS/STC, estrategia procesal, redacción jurídica, verificación de citas y soporte para las 17 Comunidades Autónomas, con protección integrada del *secreto profesional*.

## Estructura del plugin

| Directorio | Contenido |
|------------|-----------|
| `agents/` | 20 agentes especialistas (investigación, redacción, estrategia, compliance, etc.) |
| `commands/` | 21 comandos slash (`:legal`, `:research`, `:draft`, etc.) |
| `skills/` | 15 módulos reutilizables de conocimiento jurídico |
| `hooks/` | Configuración del hook `PreToolUse` de privacidad |
| `scripts/` | Script de control de privacidad (`privacy-check.js`) |
| `mcp-servers/` | Servidor local Ollama STDIO empaquetado para clasificación de privacidad |

## Archivos principales

- `.claude-plugin/plugin.json` — Manifiesto del plugin y esquema de configuración de usuario
- `.mcp.json` — Configuración de transporte de servidores MCP
- `hooks/hooks.json` — Enlaces de eventos para hooks

## Instalación en Cowork

1. En Cowork, abre **Personalizar** > **Explorar plugins** > **Personales** > **+**.
2. Añade el marketplace desde GitHub: `fedec65/bettercallclaude-espana`.
3. Instala **BetterCallClaude España**.

Los servidores MCP remotos se conectan automáticamente mediante HTTPS.

## Documentación

- [CONNECTORS.md](CONNECTORS.md) — Referencia de servidores MCP
- [LICENSE](LICENSE) — Licencia AGPL-3.0

## Empaquetado

```bash
npm run package
```

Crea `dist/bettercallclaude-espana-v<version>.zip`, listo para instalación o distribución en Cowork Desktop.
