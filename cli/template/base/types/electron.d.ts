import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    ipcRenderer: IpcRenderer
    env: {
      CUSTOM_ENV_VAR: string
      NODE_ENV: string
    }
  }
} 