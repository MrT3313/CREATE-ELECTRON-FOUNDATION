/**
 * General-purpose TypeScript utility types
 */

/**
 * Make specific properties of T required
 * @example
 * type User = { name?: string; email?: string; id?: number }
 * type UserWithRequiredId = WithRequired<User, 'id'> // { name?: string; email?: string; id: number }
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Make specified properties in T optional, while keeping the rest required
 * @example
 * type User = { name: string; email: string; id: number }
 * type UserWithOptionalEmail = WithOptional<User, 'email'> // { name: string; email?: string; id: number }
 */
export type WithOptional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>

/**
 * Make all properties of T nullable
 * @example
 * type User = { name: string; email: string }
 * type NullableUser = Nullable<User> // { name: string | null; email: string | null }
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null }

/**
 * Make specified properties in T nullable, while keeping the rest as-is
 * @example
 * type User = { name: string; email: string; id: number }
 * type UserWithNullableEmail = WithNullable<User, 'email'> // { name: string; email: string | null; id: number }
 */
export type WithNullable<T, K extends keyof T> = Omit<T, K> & {
  [P in K]: T[P] | null
}

/**
 * Create a record with specific keys and value type
 * @example
 * type ColorMap = RecordWithKeys<'red' | 'green' | 'blue', string> // { red: string; green: string; blue: string }
 */
export type RecordWithKeys<K extends string | number | symbol, T> = {
  [P in K]: T
}

/**
 * Extract the type of elements in an array
 * @example
 * type StringArray = string[]
 * type StringType = ArrayElement<StringArray> // string
 */
export type ArrayElement<T extends readonly unknown[]> =
  T extends readonly (infer U)[] ? U : never

/**
 * Create a discriminated union type
 * @example
 * type ActionTypes = 'CREATE' | 'UPDATE' | 'DELETE'
 * type Action = DiscriminatedUnion<'type', ActionTypes, { payload: unknown }>
 * // { type: 'CREATE'; payload: unknown } | { type: 'UPDATE'; payload: unknown } | { type: 'DELETE'; payload: unknown }
 */
export type DiscriminatedUnion<
  K extends string,
  T extends string,
  U extends Record<string, unknown> = Record<string, unknown>,
> = {
  [P in K]: T
} & U

/**
 * Require at least one of the specified properties
 * @example
 * type ContactInfo = { name?: string; email?: string; phone?: string }
 * type Contact = RequireAtLeastOne<ContactInfo>
 * // At least one of name, email, or phone must be provided
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/**
 * Require exactly one of the specified properties
 * @example
 * type UserIdentifier = { id?: number; email?: string; username?: string }
 * type UserLookup = RequireExactlyOne<UserIdentifier>
 * // Exactly one of id, email, or username must be provided
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]: Required<Pick<T, K>> & Record<Exclude<Keys, K>, never>
  }[Keys]

/**
 * Create a type with all properties of T except those that are assignable to U
 * @example
 * type User = { id: number; name: string; age: number }
 * type UserWithoutNumbers = ExcludeByType<User, number> // { name: string }
 */
export type ExcludeByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

/**
 * Create a type with only properties of T that are assignable to U
 * @example
 * type User = { id: number; name: string; age: number }
 * type UserOnlyNumbers = ExtractByType<User, number> // { id: number; age: number }
 */
export type ExtractByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

/**
 * Deep partial type that makes all properties and nested properties optional
 * @example
 * type User = { profile: { name: string; address: { street: string; city: string } } }
 * type PartialUser = DeepPartial<User>
 * // { profile?: { name?: string; address?: { street?: string; city?: string } } }
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

/**
 * Create a type that has all the properties of T, with the ones in K marked as readonly
 * @example
 * type User = { id: number; name: string }
 * type UserWithReadonlyId = WithReadonly<User, 'id'> // { readonly id: number; name: string }
 */
export type WithReadonly<T, K extends keyof T> = Omit<T, K> & {
  readonly [P in K]: T[P]
}

/**
 * Make specified readonly properties in T mutable
 * @example
 * type User = { readonly id: number; readonly name: string }
 * type UserWithMutableName = WithMutable<User, 'name'> // { readonly id: number; name: string }
 */
export type WithMutable<T, K extends keyof T> = Omit<T, K> & {
  -readonly [P in K]: T[P]
}

/**
 * A non-empty object type (safer than {})
 */
export type NonEmptyObject = Record<string, unknown>

/**
 * Type-safe dictionary with string keys
 */
export type Dictionary<T> = Record<string, T>
