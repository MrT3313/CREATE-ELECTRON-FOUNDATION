/**
 * Utility types for enhancing TypeScript type safety in the application
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
 * Extract non-function property names from T
 */
export type DataProps<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (...args: any[]) => any ? never : K
}[keyof T]

/**
 * Extract only the data properties (non-functions) from T
 */
export type DataPropsOnly<T> = Pick<T, DataProps<T>>

/**
 * Make all properties in T readonly
 */
export type Immutable<T> = {
  readonly [P in keyof T]: T[P] extends Record<string, unknown>
    ? Immutable<T[P]>
    : T[P]
}

/**
 * Make specified properties in T required
 */
export type RequiredProps<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Type for a function that validates if a value is of type T
 */
export type TypeValidator<T> = (value: unknown) => value is T

/**
 * Type for a Zod-like validation function
 */
export type ValidationFunction<T> = (value: unknown) => {
  success: boolean
  data?: T
  error?: string
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
 * Helper to make discriminated unions easier to work with
 */
export type WithDiscriminator<T, K extends keyof T, V extends T[K]> = Extract<
  T,
  Record<K, V>
>

/**
 * Type that allows all properties from T with a value type of R
 */
export type PropsOfType<T, R> = {
  [K in keyof T as T[K] extends R ? K : never]: T[K]
}

/**
 * Type that deeply omits keys from an object
 */
export type DeepOmit<T, K extends PropertyKey> = T extends object
  ? { [P in Exclude<keyof T, K>]: DeepOmit<T[P], K> }
  : T

/**
 * Type that deeply makes an object partial
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

/**
 * Type that ensures all array elements are of the same type
 */
export type UniformArray<T> = Array<T>

/**
 * Type for a function that can validate and transform input
 */
export type Transformer<I, O> = (input: I) => O

/**
 * Create a type where specified properties are optional and the rest are required
 */
export type OptionalProps<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Partial<Pick<T, K>>
