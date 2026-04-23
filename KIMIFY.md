# Kimi Context — Kimify

This project uses Kimify, a professional operating system for Kimi CLI (ported from Claudify).
Always read `.agents/memory.md` before taking action.

## Quick Start
- Run `/start` to begin work
- Run `/sync` mid-day to refresh memory
- Run `/wrap-up` at end of day
- Run `/audit` to verify recent work quality
- Run `/clear` to safely flush context and resume fresh
- Run `/unstick` when stuck on a problem
- Run `/retro` for sprint retrospective
- Run `/system-audit` for deep infrastructure audit

## Key Files
- Memory: `.agents/memory.md` (read this for current context)
- Knowledge Base: `.agents/knowledge-base.md` (system-wide learned rules — read before every task)
- Task Board: `Task Board.md`
- Scratchpad: `Scratchpad.md` (quick capture, processed during /sync, cleared at /wrap-up)
- Daily Notes: `Daily Notes/` (created automatically by /start)
- Knowledge Nominations: `.agents/knowledge-nominations.md` (candidate learnings — auditor reviews)
- Command Index: `.agents/command-index.md` (all commands with triggers and tools)

## System Architecture
- **Agents** (`.agents/agents/`): Specialist subagents with persistent memory
  - `auditor` — Quality gate. Reviews work, promotes knowledge, proposes SOP revisions
  - `unsticker` — Unblocks you when stuck. Root-cause analysis, fresh approaches
  - `error-whisperer` — Translates cryptic errors into fixes. Pattern matching across sessions
  - `rubber-duck` — Forces you to articulate the real problem. Socratic debugging
  - `pr-ghostwriter` — Writes PR descriptions, commit messages, changelogs from diffs
  - `yak-shave-detector` — Catches scope creep. "You started doing X but now you're doing Y"
  - `debt-collector` — Tracks tech debt. Catalogues shortcuts, suggests when to pay them down
  - `onboarding-sherpa` — Learns a new codebase fast. Architecture maps, key-file identification
  - `archaeologist` — Excavates why code exists. Git blame + context reconstruction
  - `code-reviewer` — Senior fullstack review. Security, performance, architecture, best practices
  - `ui-engineer` — Frontend specialist. React, Vue, CSS, accessibility, design systems
  - `backend-architect` — TypeScript backend. APIs, databases, Bun, microservices, auth
  - `python-engineer` — Python backend. FastAPI, Django, SQLAlchemy, uv, asyncio
- **Commands** (`.agents/commands/`): Workflow rituals and utilities
- **Hooks** (`.agents/hooks/`): Deterministic safety enforcement (logging, verification)
- **Logs** (`.agents/logs/`): Audit trail + incident log — auto-populated by hooks
- **Skills** (`.agents/skills/`): Domain knowledge, loaded on demand
- **Tech Skills** (`.agents/skills-tech/`): Development tools, research workflows, shell automations

## Memory Architecture (6 Tiers)
1. **memory.md** — Active session context (what you're doing now)
2. **Agent Memory** (`.agents/agent-memory/`) — Per-agent persistent knowledge across sessions
3. **Knowledge Base** (`.agents/knowledge-base.md`) — System-wide learned rules (auditor-gated)
4. **Knowledge Nominations** (`.agents/knowledge-nominations.md`) — Candidate learnings pipeline
5. **MCP Knowledge Graph** — Structured entities and relations (if memory MCP enabled)
6. **Daily Notes** — Chronological session history and handoff records

## Command Awareness

All agents can invoke system commands. Read `.agents/command-index.md` for the full catalog.

- **Self-execute**: If you have the tools a command requires, read `.agents/commands/{name}.md` and follow the procedure directly.
- **Recommend**: If you lack the tools, output `RECOMMEND: /command [args] — [reason]` for the orchestrator.
- Agents should proactively invoke commands when trigger conditions match.

## Retrieval Map — Where to look for what

| You need... | Check first | Then |
|---|---|---|
| What am I doing right now? | `memory.md` → Now | Task Board → Today |
| How to do a procedure | `.agents/commands/` or `.agents/skills/` | KIMIFY.md or SETUP.md |
| A fact or learned rule | `knowledge-base.md` | Agent memory |
| What happened on a specific day | `Daily Notes/MMDDYY.md` | Audit trail |
| What went wrong before | `knowledge-base.md` → Hard Rules | Agent memory → Known Patterns |
| What commands exist | `.agents/command-index.md` | `.agents/commands/{name}.md` |

## Context Health

Sessions have finite context. Heavy operations consume it fast.

**Automatic safety net (hooks):**
- `PreCompact` hook saves state before auto-compaction
- `SessionStart(compact)` hook restores context after compaction
- `SessionStart(user)` hook resets stale gate files on every fresh session

**Completeness gates (PreToolUse Write|Edit — hard blocks):**
- **knowledge-base.md**: Every entry needs `[Source:]` provenance, max 200 lines, no TBD/TODO
- **memory.md**: Max 100 lines (Write only)
- **settings.json**: Must be valid JSON (broken JSON breaks all hooks)
- **Agent defs** (`.agents/agents/*.md`): No TBD/TODO — instructions must be definitive
- **Ungated** (iterative by nature): Daily Notes, Scratchpad, Templates, Logs, Commands, Skills

**Self-monitoring (soft signals — Claude's responsibility):**
- After ~30+ tool calls or 3+ large file reads: run `/clear` proactively
- If you see a "compacting conversation" warning: run `/clear` immediately
- If output quality degrades (repetition, missed details): run `/clear`
- When a discrete multi-step task completes: consider `/clear` before starting the next unrelated task
- When switching between different task domains: acknowledge the boundary, prefer `/clear` for heavy switches

**How /clear works:** Distills session state into memory.md + daily note handoff, preserving retrieval paths. Then automatically resumes work by reloading compressed context and executing the next action. Seamless to the user.

## Maintenance
- Keep memory.md compact (<100 lines)
- Aggressively prune stale items
- Done list cleared on Fridays
- Review incident log during /sync and /wrap-up
- Auditor proposes SOP revisions — user approves before changes apply
