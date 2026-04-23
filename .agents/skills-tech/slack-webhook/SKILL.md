---
name: slack-webhook
description: Send messages to Slack channels using incoming webhooks. Simple, no-MCP way to post notifications, alerts, and updates to Slack from any workflow.
---

# Slack Webhook Automation

Send messages to Slack channels using incoming webhooks. No MCP required — just a webhook URL and `curl`.

## Prerequisites

1. Create an incoming webhook in Slack:
   - Go to https://api.slack.com/apps
   - Create New App → From Scratch
   - Add features → Incoming Webhooks → Activate
   - Add New Webhook to Workspace → Choose channel
   - Copy the Webhook URL (starts with `https://hooks.slack.com/services/...`)

2. Store the webhook URL securely (env var or local config)

## Send a Message

```bash
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"

curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"text": "Hello from Kimify!"}'
```

## Rich Messages (Block Kit)

```bash
curl -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{
    "text": "Deployment complete",
    "blocks": [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "✅ Deployment Successful"
        }
      },
      {
        "type": "section",
        "fields": [
          {"type": "mrkdwn", "text": "*Project:*\nkimify-os"},
          {"type": "mrkdwn", "text": "*Version:*\nv1.2.0"},
          {"type": "mrkdwn", "text": "*Environment:*\nproduction"},
          {"type": "mrkdwn", "text": "*Duration:*\n3m 42s"}
        ]
      }
    ]
  }'
```

## Threaded Replies

```bash
# First message
RESPONSE=$(curl -s -X POST "$SLACK_WEBHOOK_URL" \
  -H 'Content-Type: application/json' \
  -d '{"text": "Starting build..."}')

# Extract thread_ts from response (requires different endpoint — use Slack API token for threads)
```

## Tips

- Keep messages concise — Slack truncates long text
- Use Block Kit for structured, professional-looking notifications
- Include relevant links (deploy URL, PR link, logs)
- @mention users with `<@USER_ID>` format
- Channel overrides: add `"channel": "#other-channel"` to post to a different channel

## Quick Reference

| Format | Example |
|--------|---------|
| Plain text | `{"text": "Hello"}` |
| Bold | `*bold text*` |
| Code | `` `code` `` |
| Link | `<https://example.com|Click here>` |
| Mention | `<@U12345678>` |
| Channel | `<#C12345678>` |

## Related Use Cases

- CI/CD pipeline notifications
- Daily standup reminders
- Error alerting from logs
- Deployment status updates
- Scheduled status reports
