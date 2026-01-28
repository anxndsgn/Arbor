import { memo, useState, useCallback, useMemo } from 'react';
import { IconDownload, IconCopy, IconCheck } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { serializeTreeToMarkdown } from '@/lib/markdown';
import { nodesToTree } from '../utils/tree';
import type { MindmapNode, MindmapEdge } from '@/types/editor';

interface ExportMarkdownProps {
  nodes: MindmapNode[];
  edges: MindmapEdge[];
}

export const ExportMarkdown = memo(function ExportMarkdown({
  nodes,
  edges,
}: ExportMarkdownProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    if (!open) return '';
    const tree = nodesToTree(nodes, edges);
    if (!tree) return '# Empty\n';
    return serializeTreeToMarkdown(tree);
  }, [nodes, edges, open]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = markdown;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [markdown]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindmap.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCopied(false);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <IconDownload className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Export as Markdown</DialogTitle>
          <DialogDescription>
            Preview and download your mindmap as a Markdown file.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <pre className="h-64 w-full overflow-auto rounded-md border border-input bg-muted px-3 py-2 text-sm font-mono">
            {markdown}
          </pre>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCopy}>
            {copied ? (
              <>
                <IconCheck className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <IconCopy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
          <Button onClick={handleDownload}>
            <IconDownload className="mr-2 h-4 w-4" />
            Download .md
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
