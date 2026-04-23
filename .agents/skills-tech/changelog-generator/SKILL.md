---
name: changelog-generator
description: Automatically creates user-facing changelogs from git commits by analyzing commit history, categorizing changes, and transforming technical commits into clear, customer-friendly release notes. Turns hours of manual changelog writing into minutes of automated generation.
---

# Changelog Generator

This skill transforms technical git commits into polished, user-friendly changelogs that your customers and users will actually understand and appreciate.

## When to Use This Skill

- Preparing release notes for a new version
- Creating weekly or monthly product update summaries
- Documenting changes for customers
- Writing changelog entries for app store submissions
- Generating update notifications
- Creating internal release documentation
- Maintaining a public changelog/product updates page

## What This Skill Does

1. **Scans Git History**: Analyzes commits from a specific time period or between versions
2. **Categorizes Changes**: Groups commits into logical categories (features, improvements, bug fixes, breaking changes, security)
3. **Translates Technical → User-Friendly**: Converts developer commits into customer language
4. **Formats Professionally**: Creates clean, structured changelog entries
5. **Filters Noise**: Excludes internal commits (refactoring, tests, etc.)
6. **Follows Best Practices**: Applies changelog guidelines and your brand voice

## How to Use

### Basic Usage

From your project repository:

```
Create a changelog from commits since last release
```

```
Generate changelog for all commits from the past week
```

```
Create release notes for version 2.5.0
```

### With Specific Date Range

```
Create a changelog for all commits between March 1 and March 15
```

### With Custom Guidelines

```
Create a changelog for commits since v2.4.0, using my changelog 
guidelines from CHANGELOG_STYLE.md
```

## Instructions

When generating a changelog:

1. **Read Git History**
   - Use `git log` to get commits in the target range
   - Read commit messages, authors, and dates
   - Identify merge commits and tags

2. **Categorize Changes**

   Group commits into:
   - **✨ New Features**: New functionality, capabilities, integrations
   - **🔧 Improvements**: Performance, UX, reliability enhancements
   - **🐛 Bug Fixes**: Resolved issues, crashes, errors
   - **⚠️ Breaking Changes**: API changes, removed features, migrations needed
   - **🔒 Security**: Patches, vulnerability fixes
   - **📚 Documentation**: Help, guides, README updates
   - **🏗️ Infrastructure**: CI/CD, dependencies, build system

3. **Translate to User Language**

   For each commit:
   - Identify the user-facing impact (not the technical implementation)
   - Use active voice and clear language
   - Include benefits, not just changes
   - Remove internal jargon

   **Example translation**:
   - Commit: `refactor(auth): migrate JWT validation to middleware chain`
   - Changelog: `**Faster logins**: Authentication now processes 40% faster with improved session handling`

4. **Format Output**

   Structure as:
   ```markdown
   # [Version] — [Date]
   
   ## ✨ New Features
   - **[Feature name]**: [What it does and why it matters]
   - **[Feature name]**: [What it does and why it matters]
   
   ## 🔧 Improvements
   - **[Improvement]**: [Benefit to user]
   
   ## 🐛 Bug Fixes
   - **[Fix]**: [What was broken and how it's resolved]
   
   ## ⚠️ Breaking Changes
   - **[Change]**: [What changed and migration steps]
   
   ## 🔒 Security
   - **[Fix]**: [Vulnerability addressed]
   ```

5. **Filter and Prioritize**
   - Remove internal-only changes (tests, refactoring, docs-only)
   - Highlight top 3-5 most impactful changes
   - Order by user impact, not commit order
   - Keep entries concise (1-2 lines each)

## Example

**User**: "Create a changelog for commits from the past 7 days"

**Output**:
```markdown
# Updates - Week of March 10, 2024

## ✨ New Features

- **Team Workspaces**: Create separate workspaces for different 
  projects. Invite team members and keep everything organized.

- **Keyboard Shortcuts**: Press ? to see all available shortcuts. 
  Navigate faster without touching your mouse.

## 🔧 Improvements

- **Faster Sync**: Files now sync 2x faster across devices
- **Better Search**: Search now includes file contents, not just titles

## 🐛 Fixes

- Fixed issue where large images wouldn't upload
- Resolved timezone confusion in scheduled posts
- Corrected notification badge count
```

## Tips

- Run from your git repository root
- Specify date ranges for focused changelogs
- Use your CHANGELOG_STYLE.md for consistent formatting
- Review and adjust the generated changelog before publishing
- Save output directly to CHANGELOG.md
- Include contributor credits for open-source projects
- Link to documentation for complex features

## Related Use Cases

- Creating GitHub release notes
- Writing app store update descriptions
- Generating email updates for users
- Creating social media announcement posts
