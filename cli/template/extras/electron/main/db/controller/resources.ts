import { ResourceServices } from '../services/resources.js'
import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { response } from '../../utils/response.js'
import { ResourceCreatePayload } from '../schema/resources.js'

// TYPES
import { NewDBResource } from '../../../../types/resource'

ipcMain.handle(
  'db/resource/getById',
  async (_event: IpcMainInvokeEvent, arg: { id: string }) => {
    try {
      const resource = await ResourceServices.getResourceById(arg.id)
      if (!resource) {
        return response.notFound(`Resource with ID ${arg.id} not found.`)
      }
      return response.ok(resource)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      return response.error(`Error getting resource: ${message}`)
    }
  }
)

ipcMain.handle('db/resource/getAll', async () => {
  try {
    const resources = await ResourceServices.getResourceList()
    return response.ok(resources)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred.'
    return response.error(`Error getting resource list: ${message}`)
  }
})

ipcMain.handle(
  'db/resource/create',
  async (_event: IpcMainInvokeEvent, args: ResourceCreatePayload) => {
    try {
      const newResource = await ResourceServices.createResource(args)
      return response.ok(newResource)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      return response.error(`Error creating resource: ${message}`, 400) // 400 for bad request on validation error
    }
  }
)

ipcMain.handle(
  'db/resource/delete',
  async (_event: IpcMainInvokeEvent, args: { id: string }) => {
    try {
      const wasDeleted = await ResourceServices.deleteResourceById(args.id)
      if (!wasDeleted) {
        return response.notFound(`Resource with ID ${args.id} not found for deletion.`)
      }
      return response.ok({ id: args.id })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.'
      return response.error(`Error deleting resource: ${message}`)
    }
  }
)
