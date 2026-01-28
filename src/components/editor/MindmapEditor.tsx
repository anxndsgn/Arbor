import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  type OnSelectionChangeFunc,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { IconFocusCentered, IconCopy, IconCheck } from '@tabler/icons-react';

import { nodeTypes } from './nodes';
import { edgeTypes } from './edges';
import { useMindmapStore, useAutoLayout, useKeyboardNav } from './hooks';
import { EditorProvider } from './context';
import { ImportMarkdown, ExportMarkdown } from './components';
import { nodesToTree } from './utils/tree';
import { serializeTreeToMarkdown } from '@/lib/markdown';
import { Button } from '@/components/ui/button';
import type { MindmapNode, MindmapEdge } from '@/types/editor';

function MindmapEditorInner() {
  const {
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
  } = useMindmapStore();

  const { calculateLayout } = useAutoLayout();
  const { fitView } = useReactFlow();
  const hasInitialFit = useRef(false);

  // Compute positioned nodes for display
  const positionedNodes = useMemo(() => {
    if (visibleNodes.length === 0) return [];
    return calculateLayout(visibleNodes, visibleEdges);
  }, [visibleNodes, visibleEdges, calculateLayout]);

  // Fit view only on initial mount
  useEffect(() => {
    if (!hasInitialFit.current && positionedNodes.length > 0) {
      hasInitialFit.current = true;
      const timeoutId = setTimeout(() => {
        fitView({ padding: 0.2 });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [positionedNodes.length, fitView]);

  // Set up keyboard navigation
  useKeyboardNav({
    nodes,
    edges,
    selectedNodeId,
    setSelectedNodeId,
    addNode,
    deleteNode,
    updateNodeData,
  });

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    ({ nodes: selectedNodes }) => {
      if (selectedNodes.length > 0) {
        setSelectedNodeId(selectedNodes[0].id);
      }
    },
    [setSelectedNodeId]
  );

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.2, duration: 200 });
  }, [fitView]);

  const handleImport = useCallback(
    (importedNodes: MindmapNode[], importedEdges: MindmapEdge[]) => {
      setNodes(importedNodes);
      setEdges(importedEdges);
      setSelectedNodeId(importedNodes[0]?.id ?? null);
      // Reset fit view flag so it will fit to the new content
      hasInitialFit.current = false;
    },
    [setNodes, setEdges, setSelectedNodeId]
  );

  // Copy as Markdown
  const [copied, setCopied] = useState(false);
  const handleCopyMarkdown = useCallback(async () => {
    const tree = nodesToTree(nodes, edges);
    if (!tree) return;
    const markdown = serializeTreeToMarkdown(tree);
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [nodes, edges]);

  // Editor context value
  const editorContextValue = useMemo(
    () => ({
      updateNodeData,
      deleteNode,
      addNode,
      getChildCount,
      toggleCollapse,
      setNodeType,
    }),
    [updateNodeData, deleteNode, addNode, getChildCount, toggleCollapse, setNodeType]
  );

  return (
    <EditorProvider value={editorContextValue}>
      <div className="h-full w-full">
        <ReactFlow<MindmapNode, MindmapEdge>
          nodes={positionedNodes}
          edges={visibleEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{ type: 'mindmap' }}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
          selectNodesOnDrag={false}
          panOnScroll
          zoomOnScroll
          className="bg-background"
          proOptions={{ hideAttribution: true }}
        >
          <Background gap={20} size={1} />
          <Controls showInteractive={false} />
          <MiniMap
            nodeColor="hsl(var(--primary))"
            maskColor="hsl(var(--background) / 0.8)"
            pannable
            zoomable
          />
          <Panel position="top-right" className="flex gap-2">
            <ImportMarkdown onImport={handleImport} />
            <ExportMarkdown nodes={nodes} edges={edges} />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopyMarkdown}
              title={copied ? 'Copied!' : 'Copy as Markdown'}
            >
              {copied ? (
                <IconCheck className="h-4 w-4 text-green-500" />
              ) : (
                <IconCopy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleFitView}
              title="Fit to view"
            >
              <IconFocusCentered className="h-4 w-4" />
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </EditorProvider>
  );
}

export function MindmapEditor() {
  return (
    <ReactFlowProvider>
      <MindmapEditorInner />
    </ReactFlowProvider>
  );
}
