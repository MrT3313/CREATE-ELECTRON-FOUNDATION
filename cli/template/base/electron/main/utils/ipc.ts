import { ipcMain, IpcMainInvokeEvent } from 'electron'
import { IpcApi, IpcResponse } from '../../types/ipc.js'

export function handleIpc<T extends keyof IpcApi>(
  channel: T,
  handler: (
    event: IpcMainInvokeEvent,
    args: IpcApi[T]['args'],
  ) => Promise<IpcResponse<IpcApi[T]['response']>>,
) {
  ipcMain.handle(channel, handler)
} 