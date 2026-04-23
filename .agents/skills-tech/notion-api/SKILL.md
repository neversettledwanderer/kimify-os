---
name: notion-api
description: Create, read, and update Notion pages and databases using the REST API with curl. Manage documentation, wikis, and databases without MCP dependencies.
---

# Notion API Automation

Create, read, and update Notion pages and databases using the REST API with `curl`.

## Prerequisites

1. Create an integration at https://www.notion.so/my-integrations
   - Name: "Kimify Automation"
   - Copy the **Internal Integration Token**

2. Share pages/databases with your integration:
   - Open the page in Notion → Share → Add connections → Select your integration

3. Store the token securely:
   ```bash
   export NOTION_TOKEN="secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

## Core Workflows

### Search Pages and Databases

```bash
curl -s https://api.notion.com/v1/search \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{"query": "Project Wiki"}' | jq '.results[] | {title: .properties.title.title[0].text.content, id: .id}'
```

### Create a Page

```bash
# Create page under a parent page
PARENT_PAGE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

curl -s https://api.notion.com/v1/pages \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"parent\": { \"page_id\": \"$PARENT_PAGE_ID\" },
    \"properties\": {
      \"title\": {
        \"title\": [{ \"text\": { \"content\": \"Meeting Notes - $(date +%Y-%m-%d)\" } }]
      }
    },
    \"children\": [
      {
        \"object\": \"block\",
        \"type\": \"heading_2\",
        \"heading_2\": {
          \"rich_text\": [{ \"type\": \"text\", \"text\": { \"content\": \"Action Items\" } }]
        }
      },
      {
        \"object\": \"block\",
        \"type\": \"to_do\",
        \"to_do\": {
          \"rich_text\": [{ \"type\": \"text\", \"text\": { \"content\": \"Review PR #456\" } }],
          \"checked\": false
        }
      }
    ]
  }" | jq '{id: .id, url: .url}'
```

### Query a Database

```bash
DATABASE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

curl -s "https://api.notion.com/v1/databases/$DATABASE_ID/query" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "filter": {
      "property": "Status",
      "select": {"equals": "In Progress"}
    }
  }' | jq '.results[] | {name: .properties.Name.title[0].text.content, status: .properties.Status.select.name}'
```

### Add Database Row

```bash
curl -s https://api.notion.com/v1/pages \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d "{
    \"parent\": { \"database_id\": \"$DATABASE_ID\" },
    \"properties\": {
      \"Name\": {
        \"title\": [{ \"text\": { \"content\": \"New Feature Request\" } }]
      },
      \"Status\": {
        \"select\": { \"name\": \"Backlog\" }
      },
      \"Priority\": {
        \"select\": { \"name\": \"High\" }
      }
    }
  }"
```

### Update a Page

```bash
PAGE_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

curl -s -X PATCH "https://api.notion.com/v1/pages/$PAGE_ID" \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "properties": {
      "Status": { "select": { "name": "Done" } }
    }
  }'
```

## Quick Reference

| Task | Endpoint | Method |
|------|----------|--------|
| Search | `/v1/search` | POST |
| Get page | `/v1/pages/{id}` | GET |
| Create page | `/v1/pages` | POST |
| Update page | `/v1/pages/{id}` | PATCH |
| Query database | `/v1/databases/{id}/query` | POST |
| Get database | `/v1/databases/{id}` | GET |

## Tips

- Always include `Notion-Version: 2022-06-28` header
- Page/database IDs are UUIDs without hyphens in URLs, but WITH hyphens in API calls
- Use `jq` to parse JSON responses
- For rich text, wrap content in `"rich_text": [{"type": "text", "text": {"content": "..."}}]`
- Block types: `paragraph`, `heading_1`, `heading_2`, `heading_3`, `bulleted_list_item`, `numbered_list_item`, `to_do`, `code`

## Related Use Cases

- Meeting notes → Notion pages
- GitHub issues → Notion database rows
- Daily standup status updates
- Documentation publishing from markdown
- Project status dashboards
