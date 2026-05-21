#!/bin/bash
# Generate shell aliases for Kimify slash commands.
# Source this in your shell profile to get kimi-start, kimi-sync, etc.
# Usage: eval "$(.agents/scripts/generate-shell-aliases.sh)"
#
# Each alias runs `kimi -p "$(cat .agents/commands/<name>.md)"` so the command
# content becomes the initial prompt of a new session.

PROJECT_DIR="${KIMI_PROJECT_DIR:-$(pwd)}"
CMD_DIR="$PROJECT_DIR/.agents/commands"

if [ ! -d "$CMD_DIR" ]; then
  echo "# Error: $CMD_DIR not found" >&2
  exit 1
fi

echo "# Kimify shell aliases — generated from $CMD_DIR"
for cmd_file in "$CMD_DIR"/*.md; do
  [ -f "$cmd_file" ] || continue
  name=$(basename "$cmd_file" .md)
  # Quote the generated alias body so project directories with spaces (for
  # example, "Git Repos") still work when the alias is evaluated.
  alias_value="kimi -p \"\$(cat \"$cmd_file\")\""
  printf "alias 'kimi-%s'=%q\n" "$name" "$alias_value"
done
