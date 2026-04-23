# Kimify

An opinionated operating system for [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) — ports the Claudify agent OS to Kimi 2.6. Adds memory, rituals, quality gates, 13 specialist subagents, and a 1,743-skill library on top of Kimi's base CLI.

If you've used [Claudify](https://github.com/MoonshotAI/kimi-cli) on Claude Code, Kimify is the same shape of system running on Kimi CLI instead.

## What's in it

- **13 specialist subagents** — auditor, archaeologist, debt-collector, error-whisperer, onboarding-sherpa, pr-ghostwriter, rubber-duck, unsticker, yak-shave-detector, code-reviewer, ui-engineer, backend-architect, python-engineer
- **22 slash commands** — `/start`, `/sync`, `/wrap-up`, `/audit`, `/clear`, `/unstick`, `/retro`, `/onboard`, `/review`, `/handoff`, `/note`, and others. Available as Kimi plugin tools and as shell aliases (`kimi-start`, `kimi-sync`, …)
- **11 safety hooks** — bash-command guard with per-agent allowlists, pre-write backups, completeness gates (TOML/markdown validation), change/failure/verdict logging, pre-compact handoff, post-compact resume, session reset
- **6-tier memory** — active session memory, per-agent memory, system-wide knowledge base (auditor-gated), knowledge nominations pipeline, optional MCP graph, daily notes
- **1,743 skills** — 1,728 domain skills (31 categories) plus 15 curated tech skills (development tools, research workflows, shell automations)
- **AI session verdict** via Kimi Agent SDK — auto-reviews every session at Stop and logs a structured verdict

## Quick start

```bash
# 1. Install Kimi CLI and dependencies
pip install kimi-cli kimi-agent-sdk
brew install jq       # or apt-get install jq

# 2. Clone this repo
git clone https://github.com/neversettledwanderer/kimify-os.git
cd kimify-os

# 3. Log in and configure Kimi
kimi
/login

# 4. Merge the hook config into Kimi's config
#    Paste the contents of kimi-config.toml into ~/.local/share/kimi/config.toml
#    (append to the existing [[hooks]] array — don't overwrite)

# 5. Point Kimi at the project and launch
export KIMI_PROJECT_DIR="$(pwd)"
kimi --agent .agents/kimify/agent.yaml

# 6. Inside Kimi, kick off the daily ritual
/start
```

Full install, troubleshooting, and plugin setup: see [SETUP.md](SETUP.md).

## Daily workflow

```
Morning:    /start → work → /sync
Afternoon:  work → /clear (if context gets heavy) → work
Evening:    /wrap-up
```

Ad-hoc: `/note <text>` to capture anything to memory mid-task; `/unstick <problem>` when stuck; `/audit` after completing a non-trivial task.

## How it works

Kimify layers four things on top of Kimi CLI:

| Layer | Purpose | Lives in |
|---|---|---|
| Root agent | Orchestrator that reads memory, dispatches to specialists | `.agents/kimify/` |
| Subagents | Specialists for audit, debugging, onboarding, reviews, etc. | `.agents/agents/*/` |
| Hooks | Deterministic safety net wired to Kimi's lifecycle events | `.agents/hooks/*.sh` |
| Skills | Domain knowledge loaded on demand | `.agents/skills/`, `.agents/skills-tech/` |

Hooks run around tool calls and session events — they can hard-block dangerous bash, snapshot files before edits, enforce TBD/TODO-free agent definitions, and capture AI-generated session verdicts at Stop. See [KIMIFY.md](KIMIFY.md) for the full architecture and retrieval map.

## Project structure

```
kimify-os/
├── .agents/
│   ├── kimify/              # Root agent definition
│   ├── agents/              # 13 specialist subagents
│   ├── commands/            # 22 slash-command procedures
│   ├── hooks/               # 11 safety/lifecycle scripts
│   ├── plugin/              # Kimi plugin package
│   ├── scripts/             # Utilities (model remapper, alias generator)
│   ├── skills/              # 1,728 domain skills
│   ├── skills-tech/         # 15 curated development skills
│   ├── memory.md            # Active session context
│   ├── knowledge-base.md    # System-wide rules (auditor-gated)
│   └── command-index.md     # All commands catalogued
├── Daily Notes/             # Per-day session logs (auto-created)
├── KIMIFY.md                # System architecture & retrieval map
├── SETUP.md                 # Install & configuration
├── HANDOFF.md               # Archived port handoff (reference only)
└── kimi-config.toml         # Hook config to merge into Kimi
```

## Customisation

- **Model aliases** — swap the default model across all 13 agents in one shot: `.agents/scripts/remap-models.py --map kimi-k2=kimi-k2-turbo`
- **Per-agent bash scoping** — edit `.agents/agents/<name>/bash-allow.txt` to allow specific commands for a single agent; blocked everywhere else
- **Completeness gates** — `.agents/hooks/completeness-gate.sh` enforces TOML validity for `kimi-config.toml` and TBD/TODO-free content for `knowledge-base.md` and agent definitions
- **Project root env var** — `KIMI_PROJECT_DIR` overrides pwd detection (useful if you launch Kimi from outside the project dir)

## Credits

- Based on [Claudify](https://github.com/simonmysun/claudify) — the original Claude Code OS this port adapts
- Runs on [Kimi CLI](https://github.com/MoonshotAI/kimi-cli) by Moonshot AI
- Stop-hook session verdicts use [Kimi Agent SDK](https://github.com/MoonshotAI/kimi-agent-sdk)

## License

MIT — see [LICENSE](LICENSE).
