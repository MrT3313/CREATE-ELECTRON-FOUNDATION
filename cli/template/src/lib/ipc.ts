import { ipcRenderer } from 'electron'
import { IpcApi, IpcResponse } from '../../electron/main/types/ipc.js'

export const invokeIpc = <C extends keyof IpcApi>(
  channel: C,
  args: IpcApi[C]['args']
): Promise<IpcResponse<IpcApi[C]['response']>> => {
  return ipcRenderer.invoke(channel, args)
} 