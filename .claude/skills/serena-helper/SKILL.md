---
name: serena-helper
description: Semantic code search and pattern discovery using Serena MCP
version: 1.0.0
author: ruvnet/claude-flow
---

# Serena Helper

Semantic code search integration for RuFlo V3.

## When to Use

This skill activates automatically when:
- Task complexity > 30%
- Project contains source code (.ts/.js/.py files)
- Pre-task hook triggers (automatic)

## Capabilities

### Onboarding Check
Checks if Serena has indexed the project, offers to onboard if needed.

### Pattern Discovery
Finds relevant code symbols and patterns based on task context.

### Pattern Storage
Saves successful patterns to memory for future reuse.

## Usage

Automatic activation via hooks. Manual invocation:
```
/skills serena-helper
```

## Configuration

```json
// .claude/settings.json
{
  "claudeFlow": {
    "serena": {
      "enabled": true,
      "autoOnboarding": "ask"
    }
  }
}
```

## Safety

- Errors fall back to standard search (Grep/Glob)
- Timeout protection (5s max)
- No blocking of existing workflows
