import path from 'path'
import { z } from 'zod'
import { app } from 'electron'
import { logger } from '../logger'

/**
 * Runtime environment
 */
export type NodeEnv = 'development' | 'production' | 'test'

/**
 * Environment variables schema with validation
 */
export const envSchema = z.object({
  /**
   * Node environment (development, production, test)
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
   * Custom environment variable for demonstration
   */
  CUSTOM_ENV_VAR: z.string().default('custom-value'),

  /**
   * Database path for SQLite (if applicable)
   */
  DB_PATH: z.string().optional(),

  /**
   * Flag to run database migrations on startup (if applicable)
   */
  RUN_MIGRATIONS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((val) => val === 'true'),

  /**
   * Database connection timeout in milliseconds (if applicable)
   */
  DB_TIMEOUT: z.coerce.number().positive().default(5000),

  /**
   * Log level
   */
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
})

/**
 * Type for validated environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Load and validate environment variables
 * @returns Validated environment variables
 */
export function loadEnv(): Env {
  // For Electron, we need to set up some environment variables that may not be available
  // from process.env but can be derived from Electron's app paths
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
    if (error instanceof z.ZodError) {
      logger.error('Environment validation failed:', error.errors)
      // Add fallbacks for required values that failed validation
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
    throw error
  }
}

/**
 * Access typed environment variables
 * Memoized to avoid parsing environment variables multiple times
 */
let _env: Env | null = null
export function env(): Env {
  if (!_env) {
    _env = loadEnv()
  }
  return _env
}

/**
 * Type guard to check if app is in development mode
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
