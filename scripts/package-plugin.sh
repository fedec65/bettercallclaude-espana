#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DIST_DIR="$REPO_ROOT/dist"
PLUGIN_DIR="$REPO_ROOT/bettercallclaude-espana"
VERSION=$(node -p "require('$REPO_ROOT/package.json').version")
OUTPUT="$DIST_DIR/bettercallclaude-espana-v${VERSION}.zip"

mkdir -p "$DIST_DIR"

echo "Packaging BetterCallClaude España v$VERSION..."
echo "  Running validation..."
node "$REPO_ROOT/scripts/validate-plugin.js"

if [ ! -f "$PLUGIN_DIR/mcp-servers/ollama/dist/index.js" ]; then
  echo "ERROR: Missing compiled server: bettercallclaude-espana/mcp-servers/ollama/dist/index.js"
  echo ""
  echo "Rebuild it by running:"
  echo ""
  echo "    npm run build:ollama"
  echo ""
  exit 1
fi

STAGING=$(mktemp -d)
trap "rm -rf $STAGING" EXIT

cp -r "$PLUGIN_DIR" "$STAGING/"

(cd "$STAGING" && zip -r -q "$OUTPUT" bettercallclaude-espana)

echo ""
echo "Package created: $OUTPUT"
echo "Size: $(du -h "$OUTPUT" | cut -f1)"
echo ""
echo "Ready for Cowork Desktop marketplace upload."
