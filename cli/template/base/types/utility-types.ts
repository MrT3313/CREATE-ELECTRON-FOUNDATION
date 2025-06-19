/**
 * Essential utility types for the application
 */

/**
 * Function result with potential error state
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E }
