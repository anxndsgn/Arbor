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

### Markdown and Mindmap Conversion Architecture

Bidirectional conversion between Markdown and Mindmap (similar to [markmap](https://github.com/markmap/markmap) but fully reversible).

```
┌─────────────────────────────────────────────────────────────────┐
│                    Intermediate Tree Model                       │
│  TreeNode { id, content, type, children[], metadata }           │
├─────────────────────────────────────────────────────────────────┤
│        ↑                                    ↑                   │
│   MarkdownParser                      MindmapParser             │
│   (remark/mdast)                      (from xyflow nodes)       │
│        ↓                                    ↓                   │
│   MarkdownSerializer                  MindmapSerializer         │
│   (tree → md string)                  (tree → xyflow nodes)     │
└─────────────────────────────────────────────────────────────────┘
```

#### Node Type System

Each node carries a `nodeType` property to preserve Markdown semantics:

| nodeType    | Markdown Output       | Default Level Rule |
| ----------- | --------------------- | ------------------ |
| `heading-1` | `# Title`             | Level 0 (root)     |
| `heading-2` | `## Section`          | Level 1            |
| `heading-3` | `### Subsection`      | Level 2            |
| `heading-4` | `#### Sub-subsection` | Level 3            |
| `list-item` | `- Item` (nested)     | Level 4+           |
| `paragraph` | Plain text block      | Explicit only      |

#### Conversion Strategies

**Markdown → Mindmap (Import)**

- Parse Markdown using `remark` to get MDAST
- Transform MDAST to Intermediate Tree (preserve heading levels as `nodeType`)
- Convert Intermediate Tree to xyflow nodes with auto-layout

**Mindmap → Markdown (Export)**

- Extract tree structure from xyflow nodes
- If `nodeType` is set → use explicit type
- If `nodeType` is unset → infer from tree depth (Level 0 = H1, Level 1 = H2, etc.)
- Serialize tree to Markdown string

#### Key Design Decisions

1. **Intermediate Tree Model**: Both formats convert through a unified tree structure
2. **Explicit Type > Inferred Type**: User-set `nodeType` takes precedence over depth-based inference
3. **Graceful Degradation**: Deep nodes (Level 4+) default to nested list items
4. **Metadata Preservation**: Store original Markdown attributes (links, emphasis) in `metadata`

### Core Domain Models

1. **Prompt** - A complete prompt document that can be exported
2. **Block** - A reusable piece of prompt content (the "LEGO" building block)
3. **Tag** - Flat organization via tagging

---

## Build Steps

### Phase 1: Visual Prompt Editor (Mind-Map Style) ✅ In Progress

> Mind-map editor with tree structure, auto-layout (Xmind-like), nodes flow from root.

- [ ] Integrate @xyflow/react canvas editor
- [ ] Implement block nodes on canvas
  - [ ] Text block node
  - [ ] Reference block (link to other prompts/blocks)
- [ ] Implement node interaction
  - [ ] Enter to create descendant node
  - [ ] Tab to create sibling node
- [ ] Node type selector (for Markdown semantics)
  - [ ] Heading levels (H1-H4)
  - [ ] List item
  - [ ] Paragraph
- [ ] Collapse/expand subtrees

### Phase 2: Markdown ↔ Mindmap Conversion

> Bidirectional conversion with semantic preservation.

- [ ] Build Intermediate Tree Model
  - [ ] Define `TreeNode` type: `{ id, content, nodeType, children[], metadata }`
  - [ ] Implement tree traversal utilities
- [ ] Markdown → Mindmap (Import)
  - [ ] Integrate `remark` for Markdown parsing (MDAST)
  - [ ] Transform MDAST → Intermediate Tree
  - [ ] Convert Intermediate Tree → xyflow nodes
  - [ ] UI: Import Markdown file/paste
- [ ] Mindmap → Markdown (Export)
  - [ ] Extract tree from xyflow nodes
  - [ ] Apply nodeType (explicit) or infer from depth
  - [ ] Serialize tree → Markdown string
  - [ ] UI: Export to Markdown button
- [ ] Live preview panel (optional)
  - [ ] Show Markdown preview while editing mindmap

### Phase 3: Core UI Shell

- [ ] Create app layout with sidebar navigation
  - [ ] Sidebar with tag-based filtering
  - [ ] Main content area with resizable panels
- [ ] Implement routing structure
  - [ ] `/` - Dashboard/prompt list
  - [ ] `/editor/:promptId` - Visual prompt editor
  - [ ] `/library` - Block library browser

### Phase 4: Database & Persistence

- [ ] Set up database schema with Drizzle
  - [ ] Create `prompts` table (id, title, content, treeData, createdAt, updatedAt)
  - [ ] Create `blocks` table (id, name, content, category, createdAt)
  - [ ] Create `tags` table (id, name, color)
  - [ ] Create junction tables (prompt_blocks, prompt_tags)
- [ ] Set up database connection and migrations
- [ ] Create base server functions for CRUD operations

### Phase 5: Prompt Library & Management

- [ ] Build tag management
  - [ ] Create/rename/delete tags
  - [ ] Color picker for tags
- [ ] Build prompt list view
  - [ ] Search and filter prompts
  - [ ] Filter by tags
  - [ ] Create new prompt
  - [ ] Duplicate/delete prompts
- [ ] Implement prompt preview cards

### Phase 6: Block Library ("Prompt LEGO")

- [ ] Build block library browser
  - [ ] Category-based organization
  - [ ] Search blocks
  - [ ] Preview block content
- [ ] Implement block creation workflow
  - [ ] Create from scratch
  - [ ] Extract from existing prompt

### Phase 7: LLM-Assisted Drafting

- [ ] Integrate OpenAI via TanStack AI
  - [ ] Set up AI server functions
  - [ ] Streaming response handling
- [ ] Build AI drafting panel
  - [ ] Natural language input
  - [ ] Generate prompt suggestions
  - [ ] Refine existing content

### Phase 8: Export & Sync

- [ ] Implement export functionality
  - [ ] Export to Markdown (.md)
  - [ ] Export to JSON (.json)
  - [ ] Export to Cursor commands format
  - [ ] Export to Claude skills format
- [ ] Build CLI bridge (separate package)
  - [ ] `arbor sync` command
  - [ ] Watch mode for auto-sync
  - [ ] Configure target directories

### Phase 9: Polish & Launch

- [ ] Add keyboard shortcuts
- [ ] Implement undo/redo for editor
- [ ] Performance optimization
- [ ] Documentation and onboarding

---

## Current Status

**Project State**: Visual Prompt Editor (Phase 1) in progress with basic mind-map functionality.

**Current Focus**: Complete Phase 1 → Phase 2 (Markdown ↔ Mindmap Conversion)

**Next Steps**:

1. **Phase 1 Remaining**:
   - Add node type selector for Markdown semantics (H1-H4, list, paragraph)
   - Implement collapse/expand for subtrees
2. **Phase 2**:
   - Build Intermediate Tree Model as conversion bridge
   - Implement Markdown import (remark → tree → xyflow)
   - Implement Markdown export (xyflow → tree → Markdown string)
3. Design and implement database schema (Phase 1) - after editor UX is validated
