import { memo, useState, useCallback, useRef } from 'react';
import { IconUpload, IconFileText } from '@tabler/icons-react';
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
import { parseMarkdownToTree } from '@/lib/markdown';
import { treeToNodes } from '../utils/tree';
import type { MindmapNode, MindmapEdge } from '@/types/editor';

interface ImportMarkdownProps {
  onImport: (nodes: MindmapNode[], edges: MindmapEdge[]) => void;
}

export const ImportMarkdown = memo(function ImportMarkdown({
  onImport,
}: ImportMarkdownProps) {
  const [open, setOpen] = useState(false);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
      setError(null);
    },
    []
  );

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdown(content);
        setError(null);
      };
      reader.onerror = () => {
        setError('Failed to read file');
      };
      reader.readAsText(file);
    },
    []
  );

  const handleImport = useCallback(() => {
    if (!markdown.trim()) {
      setError('Please enter some Markdown content');
      return;
    }

    try {
      const tree = parseMarkdownToTree(markdown);
      const { nodes, edges } = treeToNodes(tree);
      onImport(nodes, edges);
      setOpen(false);
      setMarkdown('');
      setError(null);
    } catch (err) {
      setError(
        `Failed to parse Markdown: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    }
  }, [markdown, onImport]);

  const handleOpenChange = useCallback((isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setMarkdown('');
      setError(null);
    }
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <IconUpload className="mr-2 h-4 w-4" />
          Import
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Markdown</DialogTitle>
          <DialogDescription>
            Paste Markdown content or upload a .md file to import as a mindmap.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconFileText className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
          <textarea
            value={markdown}
            onChange={handleTextChange}
            placeholder="# My Document&#10;&#10;## Section 1&#10;&#10;- Item 1&#10;- Item 2&#10;&#10;## Section 2&#10;&#10;Some paragraph text..."
            className="h-64 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});
