import type { APIResource, DBResource } from './types/resource'

declare global {
  interface Window {
    api: {
      insertAPIResource: (resource: Omit<APIResource, 'id'>) => Promise<APIResource>
      deleteAPIResourceById: (id: number) => Promise<void>
      getResource: (id: number) => Promise<APIResource>
      getResources: () => Promise<{ data: APIResource[] }>
    }
    db: {
      insertDBResource: (resource: Omit<DBResource, 'id'>) => Promise<DBResource>
      deleteDBResourceById: (id: number) => Promise<void>
      getResource: (id: number) => Promise<DBResource>
      getResources: () => Promise<DBResource[]>
    }
    env: {
      CUSTOM_ENV_VAR: string
      NODE_ENV: string
      APP_NAME: string
      APP_ROOT: string
      DIST: string
      VITE_PUBLIC: string
      VITE_DEV_SERVER_URL: string
    }
  }
}
