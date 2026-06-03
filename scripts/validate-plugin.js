#!/usr/bin/env node
const fs = require('fs');

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function readJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    errors.push(`Cannot read/parse ${filePath}: ${err.message}`);
    return null;
  }
}

console.log('Validating BetterCallClaude España plugin...\n');

const marketplace = readJSON('.claude-plugin/marketplace.json');
if (marketplace) {
  assert(marketplace.name, 'marketplace.json: missing "name"');
  assert(marketplace.plugins && Array.isArray(marketplace.plugins), 'marketplace.json: missing "plugins" array');
  assert(marketplace.plugins.length > 0, 'marketplace.json: plugins array is empty');

  const plugin = marketplace.plugins[0];
  assert(plugin.name, 'marketplace.json plugin: missing "name"');
  assert(plugin.version, 'marketplace.json plugin: missing "version"');
  assert(plugin.source, 'marketplace.json plugin: missing "source"');
  assert(plugin.source.startsWith('./'), 'marketplace.json plugin: "source" must start with "./"');
  assert(plugin.repository, 'marketplace.json plugin: missing "repository"');
  assert(plugin.license, 'marketplace.json plugin: missing "license"');

  console.log(`  OK marketplace.json — ${plugin.name} v${plugin.version}`);
}

const pluginJson = readJSON('bettercallclaude-espana/.claude-plugin/plugin.json');
if (pluginJson) {
  assert(pluginJson.name, 'plugin.json: missing "name"');
  assert(pluginJson.version, 'plugin.json: missing "version"');
  assert(pluginJson.description, 'plugin.json: missing "description"');

  console.log(`  OK plugin.json — ${pluginJson.name} v${pluginJson.version}`);
}

const mcpJson = readJSON('bettercallclaude-espana/.mcp.json');
if (mcpJson) {
  assert(mcpJson.mcpServers, '.mcp.json: missing "mcpServers"');
  const servers = Object.keys(mcpJson.mcpServers || {});
  assert(servers.length > 0, '.mcp.json: no MCP servers defined');

  for (const [name, config] of Object.entries(mcpJson.mcpServers || {})) {
    if (config.url) {
      assert(!config.url.includes('${user_config.'), `.mcp.json server "${name}": "url" must not contain \${user_config.*} (Cowork validation will fail)`);
    }
  }

  console.log(`  OK .mcp.json — ${servers.length} MCP server(s)`);
}

const packageJson = readJSON('package.json');
if (packageJson) {
  assert(packageJson.version, 'package.json: missing "version"');
  console.log(`  OK package.json — v${packageJson.version}`);
}

if (marketplace && pluginJson && packageJson) {
  const marketplaceVersion = marketplace.plugins[0].version;
  const pluginVersion = pluginJson.version;
  const packageVersion = packageJson.version;

  if (marketplaceVersion === pluginVersion && pluginVersion === packageVersion) {
    console.log(`  OK Version alignment — ${packageVersion}`);
  } else {
    errors.push(`Version mismatch: marketplace=${marketplaceVersion}, plugin=${pluginVersion}, package=${packageVersion}`);
  }
}

if (marketplace && marketplace.plugins[0].source) {
  const sourceDir = marketplace.plugins[0].source.replace(/^\.\//, '');
  assert(fs.existsSync(sourceDir), `Source directory "${sourceDir}" does not exist`);
  console.log(`  OK Source directory — ${sourceDir}`);
}

const criticalFiles = [
  'bettercallclaude-espana/.claude-plugin/plugin.json',
  'bettercallclaude-espana/.mcp.json',
  'bettercallclaude-espana/agents',
  'bettercallclaude-espana/commands',
  'bettercallclaude-espana/skills',
  'bettercallclaude-espana/hooks/hooks.json',
  'bettercallclaude-espana/scripts/privacy-check.js',
  'bettercallclaude-espana/mcp-servers/ollama/dist/index.js',
];

for (const file of criticalFiles) {
  assert(fs.existsSync(file), `Critical file missing: ${file}`);
}
console.log('  OK Critical plugin files present');

console.log('');

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):\n`);
  errors.forEach(error => console.error(`  - ${error}`));
  process.exit(1);
}

console.log('All validations passed. Plugin is ready for release.\n');
process.exit(0);
