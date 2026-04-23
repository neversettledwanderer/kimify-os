# Kimify Tech Skills

> Technical skills, tool integrations, and developer workflows for the Kimify AI OS.
> These supplement the 1,728 business/domain skills in `.agents/skills/`.

## Skill Root Setup

To load these skills in Kimi CLI, add this to your `~/.local/share/kimi/config.toml`:

```toml
[[skill_roots]]
path = "/path/to/kimify-os/.agents/skills-tech"
```

Or use the `--skill-root` flag when launching:

```bash
kimi --skill-root .agents/skills-tech
```

## Skills Overview

### Development & Tools

| Skill | Description | Scripts |
|-------|-------------|---------|
| `mcp-builder` | Build MCP (Model Context Protocol) servers in Python or TypeScript | ✅ evaluation.py, connections.py |
| `webapp-testing` | Test local web apps with Playwright | ✅ with_server.py, examples |
| `document-skills` | Process DOCX, PDF, PPTX, XLSX files | ✅ Python scripts per format |
| `changelog-generator` | Generate user-facing changelogs from git commits | — |

### Business & Research

| Skill | Description |
|-------|-------------|
| `content-research-writer` | Collaborative writing partner with research and citations |
| `competitive-ads-extractor` | Analyze competitor ads from ad libraries |
| `developer-growth-analysis` | Analyze coding patterns and identify improvement areas |
| `lead-research-assistant` | Find and qualify sales leads with outreach strategies |
| `meeting-insights-analyzer` | Analyze meeting transcripts for communication patterns |
| `twitter-algorithm-optimizer` | Optimize tweets for reach and engagement |
| `domain-name-brainstormer` | Generate and check domain name availability |
| `tailored-resume-generator` | Create ATS-optimized resumes tailored to job descriptions |

### Shell-Based Automations (No MCP Required)

| Skill | Tool | Description |
|-------|------|-------------|
| `github-cli` | `gh` CLI | Issues, PRs, releases, repo management |
| `slack-webhook` | `curl` | Post messages and notifications to Slack |
| `notion-api` | `curl` | Create, read, update Notion pages and databases |

### Future MCP Skills

See [SAAS-AUTOMATIONS-CATALOG.md](./SAAS-AUTOMATIONS-CATALOG.md) for 67 SaaS automation skills ready to adapt when MCP is implemented.

## Usage

Skills are loaded automatically by Kimi CLI when the task matches the skill's description. You can also invoke them explicitly:

```
Use the changelog-generator skill to create release notes for v2.5.0
```

```
Use the github-cli skill to create an issue for this bug
```

```
Use the content-research-writer skill to help me outline this article
```

## Adding New Skills

1. Create a directory: `mkdir .agents/skills-tech/my-skill`
2. Write `SKILL.md` with YAML frontmatter (`name`, `description`) + markdown instructions
3. Optional: Add `scripts/`, `references/`, or `assets/` subdirectories
4. Test by running Kimi CLI with `--skill-root .agents/skills-tech`

See the built-in `skill-creator` skill for detailed guidance on creating effective skills.

## Lean Design

This collection is intentionally lean:
- **No XSD schemas** or reference docs that bloat context (document-skills includes only Python scripts)
- **No MCP-dependent skills** until MCP is actually available
- **Shell-based alternatives** for common automations (GitHub, Slack, Notion) that work today
- Process-focused skills that provide knowledge, not just tool mappings

## Source

Adapted from the Claude skills library (`awesome-claude-skills`) with Claude-specific references removed and Kimi CLI compatibility added.
