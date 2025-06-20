import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'
import { getDatabasePath } from '../utils/database'
import path from 'path'

const runMigrations = async ({ debug = false }: { debug?: boolean }) => {
  try {
    const dbPath = getDatabasePath()
    if (debug) console.log(`🔍 Database path: ${dbPath}`)

    const sqlite = new Database(dbPath)
    sqlite.pragma('foreign_keys = ON')

    const db = drizzle(sqlite, { schema })

    const migrationsDirectoryPath = path.join(__dirname, './migrations')
    if (debug)
      console.log(`🔍 Migrations directory: ${migrationsDirectoryPath}`)

    await migrate(db, { migrationsFolder: migrationsDirectoryPath })

    if (debug) console.log('✅ Migrations completed successfully!')
    sqlite.close()
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

runMigrations({})
