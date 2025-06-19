export type IpcResponse<T> =
  | {
      success: true
      data: T
    }
  | {
      success: false
      error: {
        code: number
        message: string
      }
    }

export interface IpcApi {
  'api/resource/getAPIResourceById': {
    args: { id: string }
    response: unknown
  }
  'api/resource/getAPIResourceList': {
    args: undefined
    response: unknown
  }
  'db/resource/getById': {
    args: { id: string }
    response: unknown
  }
  'db/resource/getAll': {
    args: undefined
    response: unknown
  }
  'db/resource/create': {
    args: unknown
    response: unknown
  }
  'db/resource/delete': {
    args: { id: string }
    response: unknown
  }
} 