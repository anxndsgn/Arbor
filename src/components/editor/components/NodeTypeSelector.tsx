import { memo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { NodeType } from '@/types/editor';
import { cn } from '@/lib/utils';

interface NodeTypeSelectorProps {
  currentType: NodeType;
  onSelect: (type: NodeType) => void;
  children: React.ReactNode;
}

const nodeTypeOptions: { type: NodeType; label: string; shortLabel: string; description: string }[] = [
  { type: 'heading-1', label: 'Heading 1', shortLabel: 'H1', description: 'Large title' },
  { type: 'heading-2', label: 'Heading 2', shortLabel: 'H2', description: 'Section header' },
  { type: 'heading-3', label: 'Heading 3', shortLabel: 'H3', description: 'Subsection' },
  { type: 'heading-4', label: 'Heading 4', shortLabel: 'H4', description: 'Minor header' },
  { type: 'list-item', label: 'List Item', shortLabel: '•', description: 'Bullet point' },
  { type: 'paragraph', label: 'Paragraph', shortLabel: '¶', description: 'Plain text' },
];

export const NodeTypeSelector = memo(function NodeTypeSelector({
  currentType,
  onSelect,
  children,
}: NodeTypeSelectorProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        {nodeTypeOptions.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(option.type);
            }}
            className={cn(
              'flex items-center gap-2',
              currentType === option.type && 'bg-accent'
            )}
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-muted text-xs font-medium">
              {option.shortLabel}
            </span>
            <div className="flex flex-col">
              <span className="text-sm">{option.label}</span>
              <span className="text-xs text-muted-foreground">
                {option.description}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
