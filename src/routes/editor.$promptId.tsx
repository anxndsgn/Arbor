import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/editor/$promptId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor/$promptId"!</div>
}
