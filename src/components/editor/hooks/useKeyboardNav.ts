import { useCallback, useEffect } from 'react';
import type { MindmapNode, MindmapEdge, BlockNodeData } from '@/types/editor';

interface UseKeyboardNavOptions {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  addNode: (parentId: string, data: BlockNodeData) => string;
  deleteNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<BlockNodeData>) => void;
}

export function useKeyboardNav({
  nodes,
  edges,
  selectedNodeId,
  setSelectedNodeId,
  addNode,
  deleteNode,
}: UseKeyboardNavOptions) {
  const getParentId = useCallback(
    (nodeId: string): string | null => {
      const edge = edges.find((e) => e.target === nodeId);
      return edge?.source ?? null;
    },
    [edges]
  );

  const getChildIds = useCallback(
    (nodeId: string): string[] => {
      return edges.filter((e) => e.source === nodeId).map((e) => e.target);
    },
    [edges]
  );

  const getSiblingIds = useCallback(
    (nodeId: string): string[] => {
      const parentId = getParentId(nodeId);
      if (!parentId) return [];
      return getChildIds(parentId);
    },
    [getParentId, getChildIds]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Only handle when we have a selected node
      if (!selectedNodeId) return;

      // Don't handle if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const selectedNode = nodes.find((n) => n.id === selectedNodeId);
      if (!selectedNode) return;

      switch (event.key) {
        case 'Enter': {
          // Create child node
          event.preventDefault();
          addNode(selectedNodeId, {
            content: '',
            nodeType: 'paragraph',
            isCollapsed: false,
          });
          break;
        }

        case 'Tab': {
          // Create sibling node
          event.preventDefault();
          const parentId = getParentId(selectedNodeId);
          if (parentId) {
            addNode(parentId, {
              content: '',
              nodeType: 'paragraph',
              isCollapsed: false,
            });
          }
          break;
        }

        case 'Backspace':
        case 'Delete': {
          // Delete node if it has no content
          if (
            selectedNode.type === 'textBlock' &&
            !(selectedNode.data as BlockNodeData).content
          ) {
            event.preventDefault();
            const parentId = getParentId(selectedNodeId);
            deleteNode(selectedNodeId);
            if (parentId) {
              setSelectedNodeId(parentId);
            }
          }
          break;
        }

        case 'ArrowUp': {
          event.preventDefault();
          const siblings = getSiblingIds(selectedNodeId);
          const currentIndex = siblings.indexOf(selectedNodeId);
          if (currentIndex > 0) {
            setSelectedNodeId(siblings[currentIndex - 1]);
          }
          break;
        }

        case 'ArrowDown': {
          event.preventDefault();
          const siblings = getSiblingIds(selectedNodeId);
          const currentIndex = siblings.indexOf(selectedNodeId);
          if (currentIndex < siblings.length - 1) {
            setSelectedNodeId(siblings[currentIndex + 1]);
          }
          break;
        }

        case 'ArrowLeft': {
          event.preventDefault();
          const parentId = getParentId(selectedNodeId);
          if (parentId) {
            setSelectedNodeId(parentId);
          }
          break;
        }

        case 'ArrowRight': {
          event.preventDefault();
          const children = getChildIds(selectedNodeId);
          if (children.length > 0) {
            setSelectedNodeId(children[0]);
          }
          break;
        }
      }
    },
    [
      selectedNodeId,
      nodes,
      addNode,
      deleteNode,
      getParentId,
      getChildIds,
      getSiblingIds,
      setSelectedNodeId,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
