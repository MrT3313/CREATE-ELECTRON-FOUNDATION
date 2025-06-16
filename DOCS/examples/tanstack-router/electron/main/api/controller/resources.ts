import { jsonPlaceholderServices } from '../services/jsonplaceholder'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

ipcMain.handle(
  'api/resource/getAPIResourceById',
  async (_event: IpcMainInvokeEvent, arg: { id: number }) => {
    try {
      const result = await jsonPlaceholderServices.getAPIResourceById(arg.id)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error getting resource: ${message}` }
    }
  }
)

ipcMain.handle('api/resource/getAPIResourceList', async () => {
  try {
    const result = await jsonPlaceholderServices.getAPIResourceList()
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { code: 500, msg: `Error getting resource list: ${message}` }
  }
})

ipcMain.handle(
  'api/resource/insertAPIResource',
  async (_event: IpcMainInvokeEvent, args: { id: number }) => {
    try {
      const result = await jsonPlaceholderServices.insertAPIResource(args.id)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error getting resource list: ${message}` }
    }
  }
)

ipcMain.handle(
  'api/resource/deleteAPIResourceById',
  async (_event: IpcMainInvokeEvent, args: { id: number }) => {
    try {
      const result = await jsonPlaceholderServices.deleteAPIResourceById(
        args.id
      )
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error getting resource list: ${message}` }
    }
  }
)
