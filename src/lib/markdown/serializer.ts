import type { TreeNode, NodeType } from '@/types/editor';

/**
 * Infer nodeType from tree depth when not explicitly set
 */
function inferNodeType(depth: number): NodeType {
  if (depth === 0) return 'heading-1';
  if (depth === 1) return 'heading-2';
  if (depth === 2) return 'heading-3';
  if (depth === 3) return 'heading-4';
  return 'list-item'; // Deep nodes become list items
}

/**
 * Get the Markdown prefix for a nodeType
 */
function getMarkdownPrefix(nodeType: NodeType): string {
  switch (nodeType) {
    case 'heading-1':
      return '# ';
    case 'heading-2':
      return '## ';
    case 'heading-3':
      return '### ';
    case 'heading-4':
      return '#### ';
    case 'list-item':
      return '- ';
    case 'paragraph':
      return '';
  }
}

/**
 * Serialize a tree node to Markdown lines
 */
function serializeNode(
  node: TreeNode,
  depth: number,
  useExplicitTypes: boolean
): string[] {
  const lines: string[] = [];
  const effectiveType = useExplicitTypes ? node.nodeType : inferNodeType(depth);
  const prefix = getMarkdownPrefix(effectiveType);

  if (effectiveType === 'list-item') {
    // List items need indentation based on list nesting depth
    // Calculate list depth (how deep we are in list-item chain)
    const indent = '  '.repeat(Math.max(0, depth - 4)); // Start indenting after depth 4
    lines.push(`${indent}${prefix}${node.content}`);
  } else if (effectiveType === 'paragraph') {
    // Paragraphs are plain text with blank line before
    if (lines.length > 0) {
      lines.push('');
    }
    lines.push(node.content);
  } else {
    // Headings
    if (lines.length > 0 || depth > 0) {
      lines.push(''); // Blank line before heading (except first)
    }
    lines.push(`${prefix}${node.content}`);
  }

  // Process children
  for (const child of node.children) {
    const childLines = serializeNode(child, depth + 1, useExplicitTypes);
    lines.push(...childLines);
  }

  return lines;
}

/**
 * Options for Markdown serialization
 */
export interface SerializeOptions {
  /**
   * If true, use explicit nodeType from each node.
   * If false, infer type from tree depth.
   * Default: true
   */
  useExplicitTypes?: boolean;
}

/**
 * Serialize TreeNode to Markdown string
 */
export function serializeTreeToMarkdown(
  tree: TreeNode,
  options: SerializeOptions = {}
): string {
  const { useExplicitTypes = true } = options;
  const lines = serializeNode(tree, 0, useExplicitTypes);

  // Clean up: remove leading empty lines, ensure trailing newline
  const result = lines
    .join('\n')
    .replace(/^\n+/, '')
    .replace(/\n{3,}/g, '\n\n'); // Max 2 consecutive newlines

  return result + '\n';
}

/**
 * Serialize tree to Markdown with depth-inferred types
 */
export function serializeTreeToMarkdownInferred(tree: TreeNode): string {
  return serializeTreeToMarkdown(tree, { useExplicitTypes: false });
}
