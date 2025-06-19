import type { APIResource, DBResource } from './types/resource'

interface WindowApi {
  getAPIResourceById: (id: number) => Promise<APIResource>
  getAPIResourceList: () => Promise<{ data: APIResource[] }>
  insertAPIResource: (resource: Omit<APIResource, 'id'>) => Promise<APIResource>
  deleteAPIResourceById: (id: number) => Promise<void>
}

interface WindowDb {
  getDBResourceById: (id: number) => Promise<DBResource>
  getDBResourceList: () => Promise<DBResource[]>
  insertDBResource: (resource: Omit<DBResource, 'id'>) => Promise<DBResource>
  deleteDBResourceById: (id: number) => Promise<void>
}

interface WindowEnv {
  CUSTOM_ENV_VAR: string
  NODE_ENV: string
  APP_NAME: string
  APP_ROOT: string
  DIST: string
  VITE_PUBLIC: string
  VITE_DEV_SERVER_URL: string
}

declare global {
  interface Window {
    api: WindowApi
    db: WindowDb
    env: WindowEnv
  }
}

export type ElectronResponse<T> = T | { error: { msg: string } }

// Enhanced response types
export interface ElectronApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: number
    message: string
    details?: unknown
  }
}

// IPC channel types for type safety
export type IpcChannels =
  | 'api/resource/getAPIResourceById'
  | 'api/resource/getAPIResourceList'
  | 'api/resource/insertAPIResource'
  | 'api/resource/deleteAPIResourceById'
  | 'db/resource/getDBResourceById'
  | 'db/resource/getDBResourceList'
  | 'db/resource/insertDBResource'
  | 'db/resource/deleteDBResourceById'

// Minimal IPC event interface to avoid electron dependency
export interface IpcMainInvokeEvent {
  frameId: number
  processId: number
  sender: {
    id: number
  }
}

// Type-safe IPC handler
export interface IpcHandler<T = unknown> {
  (
    event: IpcMainInvokeEvent,
    ...args: unknown[]
  ): Promise<ElectronApiResponse<T>>
}
