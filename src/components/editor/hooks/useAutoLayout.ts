import { useCallback } from 'react';
import { Position } from '@xyflow/react';
import { hierarchy, tree } from 'd3-hierarchy';
import type { MindmapNode, MindmapEdge, LayoutConfig } from '@/types/editor';
import { DEFAULT_LAYOUT_CONFIG } from '@/types/editor';

interface TreeData {
  id: string;
  children?: TreeData[];
}

/**
 * Build a tree data structure from nodes and edges
 */
function buildTreeData(
  nodes: MindmapNode[],
  edges: MindmapEdge[],
  rootId: string
): TreeData | null {
  const node = nodes.find((n) => n.id === rootId);
  if (!node) return null;

  const childEdges = edges.filter((e) => e.source === rootId);
  const children = childEdges
    .map((e) => buildTreeData(nodes, edges, e.target))
    .filter((n): n is TreeData => n !== null);

  return {
    id: rootId,
    children: children.length > 0 ? children : undefined,
  };
}

/**
 * Find the root node (node with no incoming edges)
 */
function findRootId(nodes: MindmapNode[], edges: MindmapEdge[]): string | null {
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));
  return rootNode?.id ?? null;
}

export function useAutoLayout(config: LayoutConfig = DEFAULT_LAYOUT_CONFIG) {
  const calculateLayout = useCallback(
    (nodes: MindmapNode[], edges: MindmapEdge[]): MindmapNode[] => {
      if (nodes.length === 0) return nodes;

      // Find root
      const rootId = findRootId(nodes, edges);
      if (!rootId) return nodes;

      // Build tree data structure
      const treeData = buildTreeData(nodes, edges, rootId);
      if (!treeData) return nodes;

      // Create d3 hierarchy
      const root = hierarchy(treeData);

      // Calculate tree size based on number of leaves
      const leaves = root.leaves().length;
      const treeHeight = Math.max(leaves * (config.nodeHeight + config.verticalGap), 300);

      // Get tree depth for width calculation
      const maxDepth = root.height;
      const treeWidth = Math.max(maxDepth * (config.nodeWidth + config.horizontalGap), 400);

      // Create tree layout
      // Note: d3.tree() uses width for vertical spread and height for horizontal
      // We swap them for horizontal tree (left-to-right)
      const treeLayout = tree<TreeData>()
        .size([treeHeight, treeWidth])
        .separation((a, b) => (a.parent === b.parent ? 1 : 1.2));

      // Apply layout
      const layoutRoot = treeLayout(root);

      // Create position map (swap x/y for horizontal layout)
      const positions = new Map<string, { x: number; y: number }>();
      layoutRoot.each((node) => {
        // d3 tree: x is vertical position, y is horizontal (depth)
        // We swap for left-to-right layout
        positions.set(node.data.id, {
          x: node.y, // depth becomes x
          y: node.x, // vertical spread becomes y
        });
      });

      // Apply positions and handle positions to nodes
      return nodes.map((node) => {
        const position = positions.get(node.id);
        if (position) {
          return {
            ...node,
            position,
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          };
        }
        return node;
      });
    },
    [config]
  );

  return { calculateLayout };
}
