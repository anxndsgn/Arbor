import type { MindmapNode, MindmapEdge, TreeNode, BlockNodeData } from '@/types/editor';

/**
 * Convert ReactFlow nodes/edges to intermediate tree structure
 */
export function nodesToTree(
  nodes: MindmapNode[],
  edges: MindmapEdge[]
): TreeNode | null {
  if (nodes.length === 0) return null;

  // Find root (node with no incoming edges)
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));
  if (!rootNode) return null;

  function buildTreeNode(nodeId: string): TreeNode | null {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node || node.type !== 'textBlock') return null;

    const data = node.data as BlockNodeData;
    const childEdges = edges.filter((e) => e.source === nodeId);
    const children = childEdges
      .map((e) => buildTreeNode(e.target))
      .filter((n): n is TreeNode => n !== null);

    return {
      id: node.id,
      content: data.content,
      nodeType: data.nodeType,
      children,
      metadata: data.metadata,
    };
  }

  return buildTreeNode(rootNode.id);
}

/**
 * Convert intermediate tree to ReactFlow nodes/edges
 */
export function treeToNodes(tree: TreeNode): {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
} {
  const nodes: MindmapNode[] = [];
  const edges: MindmapEdge[] = [];

  function traverse(treeNode: TreeNode, parentId: string | null): void {
    const node: MindmapNode = {
      id: treeNode.id,
      type: 'textBlock',
      position: { x: 0, y: 0 }, // Will be set by auto-layout
      data: {
        content: treeNode.content,
        nodeType: treeNode.nodeType,
        isCollapsed: false,
        metadata: treeNode.metadata,
      },
    };
    nodes.push(node);

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${treeNode.id}`,
        source: parentId,
        target: treeNode.id,
        type: 'mindmap',
      });
    }

    for (const child of treeNode.children) {
      traverse(child, treeNode.id);
    }
  }

  traverse(tree, null);
  return { nodes, edges };
}

/**
 * Find a node in the tree by ID
 */
export function findTreeNode(
  tree: TreeNode,
  nodeId: string
): TreeNode | null {
  if (tree.id === nodeId) return tree;

  for (const child of tree.children) {
    const found = findTreeNode(child, nodeId);
    if (found) return found;
  }

  return null;
}

/**
 * Get the depth of a node in the tree
 */
export function getNodeDepth(
  tree: TreeNode,
  nodeId: string,
  currentDepth = 0
): number {
  if (tree.id === nodeId) return currentDepth;

  for (const child of tree.children) {
    const depth = getNodeDepth(child, nodeId, currentDepth + 1);
    if (depth !== -1) return depth;
  }

  return -1;
}
