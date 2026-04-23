---
name: github-cli
description: Automate GitHub repositories, issues, pull requests, and workflows using the gh CLI. Manage code workflows, create issues, review PRs, and handle releases without MCP dependencies.
---

# GitHub CLI Automation

Automate GitHub repository management, issue tracking, pull request workflows, and releases using the `gh` command-line tool.

## Prerequisites

- `gh` CLI installed (`brew install gh` or `winget install GitHub.cli`)
- Authenticated: `gh auth login`
- Working in a git repository with a GitHub remote

## Core Workflows

### Issues

```bash
# List open issues
gh issue list --state open

# Create an issue
gh issue create --title "Bug: login fails on mobile" --body "Description..." --label bug

# View issue details
gh issue view 123

# Add comment
gh issue comment 123 --body "Investigating..."

# Close issue
gh issue close 123 --comment "Fixed in #456"
```

### Pull Requests

```bash
# List PRs
gh pr list

# Create PR
gh pr create --title "Fix auth bug" --body "Closes #123" --base main

# View PR
gh pr view 456

# Check out PR locally
gh pr checkout 456

# Review and merge
gh pr review 456 --approve
gh pr merge 456 --squash

# Check CI status
gh pr checks 456
```

### Repositories

```bash
# View repo info
gh repo view --web

# Create new repo
gh repo create my-project --private --source=. --push

# List branches
gh api repos/OWNER/REPO/branches | jq '.[].name'

# Create branch
gh api repos/OWNER/REPO/git/refs -f ref='refs/heads/feature-x' -f sha=$(git rev-parse HEAD)
```

### Releases

```bash
# Create release
gh release create v1.2.0 --title "Version 1.2.0" --notes-file CHANGELOG.md

# List releases
gh release list
```

### Search

```bash
# Search code
gh search code "function auth" --repo owner/repo

# Search issues
gh search issues "bug label:high-priority" --repo owner/repo
```

## Quick Reference

| Task | Command |
|------|---------|
| List issues | `gh issue list` |
| Create issue | `gh issue create --title X --body Y` |
| Create PR | `gh pr create --title X --base main` |
| Merge PR | `gh pr merge NUM --squash` |
| Check CI | `gh pr checks NUM` |
| Create release | `gh release create TAG --notes-file FILE` |
| Search code | `gh search code QUERY --repo OWNER/REPO` |

## Tips

- Always run `gh auth status` first if commands fail
- Use `--web` flag to open results in browser
- `gh api` gives raw API access for anything not covered by CLI commands
- Combine with shell scripts for batch operations
