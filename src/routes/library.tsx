import { createFileRoute } from '@tanstack/react-router'
import { IconPlus, IconLayoutGrid, IconSearch } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/library')({
  component: BlockLibrary,
})

const CATEGORIES = [
  { id: 'all', name: 'All Blocks' },
  { id: 'instruction', name: 'Instructions' },
  { id: 'context', name: 'Context' },
  { id: 'example', name: 'Examples' },
  { id: 'constraint', name: 'Constraints' },
]

function BlockLibrary() {
  // TODO: Fetch blocks from server
  const blocks: {
    id: string
    name: string
    content: string
    category: string | null
  }[] = []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Block Library</h1>
          <p className="text-muted-foreground">
            Reusable prompt building blocks
          </p>
        </div>
        <Button>
          <IconPlus className="mr-2 size-4" />
          New Block
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search blocks..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category.id}
              variant={category.id === 'all' ? 'secondary' : 'ghost'}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Block Grid */}
      {blocks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IconLayoutGrid className="size-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No blocks yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Create reusable blocks to build your prompts faster
          </p>
          <Button className="mt-4">
            <IconPlus className="mr-2 size-4" />
            Create Block
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {blocks.map((block) => (
            <Card key={block.id} className="cursor-pointer hover:bg-muted/50">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{block.name}</CardTitle>
                  {block.category && (
                    <Badge variant="outline">{block.category}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground font-mono">
                  {block.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
