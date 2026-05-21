# Kimify — setup

Kimify is the Kimi CLI port of Claudify. Same operating system (memory, rituals, 13 specialist agents, safety hooks, skill library), rebuilt to run on Kimi CLI using Kimi 2.6.

## Platform support

Kimify is built for macOS and Linux. The 11 safety hooks are bash scripts and depend on `jq`, so they don't run natively on Windows.

**On Windows, use WSL2.** Install Ubuntu (or another Linux distro) via WSL2, then follow this guide inside the Linux shell — `pip install kimi-cli`, `apt-get install jq`, clone the repo to a WSL-side path (e.g. `/home/you/kimify-os`), and launch Kimi from there. Avoid putting the project under `/mnt/c/...` — file I/O across the Windows mount is much slower and the hooks read/write a lot.

Git Bash or MSYS2 might mostly work but you'll hit edge cases (CRLF line endings breaking script execution, path translation when Kimi passes args to hooks, missing `jq`). Not recommended.

## 1. Install Kimi CLI and jq

```bash
# Kimi CLI
pip install kimi-cli

# Kimi Agent SDK (optional — only if you want to wrap hooks with SDK calls)
pip install kimi-agent-sdk
```

`jq` is required by the safety hooks:

```bash
# macOS
brew install jq

# Ubuntu / Debian
sudo apt-get install jq
```

Verify: `kimi --version` and `jq --version`.

## 2. Log in and configure your model

```bash
kimi
/login
```

Set your default model to Kimi 2.6 in `~/.local/share/kimi/config.toml`:

```toml
default_model = "kimi-k2"

[providers.moonshot]
# fill in per Kimi CLI docs
```

## 3. Merge the Kimify hooks into your Kimi config

Open `~/.local/share/kimi/config.toml` and paste the entire contents of `kimi-config.toml` (in this project root) into it. The file contains an 11-entry `[[hooks]]` block wired to the safety and lifecycle scripts under `.agents/hooks/`.

If your Kimi config already has a `hooks` array, append Kimify's entries — don't overwrite.

**Optional: remap model aliases.** Each agent.yaml assumes `kimi-k2` / `kimi-k2-turbo` / `kimi-k2-thinking`. If your Kimi config defines them under different names, run `.agents/scripts/remap-models.py --map kimi-k2=<your-alias> ...` to rewrite the fleet in one shot.

## 4. Set the project root env var (optional but recommended)

The hooks auto-detect the project dir via `$KIMI_PROJECT_DIR → $CLAUDE_PROJECT_DIR → $(pwd)`. Setting it explicitly avoids surprises:

```bash
export KIMI_PROJECT_DIR="$(pwd)"   # add to shell profile or direnv
```

## 5. Add the tech skills root (optional but recommended)

The new `.agents/skills-tech/` collection contains development and automation skills. To make them available to the agent, add this to `~/.local/share/kimi/config.toml`:

```toml
[[skill_roots]]
path = "${KIMI_PROJECT_DIR}/.agents/skills-tech"
```

Or launch with:
```bash
kimi --skill-root .agents/skills-tech --agent .agents/kimify/agent.yaml
```

## 6. Launch with the Kimify root agent

```bash
kimi --agent .agents/kimify/agent.yaml
```

The root agent will read `.agents/memory.md`, `.agents/knowledge-base.md`, and `KIMIFY.md` on startup, then wait for your first prompt. Type `/start` to kick off the daily ritual.

## 7. Install the Kimify Commands plugin (optional)

Kimify's slash commands (`/start`, `/sync`, `/wrap-up`, etc.) can be exposed to the AI agent as callable plugin tools, and to your shell as aliases.

**Plugin tools** — Install into Kimi CLI so the agent can invoke commands directly:

```bash
# From the project root
.agents/plugin/kimify-commands/install.sh

# Verify
kimi plugin list
# Expect: kimify-commands v0.1.0
```

Once installed, the `kimify_command` tool is available to the agent in every session. When you type `/start`, the agent calls the tool, which reads `.agents/commands/start.md` and returns its procedure.

**Shell aliases** — For CLI-level invocation before starting a session:

```bash
# Generate aliases (run from project root)
eval "$(.agents/scripts/generate-shell-aliases.sh)"

# Now you can run:
kimi-start
kimi-sync
kimi-wrap-up
# etc.
```

Add the `eval` line to your shell profile (`.zshrc`, `.bashrc`) to persist the aliases.

## What's in the box

