# Phase 2: Markdown ↔ Mindmap Conversion

## Goal

Build bidirectional conversion between Markdown and Mindmap with semantic preservation. Users can import Markdown to populate the mindmap and export the mindmap back to well-formatted Markdown.

---

## Implementation Steps

### Step 1: Tree Utilities Setup

**Files:**
- `src/components/editor/utils/tree.ts` (enhance existing)

**Tasks:**
- [ ] Implement `flattenTree(root: TreeNode): TreeNode[]` - BFS/DFS traversal
- [ ] Implement `buildTreeFromNodes(nodes: MindmapNode[], edges: MindmapEdge[]): TreeNode`
- [ ] Implement `treeToNodesAndEdges(tree: TreeNode): { nodes: MindmapNode[], edges: MindmapEdge[] }`
- [ ] Add tree depth calculation utility

### Step 2: Markdown Parser (Markdown → Tree)

**Files:**
- `src/lib/markdown/parser.ts`

**Dependencies:**
- `remark` - Markdown parser
- `remark-gfm` - GitHub Flavored Markdown support
- `unified` - Text processing framework

**Tasks:**
- [ ] Install remark dependencies: `pnpm add remark remark-gfm unified`
- [ ] Parse Markdown string to MDAST (Markdown Abstract Syntax Tree)
- [ ] Transform MDAST to Intermediate Tree:
  - Headings → `heading-1` through `heading-4` based on depth
  - List items → `list-item`
  - Paragraphs → `paragraph`
- [ ] Handle nested lists (preserve hierarchy)
- [ ] Preserve inline formatting in metadata (bold, italic, links, code)

**MDAST → TreeNode Mapping:**

| MDAST Type | TreeNode nodeType | Notes |
|------------|-------------------|-------|
| `heading` depth=1 | `heading-1` | Root-level section |
| `heading` depth=2 | `heading-2` | Sub-section |
| `heading` depth=3 | `heading-3` | Sub-sub-section |
| `heading` depth=4+ | `heading-4` | Clamped to H4 |
| `listItem` | `list-item` | Preserve nesting |
| `paragraph` | `paragraph` | Text content |

### Step 3: Markdown Serializer (Tree → Markdown)

**Files:**
- `src/lib/markdown/serializer.ts`

**Tasks:**
- [ ] Traverse tree in depth-first order
- [ ] Apply nodeType-based formatting:
  - `heading-1` → `# content`
  - `heading-2` → `## content`
  - `heading-3` → `### content`
  - `heading-4` → `#### content`
  - `list-item` → `- content` (with indentation for nesting)
  - `paragraph` → plain text with blank line separator
- [ ] Handle depth-based inference (when nodeType is unset)
- [ ] Restore inline formatting from metadata
- [ ] Ensure proper blank lines between sections

**Inference Rules (when nodeType is unset):**

| Tree Depth | Default nodeType |
|------------|------------------|
| 0 (root) | `heading-1` |
| 1 | `heading-2` |
| 2 | `heading-3` |
| 3 | `heading-4` |
| 4+ | `list-item` |

### Step 4: Mindmap ↔ Tree Conversion

**Files:**
- `src/lib/markdown/mindmapConverter.ts`

**Tasks:**
- [ ] `mindmapToTree(nodes: MindmapNode[], edges: MindmapEdge[]): TreeNode`
  - Find root node (no incoming edges)
  - Recursively build tree from edges
  - Extract content and nodeType from node data
- [ ] `treeToMindmap(tree: TreeNode): { nodes: MindmapNode[], edges: MindmapEdge[] }`
  - Generate unique IDs for each tree node
  - Create MindmapNode with BlockNodeData for each
  - Create edges based on parent-child relationships
  - Position will be calculated by auto-layout hook

### Step 5: Import UI

**Files:**
- `src/components/editor/components/ImportMarkdown.tsx`
- `src/components/editor/MindmapEditor.tsx` (update)

**Tasks:**
- [ ] Create ImportMarkdown component with:
  - Paste textarea for Markdown input
  - File upload button (.md files)
  - Import button to trigger conversion
- [ ] Add import button to editor panel
- [ ] Hook up to mindmap store (replace/merge nodes)
- [ ] Handle import errors gracefully

### Step 6: Export UI

**Files:**
- `src/components/editor/components/ExportMarkdown.tsx`
- `src/components/editor/MindmapEditor.tsx` (update)

**Tasks:**
- [ ] Create ExportMarkdown component with:
  - Preview panel showing Markdown output
  - Copy to clipboard button
  - Download as .md file button
- [ ] Add export button to editor panel
- [ ] Generate Markdown on-the-fly from current mindmap state

### Step 7: Live Preview Panel (Optional)

**Files:**
- `src/components/editor/components/MarkdownPreview.tsx`
- `src/components/editor/MindmapEditor.tsx` (update)

**Tasks:**
- [ ] Create resizable side panel
- [ ] Show real-time Markdown preview as user edits mindmap
- [ ] Debounce updates for performance
- [ ] Syntax highlighting for Markdown (optional)

---

## Acceptance Criteria

- [ ] Import valid Markdown creates correct mindmap structure
- [ ] Export mindmap produces valid, readable Markdown
- [ ] Round-trip (import → export) preserves structure and content
- [ ] Heading levels are correctly mapped (H1-H4)
- [ ] Nested lists maintain hierarchy
- [ ] Import handles edge cases (empty file, only headings, only lists)
- [ ] Export produces clean Markdown with proper spacing

---

## Test Cases

### Import Tests

1. **Simple headings**: `# H1\n## H2\n### H3` → 3 nodes in hierarchy
2. **Nested lists**: `- Item\n  - Child` → 2 nodes, parent-child edge
3. **Mixed content**: Headings + lists + paragraphs
4. **Deep nesting**: 6+ levels should clamp to list-items

### Export Tests

1. **Root only**: Single H1 node → `# content`
2. **Tree with types**: Nodes with explicit nodeTypes
3. **Tree without types**: Infer types from depth
4. **List items**: Proper indentation for nesting

### Round-trip Tests

1. Import sample.md → Export → Compare with original structure
2. Create mindmap manually → Export → Import → Verify identical tree

---

## Dependencies

**To Install:**
```bash
pnpm add remark remark-gfm unified
```

**Already Installed:**
- @xyflow/react
- React 19, TypeScript

---

## Notes

- Keep parser/serializer pure functions for testability
- Intermediate TreeNode model is the "source of truth" for conversions
- Explicit nodeType always takes precedence over depth inference
- Consider caching parsed tree for large documents
