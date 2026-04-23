# Kimify port — handoff

Handoff doc for finishing the Claudify → Kimi CLI port. Three tasks remain. Each is self-contained with the design, the code to write, and a verification step. Work through them in Kimi CLI in order.

## Context (read first)

Project root: `.` (whatever directory you're currently in — this file lives there).

The Kimify port is already scaffolded:

- `.agents/kimify/agent.yaml` — root agent, wires all 9 specialists as subagents
- `.agents/agents/{9 names}/{agent.yaml,system.md}` — ported specialist agents
- `.agents/hooks/*.sh` — 9 ported safety hooks + `ai-verdict.py` for the Stop-hook verdict
- `.agents/commands/*.md` — 21 command instruction files (currently read by the root agent, not real slash commands)
- `.agents/skills/` — 1,728 skill files across 31 categories, unchanged
- `kimi-config.toml` — hook definitions to merge into `~/.local/share/kimi/config.toml`
- `KIMIFY.md`, `SETUP.md` — docs

Three tasks remain:
1. **Per-agent bash command scoping** (restore the Claudify `Bash(git:*)` behaviour)
2. **Model alias rewriter utility** (let users repoint `kimi-k2` → whatever their Kimi config calls it)
3. **Promote slash commands to real Kimi plugin commands** (so `/start`, `/sync` etc. are discoverable via Kimi's CLI, not just read by the root agent)

Each task below is self-contained. Run them in order and verify after each.

---

## Task 1 — Per-agent bash command scoping

### Why

Claudify agents declared scoped bash in their frontmatter: `Bash(git:*)`, `Bash(date:*)`, `Bash(git:*,wc:*,find:*)`. This meant "when this specific agent runs bash, only these commands are allowed". The port flattened these to just `Shell` because Kimi's `AgentSpec` has no command-level tool scoping. The original scoping is preserved as a comment block at the top of each `agent.yaml` under `claudify_original.scoped_tools`.

This task restores the behaviour using Kimi's `SubagentStart` / `SubagentStop` hooks plus a small runtime allowlist check inside `guard-bash.sh`.

### Design

1. Create `.agents/agents/<name>/bash-allow.txt` for agents that originally had scoped bash. One regex per line, matching anchored at the start of the command after normalising whitespace.
2. New hook `.agents/hooks/track-subagent.sh` writes the active subagent's name to `.agents/logs/.active-subagent` on `SubagentStart` and removes it on `SubagentStop`.
3. Extend `.agents/hooks/guard-bash.sh`: if `.agents/logs/.active-subagent` exists and the corresponding `bash-allow.txt` exists, deny bash commands that don't match any regex in the allowlist.
4. Wire `track-subagent.sh` into `kimi-config.toml` for both events.

### Files to create / edit

**a) `.agents/hooks/track-subagent.sh`** (new)

```bash
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
```

Run `chmod +x .agents/hooks/track-subagent.sh` after creating.

**b) Extend `.agents/hooks/guard-bash.sh`**

Find the block that reads `INPUT` and `COMMAND` near the top (around line 12). Add this scoping check immediately after the `log_incident` and `deny` helper function definitions, and *before* the existing hard/soft block logic:

```bash
# ─── Per-subagent allowlist (restores Claudify's Bash(X:*) scoping) ───
ACTIVE_AGENT_FILE="$PROJECT_DIR/.agents/logs/.active-subagent"
if [ -f "$ACTIVE_AGENT_FILE" ]; then
  ACTIVE_AGENT=$(cat "$ACTIVE_AGENT_FILE" 2>/dev/null)
  ALLOW_FILE="$PROJECT_DIR/.agents/agents/$ACTIVE_AGENT/bash-allow.txt"
  if [ -n "$ACTIVE_AGENT" ] && [ -f "$ALLOW_FILE" ]; then
    MATCHED=0
    while IFS= read -r PATTERN; do
      [ -z "$PATTERN" ] && continue
      case "$PATTERN" in \#*) continue ;; esac  # skip comments
      if echo "$COMMAND" | grep -Eq "$PATTERN"; then
        MATCHED=1
        break
      fi
    done < "$ALLOW_FILE"
    if [ "$MATCHED" -eq 0 ]; then
      log_incident "BLOCK" "agent=$ACTIVE_AGENT blocked outside allowlist: $COMMAND"
      deny "Command not in $ACTIVE_AGENT's allowlist" "Agent $ACTIVE_AGENT may only run commands matching patterns in .agents/agents/$ACTIVE_AGENT/bash-allow.txt"
      exit 0
    fi
  fi
fi
```

