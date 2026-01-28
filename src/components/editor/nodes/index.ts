import type { NodeTypes } from '@xyflow/react';
import { TextBlockNode } from './TextBlockNode';
import { ReferenceNode } from './ReferenceNode';

// Cast needed because ReactFlow's NodeTypes expects generic components
// but our components are typed for specific data shapes
export const nodeTypes = {
  textBlock: TextBlockNode,
  reference: ReferenceNode,
} as NodeTypes;

export { TextBlockNode } from './TextBlockNode';
export { ReferenceNode } from './ReferenceNode';
