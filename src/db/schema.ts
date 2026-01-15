import {
  pgTable,
  text,
  timestamp,
  uuid,
  jsonb,
  integer,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ============================================================================
// PROMPTS
// ============================================================================

export const prompts = pgTable('prompts', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  // Canvas data stored as JSON (nodes, edges, viewport from @xyflow/react)
  canvasData: jsonb('canvas_data').$type<object | null>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const promptsRelations = relations(prompts, ({ many }) => ({
  promptBlocks: many(promptBlocks),
  promptTags: many(promptTags),
}))

// ============================================================================
// BLOCKS - Reusable prompt building blocks ("LEGO")
// ============================================================================

export const blocks = pgTable('blocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  content: text('content').notNull(),
  category: text('category'), // e.g., "instruction", "context", "example", "constraint"
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const blocksRelations = relations(blocks, ({ many }) => ({
  promptBlocks: many(promptBlocks),
}))

// ============================================================================
// PROMPT_BLOCKS - Junction table linking prompts to blocks with position info
// ============================================================================

export const promptBlocks = pgTable('prompt_blocks', {
  id: uuid('id').defaultRandom().primaryKey(),
  promptId: uuid('prompt_id')
    .notNull()
    .references(() => prompts.id, { onDelete: 'cascade' }),
  blockId: uuid('block_id')
    .notNull()
    .references(() => blocks.id, { onDelete: 'cascade' }),
  // Position on canvas
  positionX: integer('position_x').default(0),
  positionY: integer('position_y').default(0),
  // Additional node metadata (size, collapsed state, etc.)
  metadata: jsonb('metadata').$type<object | null>(),
})

export const promptBlocksRelations = relations(promptBlocks, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptBlocks.promptId],
    references: [prompts.id],
  }),
  block: one(blocks, {
    fields: [promptBlocks.blockId],
    references: [blocks.id],
  }),
}))

// ============================================================================
// TAGS - For organizing prompts
// ============================================================================

export const tags = pgTable('tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').default('#6366f1'), // Default indigo
})

export const tagsRelations = relations(tags, ({ many }) => ({
  promptTags: many(promptTags),
}))

// ============================================================================
// PROMPT_TAGS - Junction table linking prompts to tags
// ============================================================================

export const promptTags = pgTable('prompt_tags', {
  id: uuid('id').defaultRandom().primaryKey(),
  promptId: uuid('prompt_id')
    .notNull()
    .references(() => prompts.id, { onDelete: 'cascade' }),
  tagId: uuid('tag_id')
    .notNull()
    .references(() => tags.id, { onDelete: 'cascade' }),
})

export const promptTagsRelations = relations(promptTags, ({ one }) => ({
  prompt: one(prompts, {
    fields: [promptTags.promptId],
    references: [prompts.id],
  }),
  tag: one(tags, {
    fields: [promptTags.tagId],
    references: [tags.id],
  }),
}))

// ============================================================================
// Type exports for use in application
// ============================================================================

export type Prompt = typeof prompts.$inferSelect
export type NewPrompt = typeof prompts.$inferInsert

export type Block = typeof blocks.$inferSelect
export type NewBlock = typeof blocks.$inferInsert

export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
