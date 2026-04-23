#!/bin/bash
PROJECT_DIR="${KIMI_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
# PostToolUse async hook — appends every Write|Edit to audit trail.
# Provides a chronological record of all file modifications.

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
LOG_DIR="$PROJECT_DIR/.agents/logs"
AUDIT_TRAIL="$LOG_DIR/audit-trail.md"

mkdir -p "$LOG_DIR"

# Skip if no file path
[ -z "$FILE_PATH" ] && exit 0

# Get relative path for cleaner logs
RELATIVE_PATH="${FILE_PATH#$PROJECT_DIR/}"

echo "- \`$TIMESTAMP\` | $TOOL | $RELATIVE_PATH" >> "$AUDIT_TRAIL"

exit 0
