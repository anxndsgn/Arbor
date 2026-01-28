# Phase 1: Visual Prompt Editor (Mind-Map Style)

## Goal

Build a mind-map style editor using @xyflow/react where users can visually compose prompts as a tree structure with auto-layout, similar to Xmind.

---

## Implementation Steps

### Step 1: Project Structure Setup ✅

Created the editor-related directory structure:

```
src/
├── components/
│   └── editor/
│       ├── index.ts                # Main exports
│       ├── MindmapEditor.tsx       # Main editor component with ReactFlow
│       ├── components/
│       │   ├── index.ts            # Component exports
│       │   └── NodeTypeSelector.tsx # Dropdown for node type selection
│       ├── context/
│       │   ├── index.ts            # Context exports
│       │   └── EditorContext.tsx   # Editor context provider
│       ├── nodes/
│       │   ├── index.ts            # Node type registry
│       │   ├── TextBlockNode.tsx   # Text content node
│       │   └── ReferenceNode.tsx   # Reference to other prompts/blocks
│       ├── edges/
│       │   ├── index.ts            # Edge type registry
│       │   └── MindmapEdge.tsx     # Custom edge style for mind-map
│       ├── hooks/
│       │   ├── index.ts            # Hook exports
│       │   ├── useAutoLayout.ts    # Auto-layout logic (horizontal tree)
│       │   ├── useKeyboardNav.ts   # Keyboard navigation & node creation
│       │   └── useMindmapStore.ts  # Editor state management
│       └── utils/
│           ├── index.ts            # Utility exports
│           ├── layout.ts           # Layout algorithm utilities
│           └── tree.ts             # Tree manipulation helpers
├── types/
│   └── editor.ts                   # Editor type definitions
└── routes/
    └── editor/
        └── $promptId.tsx           # Editor route
```

### Step 2: Type Definitions ✅

Defined core types in `src/types/editor.ts`:

- `NodeType`: Union of heading-1 through heading-4, list-item, paragraph
- `BlockNodeData`: Content, nodeType, isCollapsed, metadata
- `ReferenceNodeData`: refType, refId, refTitle
- `TreeNode`: Intermediate tree representation for conversions
- `LayoutConfig`: horizontalGap, verticalGap, nodeWidth, nodeHeight

### Step 3: Basic ReactFlow Integration ✅

**File: `src/components/editor/MindmapEditor.tsx`**

- [x] Initialize ReactFlow with custom node types
- [x] Set up EditorProvider for context
- [x] Configure viewport and interaction settings
- [x] Implement zoom/pan controls, minimap, background

### Step 4: Text Block Node ✅

**File: `src/components/editor/nodes/TextBlockNode.tsx`**

- [x] Editable text content with auto-resize textarea
- [x] Visual indicator for node type (H1-H4, list, paragraph)
- [x] Selected state styling with ring
- [x] Collapse/expand toggle button (shows when has children)
- [x] Source/target handles for edges
- [x] Double-click to edit, Enter/Escape to exit editing

### Step 5: Reference Node ✅

**File: `src/components/editor/nodes/ReferenceNode.tsx`**

- [x] Display reference title with link icon
- [x] Visual distinction (muted background)
- [x] Handles for connections

### Step 6: Custom Edge ✅

**File: `src/components/editor/edges/MindmapEdge.tsx`**

- [x] Bezier curve connecting parent to child
- [x] Styled with subtle muted color

### Step 7: Auto-Layout Algorithm ✅

**File: `src/components/editor/hooks/useAutoLayout.ts`**

- [x] Horizontal tree layout (left-to-right)
- [x] Recursive subtree height calculation
- [x] Parent centered relative to children
- [x] Configurable gaps (180px horizontal, 60px vertical)

### Step 8: Keyboard Navigation ✅

**File: `src/components/editor/hooks/useKeyboardNav.ts`**

| Key | Action | Status |
|-----|--------|--------|
| `Enter` | Create child node | ✅ |
| `Tab` | Create sibling node | ✅ |
| `Backspace` | Delete empty node | ✅ |
| `Arrow Up/Down` | Navigate siblings | ✅ |
| `Arrow Left` | Navigate to parent | ✅ |
| `Arrow Right` | Navigate to first child | ✅ |

### Step 9: Node Type Selector ✅

**File: `src/components/editor/components/NodeTypeSelector.tsx`**

- [x] Dropdown menu on type badge click
- [x] Shows all 6 node types with labels
- [x] Current type highlighted

### Step 10: Collapse/Expand Subtrees ✅

**File: `src/components/editor/hooks/useMindmapStore.ts`**

- [x] Toggle button on nodes with children
- [x] Collapsed nodes show child count badge
- [x] `visibleNodes`/`visibleEdges` computed from collapse state
- [x] Layout recalculates on toggle

### Step 11: Editor Route Setup ✅

**File: `src/routes/editor/$promptId.tsx`**

- [x] Route at `/editor/:promptId`
- [x] Header showing prompt ID
- [x] Full-height MindmapEditor

---

## Acceptance Criteria

- [x] Canvas displays nodes in horizontal tree layout
- [x] Users can add text content to nodes (double-click to edit)
- [x] `Enter` creates a child node
- [x] `Tab` creates a sibling node
- [x] Arrow keys navigate between nodes
- [x] Node type can be changed via selector
- [x] Subtrees can be collapsed/expanded
- [x] Layout automatically adjusts when nodes change
- [x] Editor is accessible at `/editor/:promptId` route

---

## Remaining Enhancements (Optional)

- [ ] Shift+Tab to create sibling above
- [ ] Space to toggle collapse (keyboard shortcut)
- [ ] Animated transitions for layout changes
- [ ] Undo/redo support
- [ ] Context menu with more options

---

## Dependencies

Already installed:
- `@xyflow/react`: ^12.10.0
- React 19, TypeScript, Tailwind CSS

---

## Notes

- Using local state (useState) for now, can migrate to Zustand later
- EditorContext provides callbacks to nodes without prop drilling
- Build verified working with `pnpm build`
