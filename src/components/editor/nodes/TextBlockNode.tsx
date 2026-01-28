import { memo, useCallback, useRef, useEffect, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { IconChevronRight } from '@tabler/icons-react';
import type { BlockNodeData, NodeType } from '@/types/editor';
import { useEditor } from '../context';
import { NodeTypeSelector } from '../components';
import { cn } from '@/lib/utils';

const nodeTypeStyles: Record<
  NodeType,
  { className: string; prefix?: string; placeholder: string }
> = {
  'heading-1': {
    className: 'text-xl font-bold text-foreground',
    placeholder: 'Heading 1',
  },
  'heading-2': {
    className: 'text-lg font-semibold text-foreground',
    placeholder: 'Heading 2',
  },
  'heading-3': {
    className: 'text-base font-semibold text-foreground',
    placeholder: 'Heading 3',
  },
  'heading-4': {
    className: 'text-sm font-medium text-foreground',
    placeholder: 'Heading 4',
  },
  'list-item': {
    className: 'text-sm text-foreground',
    prefix: '•',
    placeholder: 'List item',
  },
  paragraph: {
    className: 'text-sm text-foreground',
    placeholder: 'Paragraph',
  },
};

const nodeTypeLabels: Record<NodeType, string> = {
  'heading-1': 'H1',
  'heading-2': 'H2',
  'heading-3': 'H3',
  'heading-4': 'H4',
  'list-item': '•',
  paragraph: '¶',
};

export const TextBlockNode = memo(function TextBlockNode({
  id,
  data,
  selected,
}: NodeProps<BlockNodeData>) {
  const { updateNodeData, getChildCount, toggleCollapse, setNodeType } = useEditor();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const childCount = getChildCount(id);
  const style = nodeTypeStyles[data.nodeType];
  const isRoot = id === 'root';

  // Auto-resize textarea
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [data.content, adjustHeight]);

  useEffect(() => {
    if (selected && isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [selected, isEditing]);

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateNodeData(id, { content: e.target.value });
    },
    [id, updateNodeData]
  );

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      setIsEditing(false);
      textareaRef.current?.blur();
    }
    if (e.key === 'Escape') {
      setIsEditing(false);
      textareaRef.current?.blur();
    }
    e.stopPropagation();
  }, []);

  const handleToggleCollapse = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleCollapse(id);
    },
    [id, toggleCollapse]
  );

  const handleNodeTypeChange = useCallback(
    (type: NodeType) => {
      setNodeType(id, type);
    },
    [id, setNodeType]
  );

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-lg border bg-background px-3 py-2 shadow-sm transition-all',
        selected ? 'border-primary shadow-md ring-1 ring-primary/20' : 'border-border',
        data.isCollapsed && childCount > 0 && 'border-dashed'
      )}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Target handle - hidden for root */}
      {!isRoot && (
        <Handle
          type="target"
          position={Position.Left}
          className="-left-[3px]! h-4! w-1.5! rounded-sm! border-0! bg-muted-foreground/40! transition-colors hover:bg-primary!"
        />
      )}

      {/* Node type badge */}
      <NodeTypeSelector currentType={data.nodeType} onSelect={handleNodeTypeChange}>
        <button
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/80 hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          {nodeTypeLabels[data.nodeType]}
        </button>
      </NodeTypeSelector>

      {/* Content area - centered */}
      <div className="flex min-w-[120px] max-w-[280px] flex-1 items-center justify-center gap-1">
        {style.prefix && (
          <span className="text-muted-foreground">{style.prefix}</span>
        )}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={data.content}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder={style.placeholder}
            className={cn(
              'w-full resize-none bg-transparent text-center outline-none',
              style.className,
              'placeholder:text-muted-foreground/50'
            )}
            rows={1}
          />
        ) : (
          <div
            className={cn(
              'min-h-[1.5em] w-full cursor-text text-center',
              style.className,
              !data.content && 'text-muted-foreground/50'
            )}
          >
            {data.content || style.placeholder}
          </div>
        )}
      </div>

      {/* Source handle - hidden when has children (replaced by fold button) */}
      <Handle
        type="source"
        position={Position.Right}
        className={cn(
          '-right-[3px]! h-4! w-1.5! rounded-sm! border-0! bg-muted-foreground/40! transition-colors hover:bg-primary!',
          childCount > 0 && 'opacity-0!'
        )}
      />

      {/* Collapse/expand button - at source handle position */}
      {childCount > 0 && (
        <button
          onClick={handleToggleCollapse}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex h-5 w-5 items-center justify-center rounded-full transition-all',
            data.isCollapsed
              ? 'bg-foreground text-background'
              : 'bg-muted-foreground/40 text-background hover:bg-primary',
            !data.isCollapsed && !isHovered && 'opacity-0',
            (data.isCollapsed || isHovered) && 'opacity-100'
          )}
        >
          {data.isCollapsed ? (
            <span className="text-[10px] font-medium">{childCount}</span>
          ) : (
            <IconChevronRight className="h-3 w-3" />
          )}
        </button>
      )}
    </div>
  );
});
