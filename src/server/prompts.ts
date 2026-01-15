import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { prompts, type NewPrompt } from '@/db/schema'
import { eq } from 'drizzle-orm'

// ============================================================================
// GET ALL PROMPTS
// ============================================================================

export const getPrompts = createServerFn({ method: 'GET' }).handler(
  async () => {
    return db.query.prompts.findMany({
      orderBy: (prompts, { desc }) => [desc(prompts.updatedAt)],
      with: {
        promptTags: {
          with: {
            tag: true,
          },
        },
      },
    })
  },
)

// ============================================================================
// GET SINGLE PROMPT
// ============================================================================

export const getPrompt = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return db.query.prompts.findFirst({
      where: eq(prompts.id, id),
      with: {
        promptTags: {
          with: {
            tag: true,
          },
        },
        promptBlocks: {
          with: {
            block: true,
          },
        },
      },
    })
  })

// ============================================================================
// CREATE PROMPT
// ============================================================================

export const createPrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: NewPrompt) => data)
  .handler(async ({ data }) => {
    const [prompt] = await db.insert(prompts).values(data).returning()
    return prompt
  })

// ============================================================================
// UPDATE PROMPT
// ============================================================================

export const updatePrompt = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string } & Partial<NewPrompt>) => data)
  .handler(async ({ data: { id, ...updates } }) => {
    const [prompt] = await db
      .update(prompts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(prompts.id, id))
      .returning()
    return prompt
  })

// ============================================================================
// DELETE PROMPT
// ============================================================================

export const deletePrompt = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(prompts).where(eq(prompts.id, id))
    return { success: true }
  })
