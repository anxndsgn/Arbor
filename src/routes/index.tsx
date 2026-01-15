import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  IconPlus,
  IconFileText,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { CreatePromptDialog } from '@/components/prompts'
import { getPrompts, createPrompt, deletePrompt } from '@/server'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconDotsVertical } from '@tabler/icons-react'

export const Route = createFileRoute('/')({
  component: Dashboard,
  loader: async () => {
    // Prefetch prompts
    return { prompts: await getPrompts() }
  },
})

function Dashboard() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch prompts with suspense
  const { data: prompts } = useSuspenseQuery({
    queryKey: ['prompts'],
    queryFn: () => getPrompts(),
  })

  // Create prompt mutation
  const createMutation = useMutation({
    mutationFn: (data: { title: string; description?: string }) =>
      createPrompt({
        data: { title: data.title, description: data.description ?? null },
      }),
    onSuccess: (newPrompt) => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
      // Navigate to editor for the new prompt
      router.navigate({
        to: '/editor/$promptId',
        params: { promptId: newPrompt.id },
      })
    },
  })

  // Delete prompt mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deletePrompt({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] })
    },
  })

  // Filter prompts by search query
  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
        <CreatePromptDialog
          onSave={async (data) => {
            await createMutation.mutateAsync(data)
          }}
        />
      </div>

      {/* Search */}
      {prompts.length > 0 && (
        <div className="relative max-w-md">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/* Prompt Grid */}
      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IconFileText className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No prompts yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get started by creating your first prompt
          </p>
          <CreatePromptDialog
            onSave={async (data) => {
              await createMutation.mutateAsync(data)
            }}
            trigger={
              <Button className="mt-4">
                <IconPlus className="mr-2 size-4" />
                Create Prompt
              </Button>
            }
          />
        </div>
      ) : filteredPrompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IconSearch className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No matches found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try a different search term
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="group relative cursor-pointer transition-colors hover:bg-muted/50"
            >
              <Link
                to="/editor/$promptId"
                params={{ promptId: prompt.id }}
                className="absolute inset-0 z-0"
              />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-1 text-base">
                    {prompt.title}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="relative z-10 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <IconDotsVertical className="size-4" />
                        </Button>
                      }
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteMutation.mutate(prompt.id)
                        }}
                      >
                        <IconTrash className="size-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {prompt.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {prompt.description}
                  </p>
                )}
                {prompt.promptTags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {prompt.promptTags.map((pt) => (
                      <Badge
                        key={pt.tag.id}
                        variant="secondary"
                        style={{
                          backgroundColor: (pt.tag.color ?? '#6366f1') + '20',
                        }}
                      >
                        {pt.tag.name}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
