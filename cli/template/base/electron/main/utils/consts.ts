import { nanoid } from 'nanoid'
import { app } from 'electron'

export const SESSION_ID = nanoid()
export const APP_NAME = process.env.APP_NAME || `create-electron-foundation`

export const electronLogMessageFormat = '{h}:{i}:{s} [{processType}{scope}] [{level}] > {text}';

export function getDbName() {
  try {
    return app?.isPackaged ? `${process.env.APP_NAME}.db` : `${process.env.APP_NAME}.dev.db`
    
  } catch (error) {
    // Fallback for when app is not initialized or not in Electron context
    return process.env.NODE_ENV === 'production' ? `${process.env.APP_NAME}.db` : `${process.env.APP_NAME}.dev.db`
  }
}

export function getDbConfig() {
  return {
    name: getDbName(),
    timeout: 5000,
    appName: APP_NAME
  }
}