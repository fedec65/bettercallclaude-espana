#!/usr/bin/env bash
# package-plugin.sh - Create distributable plugin zip
#
# Packages only the end-user files needed for the BetterCallClaude España plugin,
# excluding source code, build tools, and development artifacts.
#
# Output: dist/bettercallclaude-espana-<version>.zip

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# The plugin root is the bettercallclaude-espana/ subdirectory (Cowork marketplace layout)
PLUGIN_ROOT="$REPO_ROOT/bettercallclaude-espana"

# Read version from plugin.json
VERSION=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$PLUGIN_ROOT/.claude-plugin/plugin.json','utf8')).version)")

OUTPUT_DIR="$REPO_ROOT/dist"
ZIP_NAME="bettercallclaude-espana-${VERSION}.zip"
STAGING_DIR="$OUTPUT_DIR/staging-$$"

echo "=== BetterCallClaude España Plugin Packager ==="
echo "Version: $VERSION"
echo ""

# Verify required files exist
echo "Verifying plugin structure..."

REQUIRED_FILES=(
  ".claude-plugin/plugin.json"
  ".mcp.json"
  "hooks/hooks.json"
)

REQUIRED_DIRS=(
  "agents"
  "commands"
  "skills"
  "mcp-servers"
)

for file in "${REQUIRED_FILES[@]}"; do
  if [ ! -f "$PLUGIN_ROOT/$file" ]; then
    echo "ERROR: Missing required file: bettercallclaude-espana/$file"
    exit 1
  fi
done

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d "$PLUGIN_ROOT/$dir" ]; then
    echo "ERROR: Missing required directory: bettercallclaude-espana/$dir"
    exit 1
  fi
done

# Verify compiled MCP servers.
#
# All Spain-law servers (jurisprudencia, ts-search, legal-citations, boe-sparql,
# legal-persona, tc-search) are HTTP-only and reached via URLs declared in .mcp.json
# — they ship no local JS. Only ollama is bundled as a STDIO server.
BUNDLED_SERVERS=("ollama")
for server in "${BUNDLED_SERVERS[@]}"; do
  if [ ! -f "$PLUGIN_ROOT/mcp-servers/$server/dist/index.js" ]; then
    echo "ERROR: Missing compiled server: mcp-servers/$server/dist/index.js"
    echo ""
    echo "The ollama bundle is normally checked into git under"
    echo "bettercallclaude-espana/mcp-servers/ollama/dist/. If you've deleted it or"
    echo "changed the source, rebuild it by running:"
    echo ""
    echo "    npm run build:ollama"
    echo ""
    echo "from the repo root. Other MCP servers are hosted remotely — their source"
    echo "lives in a separate MCP repository."
    exit 1
  fi
done

echo "All required files present."
echo ""

# Create staging directory
mkdir -p "$STAGING_DIR"

echo "Packaging plugin..."

# Copy plugin files from bettercallclaude-espana/ subdirectory
cp -r "$PLUGIN_ROOT/.claude-plugin" "$STAGING_DIR/"
cp "$PLUGIN_ROOT/.mcp.json" "$STAGING_DIR/"
cp -r "$PLUGIN_ROOT/agents" "$STAGING_DIR/"
cp -r "$PLUGIN_ROOT/commands" "$STAGING_DIR/"
cp -r "$PLUGIN_ROOT/skills" "$STAGING_DIR/"
cp -r "$PLUGIN_ROOT/hooks" "$STAGING_DIR/"

# Copy MCP servers (only dist/ contents, not source)
mkdir -p "$STAGING_DIR/mcp-servers"
for server in "${BUNDLED_SERVERS[@]}"; do
  mkdir -p "$STAGING_DIR/mcp-servers/$server/dist"
  cp "$PLUGIN_ROOT/mcp-servers/$server/dist/"*.js "$STAGING_DIR/mcp-servers/$server/dist/"
  # Copy WASM files if present
  if [ -f "$PLUGIN_ROOT/mcp-servers/$server/dist/sql-wasm.wasm" ]; then
    cp "$PLUGIN_ROOT/mcp-servers/$server/dist/sql-wasm.wasm" "$STAGING_DIR/mcp-servers/$server/dist/"
  fi
  # Copy package.json so the STDIO subprocess has its declared deps if any
  if [ -f "$PLUGIN_ROOT/mcp-servers/$server/package.json" ]; then
    cp "$PLUGIN_ROOT/mcp-servers/$server/package.json" "$STAGING_DIR/mcp-servers/$server/"
  fi
done

# Copy scripts needed at runtime.
mkdir -p "$STAGING_DIR/scripts"
if [ -f "$PLUGIN_ROOT/scripts/privacy-check.js" ]; then
  cp "$PLUGIN_ROOT/scripts/privacy-check.js" "$STAGING_DIR/scripts/"
else
  echo "ERROR: Missing required hook script: bettercallclaude-espana/scripts/privacy-check.js"
  exit 1
fi

# Copy plugin-facing documentation. Prefer the copies inside bettercallclaude-espana/
# (they are written for end users of the plugin); fall back to repo-root files.
for doc in README.md CONNECTORS.md LICENSE; do
  if [ -f "$PLUGIN_ROOT/$doc" ]; then
    cp "$PLUGIN_ROOT/$doc" "$STAGING_DIR/"
  elif [ -f "$REPO_ROOT/$doc" ]; then
    cp "$REPO_ROOT/$doc" "$STAGING_DIR/"
  fi
done

# Create zip
mkdir -p "$OUTPUT_DIR"
(cd "$STAGING_DIR" && zip -r -q "$OUTPUT_DIR/$ZIP_NAME" .)

# Clean up staging
rm -rf "$STAGING_DIR"

# Show result
SIZE=$(du -h "$OUTPUT_DIR/$ZIP_NAME" | cut -f1)
echo ""
echo "=== Package Complete ==="
echo "Output: $OUTPUT_DIR/$ZIP_NAME ($SIZE)"
echo ""
echo "Contents:"
unzip -l "$OUTPUT_DIR/$ZIP_NAME" | tail -1
