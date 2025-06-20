import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const resources = sqliteTable('resources', {
  id: text('id').primaryKey(), // using nanoid for id generation

  title: text('title').notNull(),
  body: text('body').notNull(),
  user_id: integer('user_id').notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})
