---
name: developer-growth-analysis
description: Analyzes recent coding work and project history to identify development patterns, technical gaps, and areas for improvement. Generates a personalized growth report with actionable recommendations.
---

# Developer Growth Analysis

This skill provides personalized feedback on your recent coding work by analyzing project activity and identifying patterns that reveal strengths and areas for growth.

## When to Use This Skill

- Understanding your development patterns and habits from recent work
- Identifying specific technical gaps or recurring challenges
- Discovering which topics would benefit from deeper study
- Getting curated learning resources tailored to your actual work patterns
- Tracking improvement areas across your recent projects
- Finding high-quality articles that directly address the skills you're developing

## What This Skill Does

1. **Reads Project History**: Accesses recent commits, code changes, and project files
2. **Identifies Development Patterns**: Analyzes problem types, technologies, and approaches
3. **Detects Improvement Areas**: Recognizes skill gaps, repeated struggles, inefficient approaches
4. **Generates a Personalized Report**: Work summary, improvement areas, specific recommendations
5. **Finds Learning Resources**: Curates articles and discussions relevant to your improvement areas
6. **Creates Action Items**: Specific, focused next steps for growth

## How to Use

Ask for an analysis of your recent coding work:

```
Analyze my developer growth from my recent work in this project
```

Or be more specific about which time period:

```
Analyze my work from this week and suggest areas for improvement
```

The skill will generate a formatted report with:
- Overview of your recent work
- Key improvement areas identified
- Specific recommendations for each area
- Curated learning resources
- Action items you can focus on

## Instructions

When a user requests analysis of their developer growth:

1. **Access Project History**

   Read from the project's git history and codebase:
   - Recent commits (past 1-4 weeks)
   - Files changed and technologies used
   - Patterns in code additions, deletions, modifications

2. **Analyze Work Patterns**

   Extract and analyze:
   - **Projects and Domains**: Backend, frontend, DevOps, data, mobile, etc.
   - **Technologies Used**: Languages, frameworks, tools, libraries
   - **Problem Types**: Performance, debugging, features, refactoring, setup
   - **Challenges Encountered**: Repeated questions, error patterns, complexity

3. **Identify Improvement Areas**

   Look for patterns suggesting:
   - **Knowledge gaps**: Areas where simpler approaches exist
   - **Repeated issues**: Same types of bugs or problems recurring
   - **Tooling gaps**: Missing tests, docs, CI/CD, linting
   - **Architecture patterns**: Consistent design choices that could be improved
   - **Code quality trends**: DRY violations, complexity growth, etc.

4. **Generate Personalized Report**

   Structure as:
   ```markdown
   # Developer Growth Report
   
   ## Work Summary ([Date Range])
   - **Projects**: [List]
   - **Primary Technologies**: [List]
   - **Key Accomplishments**: [Summary]
   
   ## Patterns Identified
   
   ### Strengths
   1. **[Strength]**: [Evidence from commits/code]
   2. **[Strength]**: [Evidence]
   
   ### Improvement Areas
   1. **[Area]**: [Specific observation]
      - **Evidence**: [Commit/file reference]
      - **Impact**: [Why this matters]
      - **Recommendation**: [Specific action]
   
   ## Learning Resources
   - **[Topic]**: [Search query or resource suggestion]
   - **[Topic]**: [Search query or resource suggestion]
   
   ## Action Items
   - [ ] [Specific, achievable task]
   - [ ] [Specific, achievable task]
   ```

5. **Find Learning Resources**

   For each improvement area:
   - Suggest web search queries to find relevant articles
   - Recommend documentation or tutorials
   - Note communities or forums for deeper learning

## Tips

- Run this weekly or bi-weekly for trend tracking
- Focus on one improvement area at a time
- Pair recommendations with concrete practice projects
- Re-run analysis after focusing on an area to measure progress
- Share reports with mentors for external validation

## Related Use Cases

- Preparing for performance reviews with concrete examples
- Identifying skills to highlight in job applications
- Building a personal learning roadmap
- Tracking growth across multiple projects
