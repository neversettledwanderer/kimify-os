#!/bin/bash
# Install the Kimify Commands plugin into Kimi CLI.
# Copies this directory to ~/.kimi/plugins/kimify-commands/

set -e

PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"
DEST_DIR="${HOME}/.kimi/plugins/kimify-commands"

mkdir -p "$DEST_DIR"
rm -rf "$DEST_DIR"
cp -R "$PLUGIN_DIR" "$DEST_DIR"

echo "Installed kimify-commands plugin to $DEST_DIR"
echo "Run 'kimi plugin list' to verify."
