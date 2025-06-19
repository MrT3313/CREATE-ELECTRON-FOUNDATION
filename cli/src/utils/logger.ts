import chalk from 'chalk'
import { isCLIError, handleUnknownError } from './errors.js'

interface LoggerOptions {
  prefix?: string
  timestamp?: boolean
}

/**
 * Enhanced logger with support for custom error handling
 */
export const logger = {
  /**
   * Logs an error message to the console
   */
  error(
    message: string | Error | unknown,
    details?: unknown,
    options?: LoggerOptions
  ) {
    const prefix = options?.prefix ? `[${options.prefix}] ` : ''

    if (message instanceof Error) {
      if (isCLIError(message)) {
        // Handle our custom CLI errors
        const errorDetails = message.getLogDetails()
        console.error(
          chalk.red(`${prefix}${errorDetails.code}: ${errorDetails.message}`)
        )

        // Log additional details if available
        if (errorDetails.details) {
          console.error(chalk.red('Details:'), errorDetails.details)
        }
      } else {
        // Handle standard Error objects
        console.error(chalk.red(`${prefix}ERROR: ${message.message}`))
        if (message.stack) {
          console.error(chalk.red(message.stack))
        }
      }
    } else if (typeof message === 'string') {
      // Handle string messages
      console.error(chalk.red(`${prefix}${message}`))
      if (details) {
        console.error(chalk.red('Details:'), details)
      }
    } else {
      // Handle any other type
      console.error(chalk.red(`${prefix}ERROR:`), message)
    }
  },

  /**
   * Logs a warning message to the console
   */
  warn(...args: unknown[]) {
    console.log(chalk.yellow(...args))
  },

  /**
   * Logs a debug message to the console
   */
  debug(...args: unknown[]) {
    console.log(chalk.yellow(...args))
  },

  /**
   * Logs an informational message to the console
   */
  info(...args: unknown[]) {
    console.log(chalk.cyan(...args))
  },

  /**
   * Logs a success message to the console
   */
  success(...args: unknown[]) {
    console.log(chalk.green(...args))
  },

  /**
   * Handles an unknown error by converting it to a CLIError and logging it
   */
  handleError(error: unknown, context: string) {
    const cliError = handleUnknownError(error, context)
    this.error(cliError)
    return cliError
  },
}
