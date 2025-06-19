import { IpcMainInvokeEvent, ipcMain } from 'electron'
import type { APIResource, DBResource } from '../../../types/resource'

/**
 * Type-safe IPC channel definition system
 */

/**
 * Common channel name type to ensure consistency between main and renderer processes
 */
export type IPCChannel = string

/**
 * Base interface for all IPC handlers
 */
export interface IPCHandler<TPayload = unknown, TResult = unknown> {
  readonly channel: IPCChannel
  readonly handler: (
    event: IpcMainInvokeEvent,
    payload: TPayload
  ) => Promise<TResult>
}

/**
 * Type for the resource IPC channels
 */
export type ResourceChannel =
  | 'api/resource/getById'
  | 'api/resource/getAll'
  | 'api/resource/create'
  | 'api/resource/delete'
  | 'db/resource/getById'
  | 'db/resource/getAll'
  | 'db/resource/create'
  | 'db/resource/delete'

/**
 * Type-safe mapping of channel names to request payloads
 */
export interface ChannelRequestMap {
  'api/resource/getById': { id: number }
  'api/resource/getAll': void
  'api/resource/create': Omit<APIResource, 'id'>
  'api/resource/delete': { id: number }
  'db/resource/getById': { id: string }
  'db/resource/getAll': void
  'db/resource/create': Omit<DBResource, 'id'>
  'db/resource/delete': { id: string }
}

/**
 * Type-safe mapping of channel names to response payloads
 */
export interface ChannelResponseMap {
  'api/resource/getById': APIResource
  'api/resource/getAll': { data: APIResource[] }
  'api/resource/create': APIResource
  'api/resource/delete': void
  'db/resource/getById': DBResource
  'db/resource/getAll': DBResource[]
  'db/resource/create': DBResource
  'db/resource/delete': void
}

/**
 * Type for a strongly-typed IPC handler
 */
export type TypedIPCHandler<C extends ResourceChannel> = IPCHandler<
  ChannelRequestMap[C],
  ChannelResponseMap[C]
>

/**
 * Utility function to create a type-safe IPC handler
 * @param channel - The IPC channel name
 * @param handler - The handler function
 * @returns A type-safe IPC handler object
 */
export function createIPCHandler<C extends ResourceChannel>(
  channel: C,
  handler: (
    event: IpcMainInvokeEvent,
    payload: ChannelRequestMap[C]
  ) => Promise<ChannelResponseMap[C]>
): TypedIPCHandler<C> {
  return {
    channel,
    handler,
  }
}

/**
 * Register all IPC handlers
 * @param handlers - Array of IPC handlers to register
 */
export function registerIPCHandlers(handlers: IPCHandler[]): void {
  for (const { channel, handler } of handlers) {
    ipcMain.handle(channel, handler)
  }
}

/**
 * Generic error response
 */
export interface ErrorResponse {
  readonly error: true
  readonly message: string
  readonly code: number
}

/**
 * Type guard to check if a response is an error
 */
export function isErrorResponse(response: unknown): response is ErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    (response as { error: unknown }).error === true
  )
}
