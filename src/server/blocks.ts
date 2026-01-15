import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { blocks, type NewBlock } from '@/db/schema'
import { eq, ilike } from 'drizzle-orm'

// ============================================================================
// GET ALL BLOCKS
// ============================================================================

export const getBlocks = createServerFn({ method: 'GET' }).handler(async () => {
  return db.query.blocks.findMany({
    orderBy: (blocks, { desc }) => [desc(blocks.createdAt)],
  })
})

// ============================================================================
// GET BLOCKS BY CATEGORY
// ============================================================================

export const getBlocksByCategory = createServerFn({ method: 'GET' })
  .inputValidator((category: string) => category)
  .handler(async ({ data: category }) => {
    return db.query.blocks.findMany({
      where: eq(blocks.category, category),
      orderBy: (blocks, { asc }) => [asc(blocks.name)],
    })
  })

// ============================================================================
// SEARCH BLOCKS
// ============================================================================

export const searchBlocks = createServerFn({ method: 'GET' })
  .inputValidator((query: string) => query)
  .handler(async ({ data: query }) => {
    return db.query.blocks.findMany({
      where: ilike(blocks.name, `%${query}%`),
      orderBy: (blocks, { asc }) => [asc(blocks.name)],
    })
  })

// ============================================================================
// GET SINGLE BLOCK
// ============================================================================

export const getBlock = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return db.query.blocks.findFirst({
      where: eq(blocks.id, id),
    })
  })

// ============================================================================
// CREATE BLOCK
// ============================================================================

export const createBlock = createServerFn({ method: 'POST' })
  .inputValidator((data: NewBlock) => data)
  .handler(async ({ data }) => {
    const [block] = await db.insert(blocks).values(data).returning()
    return block
  })

// ============================================================================
// UPDATE BLOCK
// ============================================================================

export const updateBlock = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string } & Partial<NewBlock>) => data)
  .handler(async ({ data: { id, ...updates } }) => {
    const [block] = await db
      .update(blocks)
      .set(updates)
      .where(eq(blocks.id, id))
      .returning()
    return block
  })

// ============================================================================
// DELETE BLOCK
// ============================================================================

export const deleteBlock = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    await db.delete(blocks).where(eq(blocks.id, id))
    return { success: true }
  })
