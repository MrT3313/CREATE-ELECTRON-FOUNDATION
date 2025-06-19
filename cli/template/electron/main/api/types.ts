/**
 * Type definitions for the Electron main process API
 */

import { IpcMainInvokeEvent } from 'electron'
import { Resource, ResourceCreatePayload } from '../db/schema/resources'
import { ApiResponse } from '../utils/response'
import { IpcChannel, IpcRequestType, IpcResponseType } from '../types/ipc'

/**
 * Base controller interface with common methods
 */
export interface BaseController {
  /**
   * Initialize the controller and register IPC handlers
   */
  initialize(): void
}

/**
 * Resource controller interface for managing resources
 */
export interface ResourceController extends BaseController {
  /**
   * Get all resources
   * @returns Promise with all resources or error
   */
  getResources(): Promise<ApiResponse<Resource[]>>

  /**
   * Get a single resource by ID
   * @param id - Resource ID
   * @returns Promise with the resource or error
   */
  getResource(id: string): Promise<ApiResponse<Resource>>

  /**
   * Create a new resource
   * @param data - Resource data
   * @returns Promise with the created resource ID or error
   */
  createResource(
    data: ResourceCreatePayload
  ): Promise<ApiResponse<{ id: string }>>

  /**
   * Delete a resource by ID
   * @param id - Resource ID
   * @returns Promise with success or error
   */
  deleteResource(id: string): Promise<ApiResponse<void>>
}

/**
 * Application controller interface for managing app-level functionality
 */
export interface AppController extends BaseController {
  /**
   * Get application information
   * @returns Promise with app info or error
   */
  getAppInfo(): Promise<
    ApiResponse<{ name: string; version: string; environment: string }>
  >

  /**
   * Quit the application
   */
  quitApp(): Promise<ApiResponse<void>>

  /**
   * Open an external URL in the default browser
   * @param url - URL to open
   */
  openExternalUrl(url: string): Promise<ApiResponse<void>>

  /**
   * Reload the application
   */
  reloadApp(): Promise<ApiResponse<void>>
}

/**
 * Window controller interface for managing window functionality
 */
export interface WindowController extends BaseController {
  /**
   * Minimize the application window
   */
  minimizeWindow(): Promise<ApiResponse<void>>

  /**
   * Maximize or restore the application window
   */
  maximizeWindow(): Promise<ApiResponse<void>>

  /**
   * Close the application window
   */
  closeWindow(): Promise<ApiResponse<void>>

  /**
   * Toggle the developer tools
   */
  toggleDevTools(): Promise<ApiResponse<void>>
}

/**
 * Type definition for IPC handler functions
 * These handle requests from the renderer process
 */
export type IpcHandlerFn<C extends IpcChannel> = (
  event: IpcMainInvokeEvent,
  data?: IpcRequestType<C>
) => Promise<ApiResponse<IpcResponseType<C>>>

/**
 * Interface for registering IPC handlers
 */
export interface IpcHandlerRegistry {
  /**
   * Register an IPC handler for a specific channel
   * @param channel - IPC channel to handle
   * @param handler - Handler function
   */
  registerHandler<C extends IpcChannel>(
    channel: C,
    handler: IpcHandlerFn<C>
  ): void

  /**
   * Register multiple IPC handlers at once
   * @param handlers - Map of channel to handler functions
   */
  registerHandlers(
    handlers: Partial<{
      [C in IpcChannel]: IpcHandlerFn<C>
    }>
  ): void
}
