# SaaS Automation Skills Catalog

> Reference list of MCP-dependent automation skills from the Claude skills library.
> These require Composio Rube MCP (`https://rube.app/mcp`) to function.
> Catalogued for future adaptation when Kimify implements MCP support.

## High-Priority (Likely to need first)

| Skill | MCP Toolkit | Primary Use |
|-------|-------------|-------------|
| github-automation | `github` | Repo management, PRs, issues, CI/CD |
| slack-automation | `slack` | Messaging, channels, search, reactions |
| notion-automation | `notion` | Pages, databases, blocks, comments |
| gmail-automation | `gmail` | Email sending, labels, drafts |
| google-calendar-automation | `google_calendar` | Events, scheduling, availability |
| google-drive-automation | `google_drive` | Files, folders, permissions |
| googlesheets-automation | `google_sheets` | Spreadsheets, cells, formulas |
| jira-automation | `jira` | Issues, sprints, boards, projects |
| linear-automation | `linear` | Issues, cycles, projects |
| asana-automation | `asana` | Tasks, projects, portfolios |
| clickup-automation | `clickup` | Tasks, lists, docs |
| trello-automation | `trello` | Cards, boards, lists |
| monday-automation | `monday` | Items, boards, updates |
| todoist-automation | `todoist` | Tasks, projects, labels |
| airtable-automation | `airtable` | Bases, tables, records |
| hubspot-automation | `hubspot` | Contacts, deals, tickets |
| salesforce-automation | `salesforce` | Leads, opportunities, accounts |
| pipedrive-automation | `pipedrive` | Deals, contacts, activities |
| zoho-crm-automation | `zoho_crm` | Leads, contacts, deals |
| freshdesk-automation | `freshdesk` | Tickets, contacts, solutions |
| zendesk-automation | `zendesk` | Tickets, users, organizations |
| intercom-automation | `intercom` | Conversations, contacts, articles |
| helpdesk-automation | `helpdesk` | Tickets, agents, departments |
| stripe-automation | `stripe` | Payments, customers, subscriptions |
| shopify-automation | `shopify` | Products, orders, customers |
| square-automation | `square` | Payments, orders, customers |
| vercel-automation | `vercel` | Deployments, projects, domains |
| render-automation | `render` | Services, deployments |
| circleci-automation | `circleci` | Pipelines, workflows, jobs |
| datadog-automation | `datadog` | Monitors, dashboards, incidents |
| sentry-automation | `sentry` | Issues, projects, releases |
| pagerduty-automation | `pagerduty` | Incidents, services, schedules |
| posthog-automation | `posthog` | Insights, funnels, cohorts |
| mixpanel-automation | `mixpanel` | Events, insights, cohorts |
| amplitude-automation | `amplitude` | Events, charts, cohorts |
| segment-automation | `segment` | Sources, destinations, tracking |
| google-analytics-automation | `google_analytics` | Reports, audiences, goals |
| mailchimp-automation | `mailchimp` | Campaigns, audiences, automations |
| sendgrid-automation | `sendgrid` | Emails, templates, lists |
| postmark-automation | `postmark` | Emails, templates, servers |
| klaviyo-automation | `klaviyo` | Campaigns, flows, metrics |
| convertkit-automation | `convertkit` | Forms, sequences, broadcasts |
| brevo-automation | `brevo` | Campaigns, contacts, templates |
| activecampaign-automation | `activecampaign` | Campaigns, automations, deals |
| cal-com-automation | `cal_com` | Bookings, event types, schedules |
| calendly-automation | `calendly` | Events, invitees, webhooks |
| discord-automation | `discord` | Messages, channels, guilds |
| microsoft-teams-automation | `microsoft_teams` | Messages, channels, teams |
| telegram-automation | `telegram` | Messages, chats, bots |
| whatsapp-automation | `whatsapp` | Messages, templates, business |
| zoom-automation | `zoom` | Meetings, webinars, recordings |
| dropbox-automation | `dropbox` | Files, folders, sharing |
| box-automation | `box` | Files, folders, collaborations |
| one-drive-automation | `one_drive` | Files, folders, sharing |
| outlook-automation | `outlook` | Emails, folders, drafts |
| outlook-calendar-automation | `outlook_calendar` | Events, scheduling |
| figma-automation | `figma` | Files, comments, components |
| miro-automation | `miro` | Boards, items, teams |
| canva-automation | `canva` | Designs, folders, templates |
| webflow-automation | `webflow` | Sites, pages, collections |
| supabase-automation | `supabase` | Projects, tables, auth |
| bamboohr-automation | `bamboohr` | Employees, time off, reports |
| confluence-automation | `confluence` | Pages, spaces, comments |
| coda-automation | `coda` | Docs, tables, formulas |
| basecamp-automation | `basecamp` | Projects, todos, messages |
| close-automation | `close` | Leads, opportunities, activities |
| docusign-automation | `docusign` | Envelopes, templates, signing |
| gitlab-automation | `gitlab` | Projects, issues, merge requests |
| bitbucket-automation | `bitbucket` | Repositories, pull requests |
| make-automation | `make` | Scenarios, connections, data |
| instagram-automation | `instagram` | Media, comments, insights |
| linkedin-automation | `linkedin` | Posts, connections, messages |
| twitter-automation | `twitter` | Tweets, threads, DMs |
| tiktok-automation | `tiktok` | Videos, comments, insights |
| reddit-automation | `reddit` | Posts, comments, subreddits |
| youtube-automation | `youtube` | Videos, playlists, comments |
| wrike-automation | `wrike` | Tasks, projects, folders |
| langsmith-fetch | `langsmith` | Runs, traces, feedback |

## Adaptation Notes

When MCP becomes available in Kimify:

1. Each skill needs the `requires: mcp: [rube]` block preserved
2. Tool names (e.g., `GITHUB_CREATE_AN_ISSUE`) are Composio-specific and should work as-is
3. Replace `WebFetch` references with `FetchURL`
4. Remove `RUBE_MANAGE_CONNECTIONS` setup instructions if using a different auth flow
5. Test each skill with actual MCP connection before relying on it

## Quick-Start Priority for MCP Day

If implementing MCP incrementally, start with:
1. **github-automation** — Most commonly needed for development workflows
2. **slack-automation** — Team communication
3. **notion-automation** — Documentation and knowledge base
4. **gmail-automation** — Email automation
5. **google-calendar-automation** — Scheduling
6. **jira-automation** or **linear-automation** — Project management
7. **stripe-automation** — Payments (if applicable)
