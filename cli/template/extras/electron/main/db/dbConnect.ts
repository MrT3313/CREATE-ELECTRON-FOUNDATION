import Database from 'better-sqlite3'
import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import * as schema from './schema'
import { getDatabasePath } from '../utils/database'
import { getDbConfig } from '../utils/consts'
import path from 'path'
export let db: BetterSQLite3Database<typeof schema>
import log from '../logger/index'
import { app } from 'electron'

// CONNECT TO DATABASE ########################################################
const dbConnectLogger = log.scope('db/dbConnect.ts')
export const dbConnect = async ({
  debug = true,
}: {
  debug?: boolean
} = {}) => {
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
    if (app.isPackaged) {
      try {
        const migrationsDirectoryPath = path.join(__dirname, './db/migrations')
        if (debug)
          dbConnectLogger.info(
            `🔍🔍 MIGRATIONS Migrations directory path: ${migrationsDirectoryPath}`
          )
        await migrate(db, { migrationsFolder: migrationsDirectoryPath })
        dbConnectLogger.info(`✅✅ Migrations completed successfully`)
      } catch (error) {
        dbConnectLogger.error(`❌❌ Migration failed: ${error.message}`)
        throw error
      }
    }

    dbConnectLogger.info(
      `🎉🎉 Database connection and setup completed successfully`
    )
  } catch (error) {
    dbConnectLogger.error(`🔴🔴 Database connection failed: ${error.message}`)
    throw new Error(`Database connection failed: ${error.message}`)
  }
}
