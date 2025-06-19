/**
 * Essential utility types for the application
 */

/**
 * Make all properties in T nullable
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null }

/**
 * Make all properties in T optional
 */
export type Optional<T> = { [P in keyof T]?: T[P] }

/**
 * Make all properties in T readonly
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? Immutable<T[P]>
    : T[P]
}

/**
 * Function result with potential error state
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E }

/**
 * Async version of Result type
 */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>

/**
 * Type for a function that validates if a value is of type T
 */
export type TypeValidator<T> = (value: unknown) => value is T
