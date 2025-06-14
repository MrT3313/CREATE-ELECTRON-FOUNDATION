import type { APIResource, DBResource } from './types/resource'

declare global {
  interface Window {
    api: {
      getAPIResourceById: (id: number) => Promise<APIResource>
      getAPIResourceList: () => Promise<{ data: APIResource[] }>
      insertAPIResource: (resource: Omit<APIResource, 'id'>) => Promise<APIResource>
      deleteAPIResourceById: (id: number) => Promise<void>
    }
    db: {
      getDBResourceById: (id: number) => Promise<DBResource>
      getDBResourceList: () => Promise<DBResource[]>
      insertDBResource: (resource: Omit<DBResource, 'id'>) => Promise<DBResource>
      deleteDBResourceById: (id: number) => Promise<void>
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
