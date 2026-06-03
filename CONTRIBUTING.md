# Contributing to BetterCallClaude España

Thank you for your interest in contributing!

## How to Contribute

1. **Open an issue** to discuss your idea or report a bug
2. **Fork the repository** and create a feature branch
3. **Make your changes** following the coding style of the project
4. **Test your changes** by running the packaging script
5. **Submit a pull request** with a clear description

## Development Setup

```bash
git clone https://github.com/fedec65/bettercallclaude-espana.git
cd bettercallclaude-espana
npm install
```

## Testing the Privacy Hook

```bash
node bettercallclaude-espana/scripts/privacy-check.test.js
```

## Building the Plugin

```bash
npm run package
```

This creates `dist/bettercallclaude-espana-<version>.zip`.

## Code Style

- Agent and command files are Markdown with YAML frontmatter
- Skills are directories containing `SKILL.md`
- Use Spanish legal terminology throughout
- Include professional disclaimers in all legal output templates

## MCP Servers

MCP server source code lives in a separate repository. To change server behavior, open a PR there.

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.
