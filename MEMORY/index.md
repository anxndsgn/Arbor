---
description: Agent memory storage for project learnings, patterns, and skills
type: memory-index
entries:
  # Example format:
  # - id: unique-id
  #   type: bug-fix | pattern | preference | skill
  #   title: Short title
  #   file: optional-detail-file.md
---

# Memory Index

This folder stores durable agent learnings organized by type.

## Entry Types

| Type | Description |
|------|-------------|
| `bug-fix` | Complex bug resolutions with cause and solution |
| `pattern` | Repeatable workflows or code patterns |
| `preference` | User preferences and project conventions |
| `skill` | Learned capabilities and techniques |

## How to Add Entries

1. Create a new markdown file in this folder with descriptive name
2. Add metadata frontmatter with `type`, `title`, and `tags`
3. Update this index file's `entries` list in frontmatter

## Memory Entry Template

Use this template when creating new memory entries:

```markdown
---
type: bug-fix | pattern | preference | skill
title: Short descriptive title
tags: [relevant, tags]
created: YYYY-MM-DD
---

## Context

What situation or problem prompted this entry.

## Details

The actual learning, solution, or pattern.

## Prevention / Application

How to avoid the issue or when to apply this pattern.
```

## Trigger Rules

- Add an entry when a complex bug is resolved
- Add an entry when a repeatable workflow or pattern is discovered
- Add an entry when user preferences change or are clarified
- Add an entry when a new skill or technique is learned
