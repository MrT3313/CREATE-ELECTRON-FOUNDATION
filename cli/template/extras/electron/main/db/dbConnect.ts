import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'
import { getDatabasePath } from '../utils/database'
import { getDbConfig } from '../utils/consts'
import path from 'path'
import log from '../logger/index'

/**
 * Database connection options
 */
interface DbConnectOptions {
  /** Enable debug logging */
  debug?: boolean
}

/**
 * Database connection instance with strongly typed schema
 */
export let db: BetterSQLite3Database<typeof schema>

// CONNECT TO DATABASE ########################################################
const dbConnectLogger = log.scope('db/dbConnect.ts')

/**
 * Connect to the SQLite database and set up Drizzle ORM
 *
 * @param options - Connection options
 * @returns Promise that resolves when the connection is established
 */
export const dbConnect = async ({
  debug = true,
}: DbConnectOptions = {}): Promise<BetterSQLite3Database<typeof schema>> => {
  try {
    const dbPath = getDatabasePath()
    if (debug) dbConnectLogger.info(`🔍🔍 Database path: ${dbPath}`)

    // CREATE: database connection
    const sqlite = new Database(dbPath, {
      timeout: getDbConfig().timeout,
    })

    // ENABLE: foreign keys
    sqlite.pragma('foreign_keys = ON')

    // INITIALIZE: Drizzle
    db = drizzle(sqlite, { schema })

    // PRODUCTION MIGRATIONS ##################################################
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.RUN_MIGRATIONS === 'true'
    ) {
      await runMigrations(debug)
    }

    dbConnectLogger.info(
      `🎉🎉 Database connection and setup completed successfully`
    )

    return db
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    dbConnectLogger.error(`🔴🔴 Database connection failed: ${errorMessage}`)
    throw new Error(`Database connection failed: ${errorMessage}`)
  }
}

/**
 * Run database migrations from the migrations folder
 *
 * @param debug - Enable debug logging
 */
async function runMigrations(debug: boolean): Promise<void> {
  try {
    const migrationsDirectoryPath = path.join(__dirname, './db/migrations')
    if (debug) {
      dbConnectLogger.info(
        `🔍🔍 MIGRATIONS Migrations directory path: ${migrationsDirectoryPath}`
      )
    }

    await migrate(db, { migrationsFolder: migrationsDirectoryPath })
    dbConnectLogger.info(`✅✅ Migrations completed successfully`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    dbConnectLogger.error(`❌❌ Migration failed: ${errorMessage}`)
    throw error
  }
}
