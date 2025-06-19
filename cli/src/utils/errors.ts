export class CLIError extends Error {
  constructor(
    message: string,
    public code: string,
    public recoverable: boolean = false,
    public cause?: Error
  ) {
    super(message)
    this.name = 'CLIError'
  }
}

export class FileSystemError extends CLIError {
  constructor(
    message: string,
    public path: string,
    cause?: Error
  ) {
    super(message, 'FILESYSTEM_ERROR', false, cause)
  }
}

export class TemplateError extends CLIError {
  constructor(
    message: string,
    public templateKey: string,
    cause?: Error
  ) {
    super(message, 'TEMPLATE_ERROR', true, cause)
  }
}

export class ValidationError extends CLIError {
  constructor(
    message: string,
    public field: string,
    cause?: Error
  ) {
    super(message, 'VALIDATION_ERROR', true, cause)
  }
}

export function handleError(error: unknown): CLIError {
  if (error instanceof CLIError) {
    return error
  }
  if (error instanceof Error) {
    return new CLIError(error.message, 'UNKNOWN_ERROR', false, error)
  }
  return new CLIError(String(error), 'UNKNOWN_ERROR', false)
}