**c) Generate `bash-allow.txt` for each originally scoped agent**

Read `claudify_original.scoped_tools` in each `agent.yaml` and write the corresponding allowlist. Based on the port, the four agents with scoped bash are:

- `archaeologist` — `Bash(git:*)` → `^git( |$)`
- `auditor` — `Bash(date:*)` → `^date( |$)`
- `onboarding-sherpa` — `Bash(git:*,wc:*,find:*)` → `^git( |$)`, `^wc( |$)`, `^find( |$)`
- `pr-ghostwriter` — `Bash(git:*)` → `^git( |$)`

Create each file. Example for `archaeologist`:

```
# Restored from claudify Bash(git:*) scoping
^git( |$)
```

Example for `onboarding-sherpa`:

```
# Restored from claudify Bash(git:*,wc:*,find:*) scoping
^git( |$)
^wc( |$)
^find( |$)
```

The other five agents (`debt-collector`, `error-whisperer`, `rubber-duck`, `unsticker`, `yak-shave-detector`) had no scoped bash in the original — don't create an allowlist for them. No file = inherits main policy.

**d) Wire the hook into `kimi-config.toml`**

Add two new entries (order doesn't matter):

```toml
[[hooks]]
event = "SubagentStart"
matcher = ""
command = "\"${KIMI_PROJECT_DIR:-$(pwd)}/.agents/hooks/track-subagent.sh\""
timeout = 3

[[hooks]]
event = "SubagentStop"
matcher = ""
command = "\"${KIMI_PROJECT_DIR:-$(pwd)}/.agents/hooks/track-subagent.sh\""
timeout = 3
```

### Verify

```bash
# TOML still parses and now has 11 hooks
python3 -c "import tomli; print(len(tomli.loads(open('kimi-config.toml').read())['hooks']))"
# Expect: 11

# Allowlist files exist for the four scoped agents only
ls .agents/agents/*/bash-allow.txt
# Expect: archaeologist, auditor, onboarding-sherpa, pr-ghostwriter

# Dry-run the guard against a blocked command (simulate archaeologist)
mkdir -p .agents/logs
echo archaeologist > .agents/logs/.active-subagent
echo '{"tool_input":{"command":"rm -rf /"},"tool_name":"Bash"}' | .agents/hooks/guard-bash.sh
# Expect: JSON response denying the command, reason mentions "archaeologist"

echo '{"tool_input":{"command":"git log"},"tool_name":"Bash"}' | .agents/hooks/guard-bash.sh
# Expect: plain exit 0, no deny JSON

rm .agents/logs/.active-subagent
```

---

## Task 2 — Model alias rewriter utility

### Why

Each ported `agent.yaml` has `model: kimi-k2` (with `haiku` → `kimi-k2-turbo` and `opus` → `kimi-k2-thinking`). These are guesses. Your actual Kimi config in `~/.local/share/kimi/config.toml` might use different aliases (e.g. `moonshot-v1-auto`, `k2-flash`, whatever you've wired up). Users need a one-shot way to repoint the whole fleet.

### Design

A small Python script `.agents/scripts/remap-models.py` that:

1. Accepts a mapping on the command line, e.g. `--map kimi-k2=moonshot-v1-auto --map kimi-k2-turbo=moonshot-v1-fast`.
2. Walks `.agents/agents/*/agent.yaml` and the root `.agents/kimify/agent.yaml`.
3. Rewrites the `model:` field in place when it matches a key in the mapping.
4. Leaves comments and other fields untouched.

### File to create

**`.agents/scripts/remap-models.py`**

```python
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
```

Run `chmod +x .agents/scripts/remap-models.py`.

### Verify

```bash
# Before
grep -r "^  model:" .agents/agents/*/agent.yaml .agents/kimify/agent.yaml 2>/dev/null || true
# Dry run is via git, since the script writes in place:
git status .agents/  # should be clean first

# Run a test remap
.agents/scripts/remap-models.py --map kimi-k2=test-model-a --map kimi-k2-turbo=test-model-b
grep -r "^  model:" .agents/agents/*/agent.yaml .agents/kimify/agent.yaml 2>/dev/null
# Expect: every model field that was kimi-k2 or kimi-k2-turbo now reflects the test values

# Roll back
git checkout .agents/
```

### Docs update

Add a paragraph to `SETUP.md` under "3. Merge the Kimify hooks":

> **Optional: remap model aliases.** Each agent.yaml assumes `kimi-k2` / `kimi-k2-turbo` / `kimi-k2-thinking`. If your Kimi config defines them under different names, run `.agents/scripts/remap-models.py --map kimi-k2=<your-alias> ...` to rewrite the fleet in one shot.

---

## Task 3 — Promote slash commands to real Kimi plugin commands

### Why

Today, typing `/start` or `/sync` into Kimi CLI does nothing special — the root agent only reads `.agents/commands/*.md` when it notices the user mentioned one by name. A proper Kimi plugin would register each file as a real command so tab-completion, `--help`, and direct invocation all work.

### Design

Kimi CLI has a plugin system at `src/kimi_cli/plugin/`. Plugins are Python packages that register Click/Typer subcommands via the lazy-group loader. For each `.agents/commands/<name>.md` we generate a tiny shim command that, when invoked, reads the markdown body and feeds it into the current agent session as a system-authored user message (so the agent reads-and-follows the instructions exactly like it does today).

Two parts:
- The plugin package itself (`.agents/plugin/kimify_commands/`)
- Registration instructions so Kimi picks it up

### Step 1 — Research Kimi's plugin API

Before writing code, read the Kimi source to confirm the plugin entrypoint. From the repo map you already have:

```
src/kimi_cli/plugin/
src/kimi_cli/cli/_lazy_group.py
```

Use WebFetch on `https://github.com/MoonshotAI/kimi-cli/blob/main/src/kimi_cli/plugin/__init__.py` and `https://github.com/MoonshotAI/kimi-cli/blob/main/src/kimi_cli/cli/_lazy_group.py` to confirm:

- Entry point group name (likely `kimi_cli.plugins` or similar)
- Expected plugin interface (Click Group? a `register()` function?)
- How a plugin gets access to the current session to inject a prompt

Document what you find at the top of the plugin package (see step 2).

### Step 2 — Create the plugin package

**`.agents/plugin/kimify_commands/pyproject.toml`**

```toml
[build-system]
requires = ["setuptools>=69"]
build-backend = "setuptools.build_meta"

[project]
name = "kimify-commands"
version = "0.1.0"
description = "Kimify slash commands as Kimi CLI plugin"
requires-python = ">=3.10"
dependencies = ["click>=8.1"]

[project.entry-points."kimi_cli.plugins"]
# If Kimi uses a different entry-point group, change this name.
kimify = "kimify_commands:register"

[tool.setuptools.packages.find]
include = ["kimify_commands*"]
```

**`.agents/plugin/kimify_commands/kimify_commands/__init__.py`**

```python
"""Kimify slash commands plugin.

Scans the project's .agents/commands/*.md and exposes each as a Kimi CLI
subcommand. When invoked, the command reads the markdown body and submits
it to the active Kimi session as the user's next prompt.

IMPORTANT: Confirm the entry-point group name + session-injection API
against the Kimi source (src/kimi_cli/plugin/ and src/kimi_cli/cli/_lazy_group.py)
before publishing. The stub below is structured to match Click's plugin
convention; adjust once you've inspected Kimi's actual interface.
"""
from __future__ import annotations
from pathlib import Path
import click

def _commands_dir() -> Path:
    # Project-root-relative. Assumes user invokes kimi from project root.
    return Path.cwd() / ".agents" / "commands"

def _load_command_bodies() -> dict[str, str]:
    out: dict[str, str] = {}
    d = _commands_dir()
    if not d.is_dir():
        return out
    for p in sorted(d.glob("*.md")):
        out[p.stem] = p.read_text()
    return out

def _make_command(name: str, body: str) -> click.Command:
    @click.command(name=name, help=f"Kimify ritual: {name}. Reads .agents/commands/{name}.md and runs its procedure.")
    @click.argument("args", nargs=-1)
    @click.pass_context
    def _cmd(ctx: click.Context, args: tuple[str, ...]) -> None:
        # TODO (after Kimi plugin API inspection):
        # Replace this stub with the actual session-injection call, e.g.:
        #     session = ctx.obj["session"]
        #     session.inject_user_prompt(body + "\n\nargs: " + " ".join(args))
        # Falling back to stdout so the wiring is at least visible during dev.
        click.echo(f"--- kimify /{name} ---\n{body}")
        if args:
            click.echo(f"\n[args: {' '.join(args)}]")
    return _cmd

def register(cli: click.Group) -> None:
    """Hook called by Kimi CLI's plugin loader. Attaches one subcommand per
    .agents/commands/*.md file."""
    for name, body in _load_command_bodies().items():
        cli.add_command(_make_command(name, body))
```

### Step 3 — Install the plugin in dev mode

```bash
cd .agents/plugin/kimify_commands
pip install -e .
```

Then launch Kimi and check:

```bash
kimi --help
# Expect: /start, /sync, /clear, /wrap-up, etc. listed as subcommands
```

### Step 4 — Replace the stub with the real session API

After running `kimi --help` and confirming your commands appear, inspect `click.Context` during invocation to find the session object. The most likely patterns in Kimi's source are:

- `ctx.obj["session"]` or `ctx.obj.session` — grab and call whatever method submits a user prompt.
- A module-level `kimi_cli.session.current_session()` accessor.
- An injection hook exposed via the `plugin` module itself.

Replace the `click.echo(...)` stub in `_make_command` with the real call. Test by running `kimi` interactively and typing `/start`; confirm the command injects the markdown body as the next user turn and the root agent reads and acts on it.

### Verify

```bash
# Plugin installed
pip show kimify-commands

# Commands enumerated correctly
python3 -c "
from kimify_commands import _load_command_bodies
bodies = _load_command_bodies()
print(f'{len(bodies)} commands: {sorted(bodies)}')"
# Expect: 21 commands: ['audit', 'brief', 'clear', ...]

# Kimi picks them up
kimi --help | grep -E '(start|sync|wrap-up|audit)'
```

### Fallback if Kimi's plugin API isn't compatible

If Kimi's plugin system doesn't expose an entry point that lets you register Click subcommands, or doesn't give you session access from a plugin, keep the "read-and-follow" pattern but add a shell alias layer instead:

```bash
# In your shell profile
for cmd in .agents/commands/*.md; do
  name=$(basename "$cmd" .md)
  alias "kimi-$name"="kimi --prompt-file $cmd"
done
```

This at least gives you `kimi-start`, `kimi-sync` etc. at the shell level while the real plugin work waits for a Kimi release that exposes the right hooks.

---

## After all three tasks

Run the full verification from the end of the original port:

```bash
# TOML valid with 11 hooks (was 9, +2 for SubagentStart/Stop)
python3 -c "import tomli; d=tomli.loads(open('kimi-config.toml').read()); print(len(d['hooks']), 'hooks')"

# All agents still resolve from root
python3 -c "
import yaml, pathlib
root = yaml.safe_load(open('.agents/kimify/agent.yaml').read())
base = pathlib.Path('.agents/kimify')
for name, sa in root['agent']['subagents'].items():
    target = (base / sa['path']).resolve()
    assert target.exists(), name
print('all subagent paths resolve')
"

# New scripts are executable
test -x .agents/hooks/track-subagent.sh && echo 'track-subagent OK'
test -x .agents/scripts/remap-models.py && echo 'remap-models OK'

# No dangling Claudify refs in shipped files (skills dir intentionally unchanged)
grep -rl '\.claude/' .agents/ Task\ Board.md Scratchpad.md KIMIFY.md SETUP.md kimi-config.toml 2>/dev/null \
  | grep -v '.agents/skills/' \
  | grep -v 'bash-allow.txt' || echo 'clean'
```

When all three checks pass, update `SETUP.md`'s "Known limitations" section to reflect what's now restored, commit, and ship.

## Suggested commit sequence

```bash
git add .agents/hooks/track-subagent.sh .agents/hooks/guard-bash.sh .agents/agents/*/bash-allow.txt kimi-config.toml
git commit -m "Restore per-agent bash scoping via SubagentStart/Stop hooks"

git add .agents/scripts/remap-models.py SETUP.md
git commit -m "Add model alias rewriter + docs"

git add .agents/plugin/
git commit -m "Promote slash commands to Kimi plugin package"
```

---

Good luck. If any step's API surface turns out different from what I've assumed (particularly Task 3's plugin interface), lean on the fallback or open the Kimi source file directly — the structure in `src/kimi_cli/` is small enough to read through in 10 minutes.
