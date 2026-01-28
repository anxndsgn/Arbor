import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { Root, Content, Heading, List, ListItem, Paragraph } from 'mdast';
import type { TreeNode, NodeType } from '@/types/editor';

/**
 * Parse Markdown string to MDAST
 */
function parseMarkdown(markdown: string): Root {
  const processor = unified().use(remarkParse).use(remarkGfm);
  return processor.parse(markdown);
}

/**
 * Extract plain text content from MDAST node children
 */
function extractText(children: Content[]): string {
  return children
    .map((child) => {
      if (child.type === 'text') return child.value;
      if (child.type === 'inlineCode') return `\`${child.value}\``;
      if (child.type === 'strong' && 'children' in child)
        return `**${extractText(child.children as Content[])}**`;
      if (child.type === 'emphasis' && 'children' in child)
        return `*${extractText(child.children as Content[])}*`;
      if (child.type === 'link' && 'children' in child)
        return extractText(child.children as Content[]);
      return '';
    })
    .join('');
}

/**
 * Map heading depth to nodeType
 */
function headingDepthToNodeType(depth: number): NodeType {
  if (depth === 1) return 'heading-1';
  if (depth === 2) return 'heading-2';
  if (depth === 3) return 'heading-3';
  return 'heading-4'; // Clamp to H4 for depth >= 4
}

let nodeIdCounter = 0;

function generateId(): string {
  return `md-node-${++nodeIdCounter}`;
}

/**
 * Reset ID counter (useful for testing)
 */
export function resetIdCounter(): void {
  nodeIdCounter = 0;
}

/**
 * Convert a list item to TreeNode
 */
function listItemToTreeNode(item: ListItem): TreeNode {
  const children: TreeNode[] = [];
  let content = '';

  for (const child of item.children) {
    if (child.type === 'paragraph') {
      content = extractText(child.children as Content[]);
    } else if (child.type === 'list') {
      // Nested list - convert each item to child TreeNode
      for (const nestedItem of child.children) {
        if (nestedItem.type === 'listItem') {
          children.push(listItemToTreeNode(nestedItem));
        }
      }
    }
  }

  return {
    id: generateId(),
    content,
    nodeType: 'list-item',
    children,
  };
}

/**
 * Convert a list to array of TreeNodes
 */
function listToTreeNodes(list: List): TreeNode[] {
  return list.children
    .filter((item): item is ListItem => item.type === 'listItem')
    .map(listItemToTreeNode);
}

/**
 * Convert MDAST to Intermediate TreeNode structure
 *
 * Strategy:
 * - Headings create section boundaries
 * - Content after a heading belongs to that heading's children
 * - Nested lists maintain hierarchy
 */
export function mdastToTree(mdast: Root): TreeNode {
  const root: TreeNode = {
    id: 'root',
    content: '',
    nodeType: 'heading-1',
    children: [],
  };

  // Track current parent at each heading level
  // Index 0 = root, 1 = H1, 2 = H2, etc.
  const parentStack: TreeNode[] = [root];

  function getCurrentParentForDepth(headingDepth: number): TreeNode {
    // Find the appropriate parent based on heading depth
    // H1 goes under root, H2 goes under most recent H1, etc.
    const targetIndex = Math.min(headingDepth, parentStack.length);
    return parentStack[targetIndex - 1] || root;
  }

  function setParentAtDepth(depth: number, node: TreeNode): void {
    // Truncate stack to this depth and add new node
    parentStack.length = depth;
    parentStack[depth] = node;
  }

  for (const node of mdast.children) {
    if (node.type === 'heading') {
      const heading = node as Heading;
      const treeNode: TreeNode = {
        id: generateId(),
        content: extractText(heading.children as Content[]),
        nodeType: headingDepthToNodeType(heading.depth),
        children: [],
      };

      // First heading becomes the root content
      if (root.content === '' && heading.depth === 1) {
        root.content = treeNode.content;
        root.nodeType = treeNode.nodeType;
        setParentAtDepth(1, root);
      } else {
        const parent = getCurrentParentForDepth(heading.depth);
        parent.children.push(treeNode);
        setParentAtDepth(heading.depth, treeNode);
      }
    } else if (node.type === 'paragraph') {
      const paragraph = node as Paragraph;
      const content = extractText(paragraph.children as Content[]);

      if (content.trim()) {
        const treeNode: TreeNode = {
          id: generateId(),
          content,
          nodeType: 'paragraph',
          children: [],
        };

        // Add to current deepest parent
        const currentParent = parentStack[parentStack.length - 1] || root;
        currentParent.children.push(treeNode);
      }
    } else if (node.type === 'list') {
      const list = node as List;
      const listNodes = listToTreeNodes(list);

      // Add list items to current deepest parent
      const currentParent = parentStack[parentStack.length - 1] || root;
      currentParent.children.push(...listNodes);
    }
  }

  // If root has no content but has children, use first child as root
  if (root.content === '' && root.children.length > 0) {
    const firstChild = root.children[0];
    root.content = firstChild.content;
    root.nodeType = firstChild.nodeType;
    root.children = firstChild.children;
  }

  return root;
}

/**
 * Parse Markdown string to TreeNode
 */
export function parseMarkdownToTree(markdown: string): TreeNode {
  resetIdCounter();
  const mdast = parseMarkdown(markdown);
  return mdastToTree(mdast);
}
