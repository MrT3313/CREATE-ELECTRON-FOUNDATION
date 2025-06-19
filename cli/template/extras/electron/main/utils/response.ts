/**
 * Response status type discriminator for type safety
 */
export type ResponseStatus = 'success' | 'error'

/**
 * Base structure for all API responses
 */
export interface ApiResponseBase {
  /** HTTP status code */
  readonly code: number
  /** Response message */
  readonly msg: string
  /** Response status discriminator */
  readonly status: ResponseStatus
}

/**
 * Success response with optional data
 */
export interface ApiSuccessResponse<T = null> extends ApiResponseBase {
  /** Success status discriminator */
  readonly status: 'success'
  /** Response data */
  readonly data: T
}

/**
 * Error response with optional additional data
 */
export interface ApiErrorResponse<T = null> extends ApiResponseBase {
  /** Error status discriminator */
  readonly status: 'error'
  /** Optional error details */
  readonly data?: T
  /** Optional error code for client-side handling */
  readonly errorCode?: string
}

/**
 * Union type representing all possible API responses
 * Uses discriminated unions for better type checking
 */
export type ApiResponse<T = null> = ApiSuccessResponse<T> | ApiErrorResponse<T>

/**
 * Options for creating a success response
 */
interface SuccessResponseOptions<T> {
  /** Optional custom status code (defaults to 200) */
  readonly code?: number
  /** Optional custom success message (defaults to "SUCCESS") */
  readonly msg?: string
  /** Response data */
  readonly data?: T
}

/**
 * Options for creating an error response
 */
interface ErrorResponseOptions<T = null> {
  /** Optional custom error code (defaults to 500) */
  readonly code?: number
  /** Error message */
  readonly msg: string
  /** Optional error details */
  readonly data?: T
  /** Optional error code for client-side handling */
  readonly errorCode?: string
}

/**
 * Type guard to check if a response is a success response
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.status === 'success'
}

/**
 * Type guard to check if a response is an error response
 */
export function isErrorResponse<T>(
  response: ApiResponse<T>
): response is ApiErrorResponse<T> {
  return response.status === 'error'
}

/**
 * Utility for creating standardized API responses
 */
export const response = {
  /**
   * Create a success response
   * @param options - Success response options
   * @returns Standardized success response object
   */
  ok<T = null>(options?: SuccessResponseOptions<T>): ApiSuccessResponse<T> {
    return {
      code: options?.code ?? 200,
      msg: options?.msg ?? 'SUCCESS',
      status: 'success',
      data: options?.data as T,
    }
  },

  /**
   * Create an error response
   * @param options - Error response options
   * @returns Standardized error response object
   */
  error<T = null>(options: ErrorResponseOptions<T>): ApiErrorResponse<T> {
    return {
      code: options.code ?? 500,
      msg: options.msg,
      status: 'error',
      data: options.data,
      errorCode: options.errorCode,
    }
  },

  /**
   * Create a not found error response
   * @param message - Optional custom message
   * @returns Standardized not found response
   */
  notFound<T = null>(message = 'Resource not found'): ApiErrorResponse<T> {
    return {
      code: 404,
      msg: message,
      status: 'error',
      errorCode: 'NOT_FOUND',
    }
  },

  /**
   * Create a bad request error response
   * @param message - Optional custom message
   * @returns Standardized bad request response
   */
  badRequest<T = null>(message = 'Bad request'): ApiErrorResponse<T> {
    return {
      code: 400,
      msg: message,
      status: 'error',
      errorCode: 'BAD_REQUEST',
    }
  },
}
