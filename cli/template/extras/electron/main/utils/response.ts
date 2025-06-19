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
 * Success response with data
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
 */
export type ApiResponse<T = null> = ApiSuccessResponse<T> | ApiErrorResponse<T>

/**
 * Type guard to check if a response is a success response
 */
export function isSuccessResponse<T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> {
  return response.status === 'success'
}

/**
 * Utility for creating standardized API responses
 */
export const response = {
  /**
   * Create a success response
   * @param data - Response data
   * @param message - Optional success message
   * @param code - Optional status code
   * @returns Standardized success response
   */
  ok<T = null>(
    data?: T,
    message = 'SUCCESS',
    code = 200
  ): ApiSuccessResponse<T> {
    return {
      code,
      msg: message,
      status: 'success',
      data: data as T,
    }
  },

  /**
   * Create an error response
   * @param message - Error message
   * @param code - Optional status code
   * @param errorCode - Optional error code for client-side handling
   * @param data - Optional error details
   * @returns Standardized error response
   */
  error<T = null>(
    message: string,
    code = 500,
    errorCode?: string,
    data?: T
  ): ApiErrorResponse<T> {
    return {
      code,
      msg: message,
      status: 'error',
      data,
      errorCode,
    }
  },

  /**
   * Create a not found error response
   * @param message - Optional custom message
   * @returns Standardized not found response
   */
  notFound(message = 'Resource not found'): ApiErrorResponse {
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
  badRequest(message = 'Bad request'): ApiErrorResponse {
    return {
      code: 400,
      msg: message,
      status: 'error',
      errorCode: 'BAD_REQUEST',
    }
  },
}
