import type { APIResource, DBResource } from './types/resource'

declare global {
  interface Window {
    api: {
      insertAPIResource: (resource: Omit<APIResource, 'id'>) => Promise<APIResource>
      deleteAPIResourceById: (id: number) => Promise<void>
      getAPIResource: (id: number) => Promise<APIResource>
      getAPIResourceList: () => Promise<{ data: APIResource[] }>
    }
    db: {
      insertDBResource: (resource: Omit<DBResource, 'id'>) => Promise<DBResource>
      deleteDBResourceById: (id: number) => Promise<void>
      getDBResource: (id: number) => Promise<DBResource>
      getDBResourceList: () => Promise<DBResource[]>
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
