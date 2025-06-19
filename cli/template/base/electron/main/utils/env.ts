import path from 'path'
import { z } from 'zod'
import { app } from 'electron'

/**
 * Runtime environment
 */
export type NodeEnv = 'development' | 'production' | 'test'

/**
 * Core environment variables schema
 */
export const envSchema = z.object({
  /**
   * Node environment
   */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /**
   * Application name
   */
  APP_NAME: z.string().default('Electron Foundation'),

  /**
   * Application root directory
   */
  APP_ROOT: z.string(),

  /**
   * Port for the development server
   */
  PORT: z.coerce.number().positive().default(3000),

  /**
   * Distribution directory
   */
  DIST: z.string(),

  /**
   * Public directory for static assets
   */
  VITE_PUBLIC: z.string(),

  /**
   * Vite development server URL
   */
  VITE_DEV_SERVER_URL: z.string().optional(),

  /**
   * Database path (if applicable)
   */
  DB_PATH: z.string().optional(),
})

/**
 * Type for validated environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Load and validate environment variables
 */
export function loadEnv(): Env {
  // For Electron, set up environment variables that may not be available
  const electronEnv = {
    APP_ROOT: app.getAppPath(),
    DIST: path.join(app.getAppPath(), 'dist'),
    VITE_PUBLIC: path.join(app.getAppPath(), 'public'),
  }

  // Merge process.env with Electron-specific env vars
  const rawEnv = {
    ...process.env,
    ...electronEnv,
  }

  try {
    return envSchema.parse(rawEnv)
  } catch (error) {
    // Add fallbacks for required values on validation failure
    console.error(error)
    const safeEnv = {
      ...rawEnv,
      NODE_ENV: 'development',
      APP_NAME: 'Electron Foundation',
      APP_ROOT: app.getAppPath(),
      DIST: path.join(app.getAppPath(), 'dist'),
      VITE_PUBLIC: path.join(app.getAppPath(), 'public'),
    }
    return envSchema.parse(safeEnv)
  }
}

/**
 * Cached environment variables
 */
let _env: Env | null = null

/**
 * Get typed environment variables
 */
export function env(): Env {
  if (!_env) {
    _env = loadEnv()
  }
  return _env
}

/**
 * Check if the app is in development mode
 */
export function isDevelopment(): boolean {
  return env().NODE_ENV === 'development'
}

/**
 * Type guard to check if app is in production mode
 */
export function isProduction(): boolean {
  return env().NODE_ENV === 'production'
}

/**
 * Type guard to check if app is in test mode
 */
export function isTest(): boolean {
  return env().NODE_ENV === 'test'
}
