import { resourceServices } from '../services/resources'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

// TYPES
import { NewDBResource } from '../../../../types/resource'

ipcMain.handle(
  'db/resource/getDBResourceById',
  async (_event: IpcMainInvokeEvent, arg: { id: string }) => {
    try {
      const result = await resourceServices.getDBResourceById(arg.id)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error getting resource: ${message}` }
    }
  }
)

ipcMain.handle('db/resource/getDBResourceList', async () => {
  try {
    const result = await resourceServices.getDBResourceList()
    return result
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    return { code: 500, msg: `Error getting resource list: ${message}` }
  }
})

ipcMain.handle(
  'db/resource/insertDBResource',
  async (_event: IpcMainInvokeEvent, args: { data: NewDBResource }) => {
    try {
      const result = await resourceServices.insertDBResource(args.data)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error adding resource: ${message}` }
    }
  }
)

ipcMain.handle(
  'db/resource/deleteDBResourceById',
  async (_event: IpcMainInvokeEvent, args: { id: string }) => {
    try {
      const result = await resourceServices.deleteDBResourceById(args.id)
      return result
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error)
      return { code: 500, msg: `Error adding resource: ${message}` }
    }
  }
)
