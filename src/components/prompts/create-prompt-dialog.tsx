'use client'

import { useState } from 'react'
import { IconPlus } from '@tabler/icons-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface CreatePromptDialogProps {
  onSave: (data: { title: string; description?: string }) => Promise<void>
  trigger?: React.ReactElement
}

export function CreatePromptDialog({
  onSave,
  trigger,
}: CreatePromptDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!title.trim()) return
    setIsLoading(true)
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
      })
      setOpen(false)
      setTitle('')
      setDescription('')
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button>
      <IconPlus className="mr-2 size-4" />
      New Prompt
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? defaultTrigger} />
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
          <DialogDescription>
            Give your prompt a name and optional description.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-title">Title</Label>
            <Input
              id="prompt-title"
              placeholder="e.g., Code Review Assistant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="prompt-description">Description (optional)</Label>
            <Textarea
              id="prompt-description"
              placeholder="A brief description of what this prompt does..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading || !title.trim()}>
              Create Prompt
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
