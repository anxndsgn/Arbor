import { createFileRoute, Link } from '@tanstack/react-router'
import { IconPlus, IconFileText } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  // TODO: Fetch prompts from server
  const prompts: {
    id: string
    title: string
    description: string | null
    updatedAt: Date
    tags: { id: string; name: string; color: string }[]
  }[] = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground">
            Create and manage your prompt library
          </p>
        </div>
        <Button>
          <IconPlus className="mr-2 size-4" />
          New Prompt
        </Button>
      </div>

      {/* Prompt Grid */}
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IconFileText className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No prompts yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first prompt
          </p>
          <Button className="mt-4">
            <IconPlus className="mr-2 size-4" />
            Create Prompt
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Link
              key={prompt.id}
              to="/editor/$promptId"
              params={{ promptId: prompt.id }}
            >
              <Card className="cursor-pointer transition-colors hover:bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-base">
                    {prompt.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {prompt.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {prompt.description}
                    </p>
                  )}
                  {prompt.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {prompt.tags.map((tag) => (
                        <Badge
                          key={tag.id}
                          variant="secondary"
                          style={{ backgroundColor: tag.color + '20' }}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
