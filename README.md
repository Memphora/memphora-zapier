# Memphora Zapier Integration

<p align="center">
  <img src="../frontend/public/logo.png" alt="Memphora Logo" width="120" height="120">
</p>

<p align="center">
  <strong>AI Memory for your Zapier automations</strong>
</p>

Connect Memphora to 6,000+ apps through Zapier. Give your AI assistants persistent memory across all your tools.

## Features

### Actions (Creates)

| Action | Description |
|--------|-------------|
| **Store Memory** | Save any information as a memory |
| **Store Conversation** | Extract memories from chat transcripts |
| **Delete Memory** | Remove outdated information |

### Searches

| Search | Description |
|--------|-------------|
| **Search Memories** | Find relevant memories by query |
| **Get Context** | Get formatted context for AI prompts |

### Triggers

| Trigger | Description |
|---------|-------------|
| **New Memory** | Fires when a new memory is created |

## Example Zaps

### 1. CRM → AI Memory
```
Trigger: New HubSpot contact
Action: Store Memory → "{{name}} works at {{company}} as {{job_title}}"
```

### 2. Support Ticket Context
```
Trigger: New Zendesk ticket
Action: Search Memories → customer email
Action: Add context to ticket notes
```

### 3. Meeting Notes → Memory
```
Trigger: New Fireflies transcript
Action: Store Conversation → transcript
Result: AI remembers key decisions
```

### 4. Slack → Memory
```
Trigger: New message in #decisions channel
Action: Store Memory → message content
```

## Setup

1. Get your API key from [memphora.ai/dashboard](https://memphora.ai/dashboard)
2. Connect Memphora in Zapier
3. Enter your API key
4. Start building Zaps!

## Development

```bash
# Install dependencies
npm install

# Test locally
zapier test

# Validate app
zapier validate

# Push to Zapier
zapier push
```

## Authentication

Uses API key authentication. Users need:
- **API Key**: From Memphora dashboard
- **Default User ID**: Optional, defaults to "zapier_user"

## Support

- Documentation: [memphora.ai/docs](https://memphora.ai/docs)
- Email: support@memphora.ai
- GitHub: [github.com/Memphora](https://github.com/Memphora)

## License

MIT License - see [LICENSE](LICENSE)