- **13 specialist subagents** under `.agents/agents/*/` (each as an `agent.yaml` + `system.md` pair):
  - Original 9: `archaeologist`, `auditor`, `debt-collector`, `error-whisperer`, `onboarding-sherpa`, `pr-ghostwriter`, `rubber-duck`, `unsticker`, `yak-shave-detector`
  - Added from Claude port: `code-reviewer`, `ui-engineer`, `backend-architect`, `python-engineer`
- **22 instruction-style commands** under `.agents/commands/*.md`. These are not executable — the root agent reads and follows them when you type `/start`, `/sync`, `/clear`, `/wrap-up`, `/audit`, `/onboard`, `/review`, `/retro`, etc.
- **11 safety hooks** under `.agents/hooks/*.sh`: bash guard, pre-write backup, completeness gate, change/failure/verdict logging, pre-compact handoff, post-compact resume, session reset, and subagent tracking.
- **1,728 domain skills** across 31 categories under `.agents/skills/`. Loaded on demand.
- **15 tech skills** under `.agents/skills-tech/` — development tools, research workflows, and shell-based automations (GitHub, Slack, Notion). See `.agents/skills-tech/README.md` for setup.
- **State files**: `.agents/memory.md`, `.agents/knowledge-base.md`, `.agents/knowledge-nominations.md`, `.agents/command-index.md`.
- **Root agent** (`.agents/kimify/`): The top-level agent definition launched via `kimi --agent .agents/kimify/agent.yaml`.
- **Scripts** (`.agents/scripts/`): Utility scripts for model remapping and shell alias generation.
- **Root docs**: `KIMIFY.md` (main instructions), `Task Board.md`, `Scratchpad.md`, `Daily Notes/`.
- **Future**: `SAAS-AUTOMATIONS-CATALOG.md` — 67 MCP-dependent SaaS integrations catalogued for future implementation.

## What changed vs. Claudify

| Concern | Claudify (Claude Code) | Kimify (Kimi CLI) |
|---|---|---|
| Directory | `.claude/` | `.agents/` |
| Hook config | `.claude/settings.json` | `~/.local/share/kimi/config.toml` |
| Project dir env | `$CLAUDE_PROJECT_DIR` | `$KIMI_PROJECT_DIR` (falls back to `$CLAUDE_PROJECT_DIR`, then `pwd`) |
| Agent format | `.claude/agents/*.md` (frontmatter + body) | `.agents/agents/{name}/agent.yaml` + `system.md` |
| Project instructions | `CLAUDE.md` | `KIMIFY.md` |
| Slash commands | `.claude/commands/*.md` (auto-discovered) | `.agents/commands/*.md` — root agent reads-and-follows, plus optional Kimi plugin tool (`kimify_command`) and shell aliases (`kimi-start`, etc.) |
| Stop-hook verdict | Haiku `prompt` hook in settings.json | Shell hook only. To restore AI verdict, wrap `kimi-agent-sdk` in a shell script piped into `log-stop-verdict.sh`. |
| Subagent spawning | `Task`/`Agent` tool | `kimi_cli.tools.agent:Agent` tool, with subagents declared in root `agent.yaml`'s `subagents` block |

Tool-name mappings are applied automatically in each ported `agent.yaml`. Scoped bash filters like `Bash(git:*)` become plain `Shell` — scoping is now enforced by `guard-bash.sh` at runtime rather than at the agent-spec layer. The original Claude metadata (model alias, memory mode, maxTurns, scoped tools) is preserved as comments at the top of each `agent.yaml`.

## Daily workflow

```
Morning:    /start → work → /sync
Afternoon:  work → /clear (if context gets heavy) → work
Evening:    /wrap-up
```

## Troubleshooting

**Hooks not firing.** Check `chmod +x .agents/hooks/*.sh` and verify your `config.toml` hooks block references the correct absolute path (the provided template uses `${KIMI_PROJECT_DIR:-$(pwd)}`).

**`$CLAUDE_PROJECT_DIR` still referenced somewhere.** `grep -r CLAUDE_PROJECT_DIR .agents/` should return nothing after the port. If it does, file an issue.

**Bash guard blocking something legitimate.** Read `.agents/logs/incident-log.md` for the reason. Edit `.agents/hooks/guard-bash.sh` to adjust the allowlist.

**Completeness gate blocking a write.** The file is likely one of the gated ones (`knowledge-base.md`, `memory.md`, `settings.json`, agent defs). Your content probably has TBD/TODO or missing provenance. Either fix the content or, for non-gated scratch work, write to `Scratchpad.md` or `Daily Notes/` instead.
