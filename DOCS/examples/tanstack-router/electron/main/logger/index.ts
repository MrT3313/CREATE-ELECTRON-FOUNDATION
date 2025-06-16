import { app } from 'electron'
import log from 'electron-log/main'
import path from 'path'
import { SESSION_ID, electronLogMessageFormat } from '../utils/consts'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

// Initialize electron-log. This is optional but recommended if you also log from renderer processes.
// It allows renderers to use `import log from 'electron-log/renderer'`
log.initialize()

try {
  if (app) {
    if (app?.isPackaged) {
      // PRODUCTION: logging
      log.transports.console.level = 'warn'
      log.transports.file.level = 'info'
    } else {
      // DEVELOPMENT: logging
      log.transports.console.level = 'info'
      log.transports.file.level = 'info'
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    log.transports.file.resolvePathFn = (variables: any, message: any) => {
      const now = dayjs().utc()
      const year = now.year().toString()
      const month = (now.month() + 1).toString().padStart(2, '0')
      const day = now.date().toString().padStart(2, '0')

      const datePath = `${year}-${month}-${day}`
      const fileName = `${message?.variables?.processType || 'unknown'}.log`

      return path.join(
        variables.userData,
        'logs',
        app?.isPackaged ? 'prod' : 'dev',
        datePath,
        SESSION_ID,
        fileName
      )
    }

    log.transports.file.format = electronLogMessageFormat
    // Optionally, set the level for file transport
    // log.transports.file.level = 'info';
  }
} catch (error) {
  console.error('🚨🚨 Failed to initialize logger file transport:', error)
}

log.transports.console.format = electronLogMessageFormat
// Optionally, set the level for console transport
// log.transports.console.level = 'info';

log.scope.labelPadding = false

export default log
