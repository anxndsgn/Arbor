import { useCallback, useState, useMemo } from 'react';
import {
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
} from '@xyflow/react';
import type { MindmapNode, MindmapEdge, BlockNodeData, NodeType } from '@/types/editor';

// Initial demo data with tree structure
const initialNodes: MindmapNode[] = [
  {
    id: 'root',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'My Prompt',
      nodeType: 'heading-1',
      isCollapsed: false,
    },
  },
  {
    id: 'node-1',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'Context',
      nodeType: 'heading-2',
      isCollapsed: false,
    },
  },
  {
    id: 'node-2',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'Instructions',
      nodeType: 'heading-2',
      isCollapsed: false,
    },
  },
  {
    id: 'node-3',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'Output Format',
      nodeType: 'heading-2',
      isCollapsed: false,
    },
  },
  {
    id: 'node-1-1',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'You are an expert assistant',
      nodeType: 'paragraph',
      isCollapsed: false,
    },
  },
  {
    id: 'node-2-1',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'Step 1: Analyze the input',
      nodeType: 'list-item',
      isCollapsed: false,
    },
  },
  {
    id: 'node-2-2',
    type: 'textBlock',
    position: { x: 0, y: 0 },
    data: {
      content: 'Step 2: Generate response',
      nodeType: 'list-item',
      isCollapsed: false,
    },
  },
];

// Helper to create edge with proper positions for horizontal tree
function createEdge(source: string, target: string): MindmapEdge {
  return {
    id: `e-${source}-${target}`,
    source,
    target,
    type: 'mindmap',
    sourceHandle: null,
    targetHandle: null,
  };
}

const initialEdges: MindmapEdge[] = [
  createEdge('root', 'node-1'),
  createEdge('root', 'node-2'),
  createEdge('root', 'node-3'),
  createEdge('node-1', 'node-1-1'),
  createEdge('node-2', 'node-2-1'),
  createEdge('node-2', 'node-2-2'),
];

export function useMindmapStore() {
  const [nodes, setNodes] = useState<MindmapNode[]>(initialNodes);
  const [edges, setEdges] = useState<MindmapEdge[]>(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');

  const onNodesChange: OnNodesChange<MindmapNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange: OnEdgesChange<MindmapEdge> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const addNode = useCallback(
    (parentId: string, data: BlockNodeData) => {
      const newId = `node-${Date.now()}`;
      const newNode: MindmapNode = {
        id: newId,
        type: 'textBlock',
        position: { x: 0, y: 0 },
        data,
      };

      const newEdge = createEdge(parentId, newId);

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      setSelectedNodeId(newId);

      return newId;
    },
    []
  );

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<BlockNodeData>) => {
      setNodes((nds) =>
        nds.map((node): MindmapNode =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } } as MindmapNode
            : node
        )
      );
    },
    []
  );

  const deleteNode = useCallback((nodeId: string) => {
    if (nodeId === 'root') return;

    const getDescendants = (id: string, eds: MindmapEdge[]): string[] => {
      const childIds = eds.filter((e) => e.source === id).map((e) => e.target);
      return childIds.flatMap((childId) => [childId, ...getDescendants(childId, eds)]);
    };

    setEdges((eds) => {
      const descendantIds = getDescendants(nodeId, eds);
      const allIdsToDelete = new Set([nodeId, ...descendantIds]);

      setNodes((nds) => nds.filter((node) => !allIdsToDelete.has(node.id)));

      return eds.filter(
        (edge) => !allIdsToDelete.has(edge.source) && !allIdsToDelete.has(edge.target)
      );
    });

    setSelectedNodeId(null);
  }, []);

  const getChildCount = useCallback(
    (nodeId: string) => {
      return edges.filter((e) => e.source === nodeId).length;
    },
    [edges]
  );

  const toggleCollapse = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId && node.type === 'textBlock'
            ? {
                ...node,
                data: {
                  ...(node.data as BlockNodeData),
                  isCollapsed: !(node.data as BlockNodeData).isCollapsed,
                },
              }
            : node
        )
      );
    },
    []
  );

  const setNodeType = useCallback(
    (nodeId: string, nodeType: NodeType) => {
      updateNodeData(nodeId, { nodeType });
    },
    [updateNodeData]
  );

  // Compute visible nodes (hide collapsed subtrees)
  const visibleNodes = useMemo(() => {
    const collapsedIds = new Set(
      nodes
        .filter(
          (n) =>
            n.type === 'textBlock' && (n.data as BlockNodeData).isCollapsed
        )
        .map((n) => n.id)
    );

    if (collapsedIds.size === 0) return nodes;

    const hiddenIds = new Set<string>();

    const hideDescendants = (parentId: string) => {
      const childEdges = edges.filter((e) => e.source === parentId);
      for (const edge of childEdges) {
        hiddenIds.add(edge.target);
        hideDescendants(edge.target);
      }
    };

    for (const collapsedId of collapsedIds) {
      hideDescendants(collapsedId);
    }

    return nodes.filter((n) => !hiddenIds.has(n.id));
  }, [nodes, edges]);

  const visibleEdges = useMemo(() => {
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    return edges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );
  }, [edges, visibleNodes]);

  return {
    nodes,
    edges,
    visibleNodes,
    visibleEdges,
    selectedNodeId,
    setSelectedNodeId,
    onNodesChange,
    onEdgesChange,
    addNode,
    updateNodeData,
    deleteNode,
    getChildCount,
    toggleCollapse,
    setNodeType,
    setNodes,
    setEdges,
  };
}
