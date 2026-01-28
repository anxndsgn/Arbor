import { createFileRoute } from '@tanstack/react-router';
import { MindmapEditor } from '@/components/editor';

export const Route = createFileRoute('/editor/$promptId')({
  component: EditorPage,
});

function EditorPage() {
  const { promptId } = Route.useParams();

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center border-b border-border px-4">
        <h1 className="text-sm font-medium text-foreground">
          Editing: {promptId}
        </h1>
      </header>
      <main className="flex-1">
        <MindmapEditor />
      </main>
    </div>
  );
}
