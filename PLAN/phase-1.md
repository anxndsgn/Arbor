# Phase 1: Visual Prompt Editor (Mind-Map Style)

## Goal

Build a mind-map style editor using @xyflow/react where users can visually compose prompts as a tree structure with auto-layout, similar to Xmind.

---

## Implementation Steps

### Step 1: Project Structure Setup

Create the editor-related directory structure:

```
src/
├── components/
│   └── editor/
│       ├── MindmapEditor.tsx       # Main editor component with ReactFlow
│       ├── nodes/
│       │   ├── index.ts            # Node type registry
│       │   ├── TextBlockNode.tsx   # Text content node
│       │   └── ReferenceNode.tsx   # Reference to other prompts/blocks
│       ├── edges/
│       │   └── MindmapEdge.tsx     # Custom edge style for mind-map
│       ├── hooks/
│       │   ├── useAutoLayout.ts    # Auto-layout logic (horizontal tree)
│       │   ├── useKeyboardNav.ts   # Keyboard navigation & node creation
│       │   └── useMindmapStore.ts  # Editor state management
│       └── utils/
│           ├── layout.ts           # Layout algorithm utilities
│           └── tree.ts             # Tree manipulation helpers
├── types/
│   └── editor.ts                   # Editor type definitions
└── routes/
    └── editor/
        └── $promptId.tsx           # Editor route
```

### Step 2: Type Definitions

Define core types in `src/types/editor.ts`:

```typescript
// Node types for Markdown semantics
type NodeType =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'list-item'
  | 'paragraph';

// Block node data structure
interface BlockNodeData {
  content: string;
  nodeType: NodeType;
  isCollapsed: boolean;
  metadata?: Record<string, unknown>;
}

// Reference node data structure
interface ReferenceNodeData {
  refType: 'prompt' | 'block';
  refId: string;
  refTitle: string;
}

// Tree node for intermediate representation
interface TreeNode {
  id: string;
  content: string;
  nodeType: NodeType;
  children: TreeNode[];
  metadata?: Record<string, unknown>;
}
```

### Step 3: Basic ReactFlow Integration

**File: `src/components/editor/MindmapEditor.tsx`**

- Initialize ReactFlow with custom node types
- Set up provider with custom controls
- Configure viewport and interaction settings
- Implement basic zoom/pan controls

**Key configurations:**
- `nodeTypes`: Register TextBlockNode and ReferenceNode
- `edgeTypes`: Register MindmapEdge
- `fitView`: Auto-fit on initial load
- `minZoom/maxZoom`: Set appropriate limits (0.1 - 2)
- `proOptions`: Hide attribution (if licensed)

### Step 4: Text Block Node

**File: `src/components/editor/nodes/TextBlockNode.tsx`**

Features:
- [ ] Editable text content with auto-resize textarea
- [ ] Visual indicator for node type (H1-H4, list, paragraph)
- [ ] Selected state styling
- [ ] Collapse/expand toggle button (show when has children)
- [ ] Source handle (right side) for outgoing edges
- [ ] Target handle (left side) for incoming edges

Styling based on nodeType:
- `heading-1`: Larger font, bold, primary color
- `heading-2`: Medium font, bold
- `heading-3`: Normal font, semibold
- `heading-4`: Normal font, medium weight
- `list-item`: Bullet prefix, normal font
- `paragraph`: Normal text

### Step 5: Reference Node

**File: `src/components/editor/nodes/ReferenceNode.tsx`**

Features:
- [ ] Display reference title with link icon
- [ ] Visual distinction (different background color)
- [ ] Click to navigate to referenced prompt/block
- [ ] Tooltip showing preview of referenced content

### Step 6: Custom Edge

**File: `src/components/editor/edges/MindmapEdge.tsx`**

Features:
- [ ] Bezier curve connecting parent to child
- [ ] Styled with subtle color
- [ ] Animated dash pattern for selected edges (optional)
- [ ] Smooth path calculation for horizontal tree layout

### Step 7: Auto-Layout Algorithm

**File: `src/components/editor/hooks/useAutoLayout.ts`**

Implement horizontal tree layout (left-to-right, like Xmind):

```
         ┌── Child 1.1
    ┌── Child 1 ─┤
    │            └── Child 1.2
Root ─┼── Child 2
    │
    └── Child 3 ─── Child 3.1
```

Algorithm:
1. Build tree structure from nodes/edges
2. Calculate subtree heights recursively
3. Position nodes with consistent horizontal spacing
4. Center parent relative to children vertically
5. Handle collapsed nodes (treat as leaf)

Parameters:
- `horizontalGap`: 180px (spacing between levels)
- `verticalGap`: 60px (spacing between siblings)
- `nodeWidth`: 200px (estimated node width)

### Step 8: Keyboard Navigation

**File: `src/components/editor/hooks/useKeyboardNav.ts`**

Implement keyboard shortcuts:

| Key | Action |
|-----|--------|
| `Enter` | Create child node (descendant) |
| `Tab` | Create sibling node (below current) |
| `Shift+Tab` | Create sibling node (above current) |
| `Backspace` | Delete node (if empty) |
| `Arrow Up/Down` | Navigate between siblings |
| `Arrow Left` | Navigate to parent |
| `Arrow Right` | Navigate to first child |
| `Space` | Toggle collapse/expand |

Implementation notes:
- Use `useKeyDown` hook or native event listeners
- Prevent default browser behavior
- Focus management for selected node
- Create node at correct position in tree

### Step 9: Node Type Selector

**Component: Dropdown or popover for selecting node type**

Trigger:
- Right-click context menu
- Keyboard shortcut (e.g., `Cmd+Shift+T`)
- Button in node toolbar

Options:
- Heading 1 (H1)
- Heading 2 (H2)
- Heading 3 (H3)
- Heading 4 (H4)
- List Item
- Paragraph

Visual: Show icon + label for each option

### Step 10: Collapse/Expand Subtrees

Features:
- [ ] Toggle button on nodes with children
- [ ] Collapsed nodes show child count badge
- [ ] Keyboard shortcut: `Space` to toggle
- [ ] Animate expansion/collapse (optional)
- [ ] Persist collapse state in node data

Implementation:
- `isCollapsed` flag in node data
- Filter visible nodes based on collapse state
- Recalculate layout when toggling

### Step 11: Editor Route Setup

**File: `src/routes/editor/$promptId.tsx`**

- Route parameter for prompt ID
- Load prompt data (mock for now)
- Render MindmapEditor component
- Handle save/autosave (to be implemented in Phase 4)

---

## Acceptance Criteria

- [ ] Canvas displays nodes in horizontal tree layout
- [ ] Users can add text content to nodes
- [ ] `Enter` creates a child node
- [ ] `Tab` creates a sibling node
- [ ] Arrow keys navigate between nodes
- [ ] Node type can be changed via selector
- [ ] Subtrees can be collapsed/expanded
- [ ] Layout automatically adjusts when nodes change
- [ ] Editor is accessible at `/editor/:promptId` route

---

## Dependencies

Already installed:
- `@xyflow/react`: ^12.10.0
- React 19, TypeScript, Tailwind CSS

---

## Notes

- Start with local state (useState/useReducer), migrate to proper store later
- Use React 19 features where appropriate
- Follow Shadcn UI patterns for component styling
- Test with 20+ nodes to verify layout performance
