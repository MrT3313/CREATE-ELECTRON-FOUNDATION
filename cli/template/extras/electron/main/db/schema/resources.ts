import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

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
 * Type representing a resource as retrieved from the database
 * Uses Drizzle's type inference to ensure type safety
 */
export type Resource = typeof resources.$inferSelect

/**
 * Type representing a resource being inserted into the database
 * Uses Drizzle's type inference to ensure type safety
 */
export type NewResource = typeof resources.$inferInsert

/**
 * Type for resource creation request payloads
 * Omits the id and createdAt fields which are generated automatically
 */
export type ResourceCreatePayload = Omit<NewResource, 'id' | 'createdAt'>

/**
 * Type for resource update request payloads
 * Makes all fields optional except the ID for identification
 */
export type ResourceUpdatePayload = Partial<
  Omit<Resource, 'id' | 'createdAt'>
> & { id: string }

// Zod schema for runtime validation
export const insertResourceSchema = createInsertSchema(resources)
export const selectResourceSchema = createSelectSchema(resources)

// Custom validation schema for resource creation
export const resourceCreatePayloadSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  body: z.string().min(1, 'Body cannot be empty'),
  user_id: z.number().int().positive('User ID must be a positive integer'),
})

// Type guard to validate if a value is a valid Resource
export function isResource(value: unknown): value is Resource {
  try {
    selectResourceSchema.parse(value)
    return true
  } catch {
    return false
  }
}

// Type guard to validate if a value is a valid ResourceCreatePayload
export function isResourceCreatePayload(
  value: unknown
): value is ResourceCreatePayload {
  try {
    resourceCreatePayloadSchema.parse(value)
    return true
  } catch {
    return false
  }
}
