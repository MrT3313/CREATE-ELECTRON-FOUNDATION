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

// NOT IMPLEMENTED YET
// ipcMain.handle(
//   'db/resource/addOrUpdate',
//   async (_event: IpcMainInvokeEvent, arg: Resource) => {
//     try {
//       const data = arg
//       let res

//       if (data.id) {
//         res = await resourceServices.updateResourceById(data.id, data)
//       } else {
//         const newData = { ...data }
//         delete newData.id
//         res = await resourceServices.insertResource(newData)
//       }

//       return res
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error)
//       return { code: 500, msg: `Error adding/updating resource: ${message}` }
//     }
//   },
// )

// ipcMain.handle(
//   'db/resource/getInfoById',
//   async (_event: IpcMainInvokeEvent, { id }: { id: number }) => {
//     try {
//       const result = await resourceServices.getResourceById(id)
//       return result
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error)
//       return { code: 500, msg: `Error getting resource info: ${message}` }
//     }
//   },
// )

// ipcMain.handle(
//   'db/resource/deleteById',
//   async (_event: IpcMainInvokeEvent, { id }: { id: number }) => {
//     try {
//       const result = await resourceServices.deleteResourceById(id)
//       return result
//     } catch (error: unknown) {
//       const message = error instanceof Error ? error.message : String(error)
//       return { code: 500, msg: `Error deleting resource: ${message}` }
//     }
//   },
// )
