import { createFileRoute } from '@tanstack/react-router'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/editor/$promptId')({
  component: PromptEditor,
})

function PromptEditor() {
  const { promptId } = Route.useParams()

  return (
    <div className="flex h-full flex-col">
      {/* Editor Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <Link to="/">
          <Button variant="ghost" size="icon">
            <IconArrowLeft className="size-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Prompt Editor</h1>
          <p className="text-sm text-muted-foreground">ID: {promptId}</p>
        </div>
        <Button>Save</Button>
      </div>

      {/* Editor Canvas Placeholder */}
      <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg mt-4">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Visual Prompt Editor</p>
          <p className="text-sm mt-1">
            @xyflow/react canvas will be integrated here
          </p>
        </div>
      </div>
    </div>
  )
}
