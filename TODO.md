# Arbor - Visual Prompt Designer & Organizer

## Architecture Overview

### Tech Stack

- **Frontend**: React 19 + TypeScript
- **Framework**: TanStack Start (SSR + file-based routing)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **State Management**: TanStack Query (server state) + React state (local)
- **Database**: PostgreSQL + Drizzle ORM
- **AI Integration**: TanStack AI + OpenAI
- **Canvas Editor**: @xyflow/react

### Application Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
├─────────────────────────────────────────────────────────────────┤
│  Routes         │  Components        │  State                   │
│  ├── /          │  ├── ui/          │  ├── TanStack Query      │
│  ├── /editor    │  ├── editor/      │  │   (server sync)       │
│  ├── /library   │  ├── library/     │  └── React useState      │
│  └── /settings  │  └── common/      │      (local UI state)    │
├─────────────────────────────────────────────────────────────────┤
│                    TanStack Start (SSR/API)                     │
├─────────────────────────────────────────────────────────────────┤
│  Server Functions (RPC)  │  API Routes (REST/CLI)              │
│  ├── prompts.*          │  ├── /api/export                    │
│  ├── blocks.*           │  └── /api/sync                      │
│  └── ai.*               │                                      │
├─────────────────────────────────────────────────────────────────┤
│                      Data Layer (Drizzle)                       │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL                                                     │
│  ├── prompts            │  ├── tags                            │
│  ├── blocks             │  └── prompt_tags                     │
│  └── prompt_blocks      │                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Core Domain Models

1. **Prompt** - A complete prompt document that can be exported
2. **Block** - A reusable piece of prompt content (the "LEGO" building block)
3. **Tag** - Flat organization via tagging

---

## Build Steps

### Phase 1: Foundation Setup

- [ ] Set up database schema with Drizzle
  - [ ] Create `prompts` table (id, title, content, createdAt, updatedAt)
  - [ ] Create `blocks` table (id, name, content, category, createdAt)
  - [ ] Create `prompt_blocks` junction table (promptId, blockId, position, metadata)
  - [ ] Create `tags` table (id, name, color)
  - [ ] Create `prompt_tags` junction table (promptId, tagId)
- [ ] Set up database connection and migrations
- [ ] Create base server functions for CRUD operations

### Phase 2: Core UI Shell

- [ ] Create app layout with sidebar navigation
  - [ ] Sidebar with tag-based filtering
  - [ ] Main content area with resizable panels
- [ ] Implement routing structure
  - [ ] `/` - Dashboard/prompt list
  - [ ] `/editor/:promptId` - Visual prompt editor
  - [ ] `/library` - Block library browser

### Phase 3: Prompt Library & Management

- [ ] Build tag management
  - [ ] Create/rename/delete tags
  - [ ] Color picker for tags
- [ ] Build prompt list view
  - [ ] Search and filter prompts
  - [ ] Filter by tags
  - [ ] Create new prompt
  - [ ] Duplicate/delete prompts
- [ ] Implement prompt preview cards

### Phase 4: Visual Prompt Editor (Mind-Map Style)

- [ ] Integrate @xyflow/react canvas editor
- [ ] Implement block nodes on canvas
  - [ ] Text block node
  - [ ] Variable/placeholder block
  - [ ] Reference block (link to other prompts)
- [ ] Implement node connections
  - [ ] Drag to connect blocks
  - [ ] Connection validation
- [ ] Build block properties panel
  - [ ] Edit block content
  - [ ] Configure block settings

### Phase 5: Block Library ("Prompt LEGO")

- [ ] Build block library browser
  - [ ] Category-based organization
  - [ ] Search blocks
  - [ ] Preview block content
- [ ] Implement block creation workflow
  - [ ] Create from scratch
  - [ ] Extract from existing prompt

### Phase 6: LLM-Assisted Drafting

- [ ] Integrate OpenAI via TanStack AI
  - [ ] Set up AI server functions
  - [ ] Streaming response handling
- [ ] Build AI drafting panel
  - [ ] Natural language input
  - [ ] Generate prompt suggestions
  - [ ] Refine existing content

### Phase 7: Export & Sync

- [ ] Implement export functionality
  - [ ] Export to Markdown (.md)
  - [ ] Export to JSON (.json)
  - [ ] Export to Cursor commands format
  - [ ] Export to Claude skills format
- [ ] Build CLI bridge (separate package)
  - [ ] `arbor sync` command
  - [ ] Watch mode for auto-sync
  - [ ] Configure target directories

### Phase 8: Polish & Launch

- [ ] Add keyboard shortcuts
- [ ] Implement undo/redo for editor
- [ ] Performance optimization
- [ ] Documentation and onboarding

---

## Current Status

**Project State**: Fresh TanStack Start boilerplate with Shadcn UI components installed.

**Next Steps**:

1. Design and implement database schema (Phase 1)
2. Set up basic app shell and routing (Phase 2)
