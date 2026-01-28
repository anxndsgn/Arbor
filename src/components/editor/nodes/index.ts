import type { NodeTypes } from '@xyflow/react';
import { TextBlockNode } from './TextBlockNode';
import { ReferenceNode } from './ReferenceNode';

export const nodeTypes: NodeTypes = {
  textBlock: TextBlockNode,
  reference: ReferenceNode,
};

export { TextBlockNode } from './TextBlockNode';
export { ReferenceNode } from './ReferenceNode';
