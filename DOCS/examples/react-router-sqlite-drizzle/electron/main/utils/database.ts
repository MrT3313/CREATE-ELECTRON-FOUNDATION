import path from 'path'
import os from 'os'
import { existsSync, mkdirSync } from 'fs'
import { getDbConfig, APP_NAME } from './consts'

import { app } from 'electron'

/**
 * Get the appropriate database directory based on the platform
 * ####################################################################### */

export function getDatabaseDir(): string {
  try {
    // Try Electron's app.getPath if available
    if (app) {
      return app.getPath('userData')
    }
    throw new Error('Not in Electron context')
  } catch {
    // Fallback for non-Electron environment (like drizzle-kit)
    const homeDir = os.homedir()
    const platform = os.platform()

    switch (platform) {
      case 'darwin':
        return path.join(homeDir, 'Library', 'Application Support', APP_NAME)
      case 'win32':
        return path.join(homeDir, 'AppData', 'Roaming', APP_NAME)
      case 'linux':
      default:
        return path.join(homeDir, '.config', APP_NAME)
    }
  }
}

/**
 * Get the full database path and ensure the directory exists
 * ####################################################################### */
export function getDatabasePath(): string {
  const dbDir = getDatabaseDir()
  const dbPath = path.join(dbDir, getDbConfig().name)

  // Ensure the directory exists
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  return dbPath
}
