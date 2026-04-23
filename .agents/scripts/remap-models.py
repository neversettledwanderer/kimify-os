#!/usr/bin/env python3
"""Remap model aliases across every Kimify agent.yaml in one go.

Usage:
    .agents/scripts/remap-models.py --map kimi-k2=moonshot-v1-auto \
                                    --map kimi-k2-turbo=moonshot-v1-fast

Rewrites agent.yaml files in place. Only touches the top-level `model:` field
under `agent:`. Leaves comments, tool lists, subagents, and everything else
alone.
"""
from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent  # .agents/

def discover_agent_yamls() -> list[Path]:
    return [
        *sorted((ROOT / "agents").glob("*/agent.yaml")),
        *sorted((ROOT / "kimify").glob("agent.yaml")),
    ]

def rewrite(path: Path, mapping: dict[str, str]) -> bool:
    text = path.read_text()
    # Match `  model: <value>` under the `agent:` block (two-space indent).
    pattern = re.compile(r"^(\s*model:\s*)(\S+)\s*$", re.MULTILINE)
    changed = False
    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        old = m.group(2).strip().strip('"\'')
        new = mapping.get(old, old)
        if new != old:
            changed = True
        return f"{m.group(1)}{new}"
    new_text = pattern.sub(repl, text)
    if changed:
        path.write_text(new_text)
    return changed

def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--map", action="append", default=[],
                    help="old=new pairs. Repeat for multiple mappings.")
    args = ap.parse_args()
    mapping: dict[str, str] = {}
    for pair in args.map:
        if "=" not in pair:
            print(f"bad --map arg: {pair}", file=sys.stderr)
            return 2
        k, v = pair.split("=", 1)
        mapping[k.strip()] = v.strip()
    if not mapping:
        print("no mappings given; nothing to do", file=sys.stderr)
        return 1
    touched = 0
    for p in discover_agent_yamls():
        if rewrite(p, mapping):
            print(f"  remapped: {p.relative_to(ROOT.parent)}")
            touched += 1
    print(f"done — {touched} file(s) changed")
    return 0

if __name__ == "__main__":
    sys.exit(main())
