import { createContext, useContext } from 'react';
import type { BlockNodeData, NodeType } from '@/types/editor';

interface EditorContextValue {
  updateNodeData: (nodeId: string, data: Partial<BlockNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addNode: (parentId: string, data: BlockNodeData) => string;
  getChildCount: (nodeId: string) => number;
  toggleCollapse: (nodeId: string) => void;
  setNodeType: (nodeId: string, nodeType: NodeType) => void;
}

const EditorContext = createContext<EditorContextValue | null>(null);

export function EditorProvider({
  children,
  value,
}: {
  children: React.ReactNode;
  value: EditorContextValue;
}) {
  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditor() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}
