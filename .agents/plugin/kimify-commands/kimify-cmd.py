#!/usr/bin/env python3
"""Kimify command runner — Kimi plugin tool.

Reads a command name from stdin (JSON: {"name": "start"}),
reads the corresponding .agents/commands/<name>.md file from the
project root (inherited via $PWD), and prints its contents.
"""
from __future__ import annotations
import json
import os
import sys
from pathlib import Path


def main() -> int:
    try:
        params = json.load(sys.stdin)
    except json.JSONDecodeError:
        print("Error: expected JSON on stdin", file=sys.stderr)
        return 1

    name = params.get("name", "").strip()
    if not name:
        print("Error: missing 'name' parameter", file=sys.stderr)
        return 1

    # Plugin subprocess inherits parent's cwd via $PWD
    project_dir = Path(os.environ.get("PWD", os.getcwd()))
    cmd_file = project_dir / ".agents" / "commands" / f"{name}.md"

    if not cmd_file.is_file():
        print(f"Error: command '{name}' not found at {cmd_file}", file=sys.stderr)
        return 1

    print(cmd_file.read_text())
    return 0


if __name__ == "__main__":
    sys.exit(main())
