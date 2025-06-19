import { jsonPlaceholderServices } from '../services/jsonplaceholder.js'
import { handleIpc } from '../../utils/ipc.js'
import { IpcApi } from '../../types/ipc.js'

handleIpc(
  'api/resource/getAPIResourceById',
  async (_event, arg: IpcApi['api/resource/getAPIResourceById']['args']) => {
    try {
      const result = await jsonPlaceholderServices.getAPIResourceById(arg.id)
      return { success: true, data: result }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return {
        success: false,
        error: { code: 500, message: `Error getting resource: ${message}` },
      }
    }
  }
)

handleIpc('api/resource/getAPIResourceList', async () => {
  try {
    const result = await jsonPlaceholderServices.getAPIResourceList()
    return { success: true, data: result }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return {
      success: false,
      error: { code: 500, message: `Error getting resource list: ${message}` },
    }
  }
})
