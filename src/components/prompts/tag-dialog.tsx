'use client'

import { useState } from 'react'
import { IconPlus, IconTrash, IconCheck } from '@tabler/icons-react'
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
import type { Tag } from '@/db/schema'

const PRESET_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#6b7280', // gray
]

interface TagDialogProps {
  tag?: Tag
  onSave: (data: { name: string; color: string }) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  trigger?: React.ReactElement
}

export function TagDialog({ tag, onSave, onDelete, trigger }: TagDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(tag?.name ?? '')
  const [color, setColor] = useState(tag?.color ?? '#6366f1')
  const [isLoading, setIsLoading] = useState(false)

  const isEditing = !!tag

  const handleSave = async () => {
    if (!name.trim()) return
    setIsLoading(true)
    try {
      await onSave({ name: name.trim(), color })
      setOpen(false)
      if (!isEditing) {
        setName('')
        setColor('#6366f1')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!tag || !onDelete) return
    setIsLoading(true)
    try {
      await onDelete(tag.id)
      setOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const defaultTrigger = (
    <Button variant="ghost" size="icon-xs">
      <IconPlus className="size-3" />
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? defaultTrigger} />
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Tag' : 'Create Tag'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the tag name and color.'
              : 'Create a new tag to organize your prompts.'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="tag-name">Name</Label>
            <Input
              id="tag-name"
              placeholder="e.g., Coding, Writing, Marketing"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((presetColor) => (
                <button
                  key={presetColor}
                  type="button"
                  className="size-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110"
                  style={{
                    backgroundColor: presetColor,
                    borderColor:
                      color === presetColor ? 'white' : 'transparent',
                    boxShadow:
                      color === presetColor
                        ? `0 0 0 2px ${presetColor}`
                        : 'none',
                  }}
                  onClick={() => setColor(presetColor)}
                >
                  {color === presetColor && (
                    <IconCheck className="size-4 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-between pt-4">
            {isEditing && onDelete ? (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                <IconTrash className="size-4 mr-2" />
                Delete
              </Button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading || !name.trim()}>
                {isEditing ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
