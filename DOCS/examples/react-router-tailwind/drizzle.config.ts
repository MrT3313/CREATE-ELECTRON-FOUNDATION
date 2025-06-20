import { defineConfig } from 'drizzle-kit'
import { getDatabasePath } from './electron/main/utils/database'
import { existsSync, mkdirSync } from 'fs'
import { dirname } from 'path'

const databasePath = getDatabasePath()

// Ensure the directory exists
const dbDir = dirname(databasePath)
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true })
}

export default defineConfig({
  dialect: 'sqlite',
  schema: './electron/main/db/schema/index.ts',
  out: './electron/main/db/migrations',
  dbCredentials: {
    url: databasePath,
  },
})
