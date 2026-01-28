# Agent Rules

## About

See README.md for this project's overview.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Framework**: TanStack Start (SSR + file-based routing)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Components**：Base-UI
- **State Management**: TanStack Query (server state) + React state (local)
- **Database**: PostgreSQL + Drizzle ORM
- **AI Integration**: TanStack AI + OpenAI
- **Canvas Editor**: @xyflow/react

## Memory

See `MEMORY/index.md` for this project's memory index. Read frontmatter first to see available entries. Create new files in `MEMORY/` folder for detailed entries with proper metadata (type, title, tags). When a complex bug is resolved or skill is learned, add an entry file and update the index frontmatter.

## Plan

See `PLAN/index.md` for high-level architecture and roadmap. Create additional files in `PLAN/` folder for detailed implementation plans of specific features or phases.

## Prompt Files Responsibilities

- **CLAUDE.md**: Non-negotiable rules, tech stack, and how to use memory/plan folders.
- **PLAN/index.md**: High-level architecture overview, roadmap, and current focus.
- **PLAN/*.md**: Detailed implementation plans for specific features.
- **MEMORY/index.md**: Memory index with entry list in frontmatter.
- **MEMORY/*.md**: Individual memory entries (bug fixes, patterns, preferences, skills).

## Update Triggers

- **CLAUDE.md**: When global rules or stack decisions change.
- **PLAN/**: When phases change, scope shifts, or new milestones are added.
- **MEMORY/**: When a bug is resolved, a repeatable workflow is discovered, a skill is learned, or user preferences change.

## Rules

- Use pnpm as package manager
- Always write elegant, clean, readable, and maintainable code
- Do not use `any` in TypeScript
- Always use Context7 MCP to get the latest docs when not sure about something
