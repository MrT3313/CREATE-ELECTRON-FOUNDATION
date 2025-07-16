import { nanoid } from 'nanoid'
import { app } from 'electron'

import { name } from '../../../package.json'

export const SESSION_ID = nanoid()
export const APP_NAME =
  app && app?.isPackaged
    ? app.getName().toLowerCase().replace(/ /g, '-')
    : name.toLowerCase().replace(/ /g, '-') // DO NOT USE A FALLBACK - it either loads correctly or there is a bug

export const electronLogMessageFormat =
  '{h}:{i}:{s} [{processType}{scope}] [{level}] > {text}'

export function getDbName() {
  if (app && app.isPackaged) {
    return `${APP_NAME}.db`
  }
  return `${APP_NAME}.dev.db`
}

export function getDbConfig() {
  return {
    name: getDbName(),
    timeout: 5000,
    appName: APP_NAME,
  }
}
