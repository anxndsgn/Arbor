import {
  Link,
  Outlet,
  useRouterState,
  useNavigate,
} from '@tanstack/react-router'
import {
  useSuspenseQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import {
  IconFileText,
  IconLayoutGrid,
  IconTag,
  IconPencil,
} from '@tabler/icons-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TagDialog } from '@/components/prompts'
import { getTags, createTag, updateTag, deleteTag } from '@/server'

const navItems = [
  {
    title: 'Prompts',
    href: '/',
    icon: IconFileText,
  },
  {
    title: 'Block Library',
    href: '/library',
    icon: IconLayoutGrid,
  },
]

export function AppLayout() {
  const router = useRouterState()
  const navigate = useNavigate()
  const currentPath = router.location.pathname
  const queryClient = useQueryClient()

  // Get current tag filter from URL search params
  const searchParams = new URLSearchParams(router.location.search)
  const selectedTagId = searchParams.get('tag')

  // Fetch tags
  const { data: tags } = useSuspenseQuery({
    queryKey: ['tags'],
    queryFn: () => getTags(),
  })

  // Create tag mutation
  const createTagMutation = useMutation({
    mutationFn: (data: { name: string; color: string }) => createTag({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  // Update tag mutation
  const updateTagMutation = useMutation({
    mutationFn: ({
      id,
      ...data
    }: {
      id: string
      name: string
      color: string
    }) => updateTag({ data: { id, name: data.name, color: data.color } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  // Delete tag mutation
  const deleteTagMutation = useMutation({
    mutationFn: (id: string) => deleteTag({ data: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      // Clear the tag filter if the deleted tag was selected
      if (selectedTagId) {
        navigate({ to: '/' })
      }
    },
  })

  const handleTagClick = (tagId: string | null) => {
    if (tagId === null || tagId === selectedTagId) {
      // Clear filter
      navigate({ to: '/' })
    } else {
      // Set filter
      navigate({ to: '/', search: { tag: tagId } })
    }
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              A
            </div>
            <span className="font-semibold text-lg">Arbor</span>
          </div>
        </SidebarHeader>

        <SidebarContent>
          {/* Main Navigation */}
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      render={<Link to={item.href} />}
                      isActive={currentPath === item.href}
                    >
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Tags Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="flex items-center justify-between">
              <span>Tags</span>
              <TagDialog
                onSave={async (data) => {
                  await createTagMutation.mutateAsync(data)
                }}
              />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={!selectedTagId && currentPath === '/'}
                    onClick={() => handleTagClick(null)}
                  >
                    <IconTag className="size-4" />
                    <span>All Prompts</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {tags.map((tag) => (
                  <SidebarMenuItem key={tag.id} className="group/tag">
                    <SidebarMenuButton
                      isActive={selectedTagId === tag.id}
                      onClick={() => handleTagClick(tag.id)}
                    >
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: tag.color ?? '#6366f1' }}
                      />
                      <span className="flex-1">{tag.name}</span>
                      <TagDialog
                        tag={tag}
                        onSave={async (data) => {
                          await updateTagMutation.mutateAsync({
                            id: tag.id,
                            ...data,
                          })
                        }}
                        onDelete={async (id) => {
                          await deleteTagMutation.mutateAsync(id)
                        }}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="opacity-0 group-hover/tag:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <IconPencil className="size-3" />
                          </Button>
                        }
                      />
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-sidebar-border">
          <div className="p-2 text-xs text-muted-foreground">Arbor v0.1.0</div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
