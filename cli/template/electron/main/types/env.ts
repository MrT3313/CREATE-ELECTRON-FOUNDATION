/**
 * Type-safe environment variables for the Electron application
 */

import { z } from 'zod'

/**
 * Runtime environment
 */
export type NodeEnv = 'development' | 'production' | 'test'

/**
 * Environment variables schema
 * Define and validate all environment variables used in the application
 */
export const envSchema = z.object({
  /**
   * Node environment (development, production, test)
   * @default 'development'
   */
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  /**
   * Application name
   * @default 'Electron Foundation'
   */
  APP_NAME: z.string().default('Electron Foundation'),

  /**
   * Port for the development server
   * @default 3000
   */
  PORT: z.coerce.number().positive().default(3000),

  /**
   * Database path for SQLite
   * (Optional, will use default path if not provided)
   */
  DB_PATH: z.string().optional(),

  /**
   * Flag to run database migrations on startup
   * @default false
   */
  RUN_MIGRATIONS: z.enum(['true', 'false']).default('false'),

  /**
   * Database connection timeout in milliseconds
   * @default 5000
   */
  DB_TIMEOUT: z.coerce.number().positive().default(5000),

  /**
   * Log level
   * @default 'info'
   */
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  /**
   * Framework used by the application
   * @default 'Electron'
   */
  CEF_FRAMEWORK: z.string().default('Electron'),

  /**
   * Router package used by the application
   */
  CEF_ROUTER: z.string().optional(),

  /**
   * Styling approach used by the application
   */
  CEF_STYLES: z.string().optional(),

  /**
   * Database technology used by the application
   */
  CEF_DATABASE: z.string().optional(),

  /**
   * ORM used by the application
   */
  CEF_ORM: z.string().optional(),
})

/**
 * Type for validated environment variables
 */
export type Env = z.infer<typeof envSchema>

/**
 * Load and validate environment variables
 * @returns Validated environment variables
 * @throws Error if validation fails
 */
export function loadEnv(): Env {
  try {
    // Process.env contains the environment variables as strings
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:', error.format())
    } else {
      console.error('❌ Error loading environment variables:', error)
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

// For use in development - validates environment variables at startup
if (process.env.NODE_ENV !== 'production') {
  env()
}
