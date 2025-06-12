import { resourceServices } from '../services/resources'
import { ipcMain, IpcMainInvokeEvent } from 'electron'
// import type { Resource } from '../schema'

ipcMain.handle(
  'db/resource/getResource',
  async (_event: IpcMainInvokeEvent, arg: { id: number }) => {
    try {
      const result = await resourceServices.getResourceById(arg.id)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error getting resource: ${message}` }
    }
  }
)

ipcMain.handle('db/resource/getList', async () => {
  try {
    const result = await resourceServices.getResourceList()
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { code: 500, msg: `Error getting resource list: ${message}` }
  }
})
