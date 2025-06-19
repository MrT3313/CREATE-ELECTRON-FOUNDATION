import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

/**
 * Resources table schema
 * Defines the structure for storing resources in the SQLite database
 */
export const resources = sqliteTable('resources', {
  id: text('id').primaryKey(), // using nanoid for id generation

  title: text('title').notNull(),
  body: text('body').notNull(),
  user_id: integer('user_id').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

/**
 * Resource type for database operations
 */
export type Resource = typeof resources.$inferSelect

/**
 * Type for inserting a new resource
 */
export type NewResource = typeof resources.$inferInsert

/**
 * Type for creating a resource from client input
 */
export type ResourceCreatePayload = Omit<NewResource, 'id' | 'createdAt'>

/**
 * Type for updating an existing resource
 */
export type ResourceUpdatePayload = Partial<
  Omit<Resource, 'id' | 'createdAt'>
> & { id: string }

// Zod schema for runtime validation
export const insertResourceSchema = createInsertSchema(resources)
export const selectResourceSchema = createSelectSchema(resources)

/**
 * Validate if an object is a valid resource create payload
 */
export function isResourceCreatePayload(
  value: unknown
): value is ResourceCreatePayload {
  if (typeof value !== 'object' || value === null) return false

  const obj = value as Record<string, unknown>

  return (
    typeof obj.title === 'string' &&
    obj.title.length > 0 &&
    typeof obj.body === 'string' &&
    obj.body.length > 0 &&
    typeof obj.user_id === 'number' &&
    obj.user_id > 0
  )
}
