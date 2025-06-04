import { resourceServices } from '../services/resources'
import { ipcMain, IpcMainInvokeEvent } from 'electron'

ipcMain.handle('db/resource/getResource', async (event: IpcMainInvokeEvent, arg: any) => {
  try {
    const result = await resourceServices.getResourceById(arg.id)
    return result
  } catch (error: any) {
    return { code: 500, msg: `Error getting resource: ${error.message}` }
  }
})

ipcMain.handle('db/resource/getList', async (event: IpcMainInvokeEvent, arg: any) => {
  try {
    const result = await resourceServices.getResourceList()
    return result
  } catch (error: any) {
    return { code: 500, msg: `Error getting resource list: ${error.message}` }
  }
})


// NOT IMPLEMENTED YET
// ipcMain.handle('db/resource/addOrUpdate', async (event: IpcMainInvokeEvent, arg: any) => {
//   try {
//     const data = arg
//     let res
    
//     if (data.id) {
//       res = await resourceServices.updateResourceById(data.id, data)
//     } else {
//       const newData = { ...data }
//       delete newData.id
//       res = await resourceServices.insertResource(newData)
//     }
    
//     return res
//   } catch (error: any) {
//     return { code: 500, msg: `Error adding/updating resource: ${error.message}` }
//   }
// })

// ipcMain.handle('db/resource/getInfoById', async (event: IpcMainInvokeEvent, { id }: { id: string }) => {
//   try {
//     const result = await resourceServices.getResourceById(id)
//     return result
//   } catch (error: any) {
//     return { code: 500, msg: `Error getting resource info: ${error.message}` }
//   }
// })

// ipcMain.handle('db/resource/deleteById', async (event: IpcMainInvokeEvent, { id }: { id: string }) => {
//   try {
//     const result = await resourceServices.deleteResourceById(id)
//     return result
//   } catch (error: any) {
//     return { code: 500, msg: `Error deleting resource: ${error.message}` }
//   }
// })
