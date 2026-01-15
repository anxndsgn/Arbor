import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { tags, promptTags, type NewTag } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

// ============================================================================
// GET ALL TAGS
// ============================================================================

export const getTags = createServerFn({ method: 'GET' }).handler(async () => {
  return db.query.tags.findMany({
    orderBy: (tags, { asc }) => [asc(tags.name)],
  })
})

// ============================================================================
// CREATE TAG
// ============================================================================

export const createTag = createServerFn({ method: 'POST' })
  .inputValidator((data: NewTag) => data)
  .handler(async ({ data }) => {
    const [tag] = await db.insert(tags).values(data).returning()
    return tag
  })

// ============================================================================
// UPDATE TAG
// ============================================================================

export const updateTag = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string } & Partial<NewTag>) => data)
  .handler(async ({ data: { id, ...updates } }) => {
    const [tag] = await db
      .update(tags)
      .set(updates)
      .where(eq(tags.id, id))
      .returning()
    return tag
  })

// ============================================================================
// DELETE TAG
// ============================================================================

export const deleteTag = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(tags).where(eq(tags.id, id))
    return { success: true }
  })

// ============================================================================
// ADD TAG TO PROMPT
// ============================================================================

export const addTagToPrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: { promptId: string; tagId: string }) => data)
  .handler(async ({ data }) => {
    const [relation] = await db.insert(promptTags).values(data).returning()
    return relation
  })

// ============================================================================
// REMOVE TAG FROM PROMPT
// ============================================================================

export const removeTagFromPrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: { promptId: string; tagId: string }) => data)
  .handler(async ({ data: { promptId, tagId } }) => {
    await db
      .delete(promptTags)
      .where(
        and(eq(promptTags.promptId, promptId), eq(promptTags.tagId, tagId)),
      )
    return { success: true }
  })
