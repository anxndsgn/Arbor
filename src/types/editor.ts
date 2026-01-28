import type { Node, Edge, BuiltInNode } from '@xyflow/react';

// Node types for Markdown semantics
export type NodeType =
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4'
  | 'list-item'
  | 'paragraph';

// Block node data structure
export interface BlockNodeData extends Record<string, unknown> {
  content: string;
  nodeType: NodeType;
  isCollapsed: boolean;
  metadata?: Record<string, unknown>;
}

// Reference node data structure
export interface ReferenceNodeData extends Record<string, unknown> {
  refType: 'prompt' | 'block';
  refId: string;
  refTitle: string;
}

// Tree node for intermediate representation (used in Phase 2)
export interface TreeNode {
  id: string;
  content: string;
  nodeType: NodeType;
  children: TreeNode[];
  metadata?: Record<string, unknown>;
}

// Custom node types for ReactFlow
export type TextBlockNode = Node<BlockNodeData, 'textBlock'>;
export type ReferenceNode = Node<ReferenceNodeData, 'reference'>;
export type MindmapNode = TextBlockNode | ReferenceNode;

// All node types including built-in
export type AppNode = MindmapNode | BuiltInNode;

// Custom edge type
export type MindmapEdge = Edge;

// Editor state
export interface EditorState {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
  selectedNodeId: string | null;
}

// Layout configuration
export interface LayoutConfig {
  horizontalGap: number;
  verticalGap: number;
  nodeWidth: number;
  nodeHeight: number;
}

export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
  horizontalGap: 50,
  verticalGap: 20,
  nodeWidth: 250,
  nodeHeight: 50,
};
