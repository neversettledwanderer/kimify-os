#!/bin/bash
PROJECT_DIR="${KIMI_PROJECT_DIR:-${CLAUDE_PROJECT_DIR:-$(pwd)}}"
# Tracks the currently active subagent for per-agent scoping in guard-bash.sh.
# Fires on SubagentStart (writes) and SubagentStop (clears).
set -e

INPUT=$(cat)
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty')
AGENT=$(echo "$INPUT" | jq -r '.agent_name // empty')
STATE_DIR="$PROJECT_DIR/.agents/logs"
STATE_FILE="$STATE_DIR/.active-subagent"

mkdir -p "$STATE_DIR"

case "$EVENT" in
  SubagentStart)
    [ -n "$AGENT" ] && echo "$AGENT" > "$STATE_FILE"
    ;;
  SubagentStop)
    rm -f "$STATE_FILE"
    ;;
esac

exit 0
