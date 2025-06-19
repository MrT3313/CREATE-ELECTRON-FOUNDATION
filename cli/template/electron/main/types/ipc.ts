/**
 * Type definitions for IPC (Inter-Process Communication) between
 * Electron's main and renderer processes
 */

import { Resource, ResourceCreatePayload } from '../db/schema/resources'
import { ApiResponse } from '../utils/response'

/**
 * Type representing a channel used for IPC communication
 */
export type IpcChannel =
  // Resource-related channels
  | 'get-resources'
  | 'get-resource'
  | 'create-resource'
  | 'delete-resource'

  // System-related channels
  | 'app-ready'
  | 'app-info'
  | 'app-quit'
  | 'app-open-external-url'
  | 'app-reload'

  // Window-related channels
  | 'window-minimize'
  | 'window-maximize'
  | 'window-close'
  | 'window-toggle-developer-tools'

/**
 * IPC Request message format
 */
export interface IpcRequest<T = unknown> {
  /**
   * Channel to send the request to
   */
  channel: IpcChannel

  /**
   * Request data (optional)
   */
  data?: T
}

/**
 * IPC Response message format
 * Uses ApiResponse for consistent response format across the application
 */
export type IpcResponse<T = unknown> = ApiResponse<T>

/**
 * Interface mapping channels to their expected request and response types
 * This provides type safety for IPC communication
 */
export interface IpcChannelTypeMap {
  // Resource-related channels
  'get-resources': {
    request: void
    response: Resource[]
  }
  'get-resource': {
    request: string // Resource ID
    response: Resource
  }
  'create-resource': {
    request: ResourceCreatePayload
    response: { id: string }
  }
  'delete-resource': {
    request: string // Resource ID
    response: void
  }

  // System-related channels
  'app-ready': {
    request: void
    response: { version: string; electronVersion: string }
  }
  'app-info': {
    request: void
    response: { name: string; version: string; environment: string }
  }
  'app-quit': {
    request: void
    response: void
  }
  'app-open-external-url': {
    request: string // URL
    response: void
  }
  'app-reload': {
    request: void
    response: void
  }

  // Window-related channels
  'window-minimize': {
    request: void
    response: void
  }
  'window-maximize': {
    request: void
    response: void
  }
  'window-close': {
    request: void
    response: void
  }
  'window-toggle-developer-tools': {
    request: void
    response: void
  }
}

/**
 * Get type-safe request type for a specific channel
 */
export type IpcRequestType<C extends IpcChannel> =
  IpcChannelTypeMap[C]['request']

/**
 * Get type-safe response type for a specific channel
 */
export type IpcResponseType<C extends IpcChannel> =
  IpcChannelTypeMap[C]['response']

/**
 * Type-safe IPC handler function
 */
export type IpcHandler<C extends IpcChannel> = (
  request: IpcRequestType<C>
) => Promise<IpcResponse<IpcResponseType<C>>>
