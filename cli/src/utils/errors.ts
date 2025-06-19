/**
 * Base custom error class for the CLI
 * Provides common functionality for all CLI errors
 */
export class CLIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message)
    this.name = this.constructor.name

    // Maintain proper stack trace in Node.js
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  /**
   * Get the error details in a format suitable for logging
   */
  getLogDetails(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}

/**
 * Error thrown when user input validation fails
 */
export class ValidationError extends CLIError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details)
  }
}

/**
 * Error thrown when configuration validation fails
 */
export class ConfigurationError extends CLIError {
  constructor(message: string, details?: unknown) {
    super(message, 'CONFIG_ERROR', details)
  }
}

/**
 * Error thrown when file system operations fail
 */
export class FileSystemError extends CLIError {
  constructor(message: string, details?: unknown) {
    super(message, 'FS_ERROR', details)
  }
}

/**
 * Error thrown when package installation fails
 */
export class PackageError extends CLIError {
  constructor(message: string, details?: unknown) {
    super(message, 'PKG_ERROR', details)
  }
}

/**
 * Error thrown when an operation is cancelled by the user
 */
export class UserCancellationError extends CLIError {
  constructor(message = 'Operation cancelled by user') {
    super(message, 'USER_CANCEL')
  }
}

/**
 * Error thrown when an unexpected error occurs
 */
export class UnexpectedError extends CLIError {
  constructor(message: string, details?: unknown) {
    super(message, 'UNEXPECTED_ERROR', details)
  }
}

/**
 * Type guard to check if an error is a CLIError
 */
export function isCLIError(error: unknown): error is CLIError {
  return error instanceof CLIError
}

/**
 * Utility function to handle unknown errors and convert them to CLIErrors
 */
export function handleUnknownError(error: unknown, context: string): CLIError {
  // If it's already a CLIError, return it
  if (isCLIError(error)) {
    return error
  }

  // Handle Error objects
  if (error instanceof Error) {
    return new UnexpectedError(`${context}: ${error.message}`, {
      originalError: error.name,
      stack: error.stack,
    })
  }

  // Handle any other type of error
  return new UnexpectedError(`${context}: Unknown error occurred`, error)
}
