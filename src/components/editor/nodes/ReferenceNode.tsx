import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { IconLink } from '@tabler/icons-react';
import type { ReferenceNodeData, ReferenceNode as ReferenceNodeType } from '@/types/editor';

export const ReferenceNode = memo(function ReferenceNode({
  data,
  selected,
}: NodeProps<ReferenceNodeType>) {
  const nodeData = data as ReferenceNodeData;
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 shadow-sm transition-shadow ${
        selected ? 'border-primary shadow-md' : 'border-border'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-3 !w-1 !rounded-sm !border-0 !bg-muted-foreground/50"
      />
      <IconLink className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">{nodeData.refTitle}</span>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-1 !rounded-sm !border-0 !bg-muted-foreground/50"
      />
    </div>
  );
});
