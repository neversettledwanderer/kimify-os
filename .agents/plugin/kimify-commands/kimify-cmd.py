#!/usr/bin/env python3
"""Kimify command runner — Kimi plugin tool.

Reads a command name from stdin (JSON: {"name": "start"}),
reads the corresponding .agents/commands/<name>.md file from the
project root, and prints its contents.
"""
from __future__ import annotations
import json
import os
import re
import sys
from pathlib import Path


COMMAND_NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_-]*$")


def main() -> int:
    try:
        params = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("Error: expected JSON on stdin", file=sys.stderr)
        return 1

    name = params.get("name", "").strip()
    if name.startswith("/"):
        name = name[1:]
    if not name:
        print("Error: missing 'name' parameter", file=sys.stderr)
        return 1
    if not COMMAND_NAME_RE.fullmatch(name):
        print(
            "Error: invalid command name; use letters, numbers, dashes, and underscores only",
            file=sys.stderr,
        )
        return 1

    project_dir = Path(
        os.environ.get("KIMI_PROJECT_DIR") or os.environ.get("PWD") or os.getcwd()
    ).resolve()
    commands_dir = (project_dir / ".agents" / "commands").resolve()
    cmd_file = (commands_dir / f"{name}.md").resolve()

    try:
        cmd_file.relative_to(commands_dir)
    except ValueError:
        print("Error: command path escaped the commands directory", file=sys.stderr)
        return 1

    if not cmd_file.is_file():
        print(f"Error: command '{name}' not found at {cmd_file}", file=sys.stderr)
        return 1

    print(cmd_file.read_text(encoding="utf-8"))
    return 0


if __name__ == "__main__":
    sys.exit(main())
