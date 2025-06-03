import { app, BrowserWindow, shell, ipcMain, utilityProcess } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import os from 'node:os'
import dotenv from 'dotenv'
import log from './logger/index'
import { SESSION_ID } from './utils/consts'
import { nanoid } from 'nanoid'
import { dbInit } from './db/dbInit'

const mainLogger = log.scope('main/index.ts')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import assert from 'node:assert'

// CONFIGURE: environment variables ###########################################
const isProd = app?.isPackaged
const envPath = isProd ? `.env.production` : `.env.development`

// Attempts to load an environment file from the paths determined by getEnvPaths.
// It stops at the first valid .env file found.
let envLoaded = false

try {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath })
    envLoaded = true
  }
} catch (err) {
  mainLogger.error(`No environment file found at:`, envPath)
  process.exit(1)
}

// Sets up essential environment variables for paths used throughout the application.
// APP_ROOT: The root directory of the application.
// DIST: The directory containing the bundled front-end code for the renderer process.
// VITE_PUBLIC: The directory for static public assets. In development, this points to 'public',
//              and in production, it points to the 'dist' directory.
process.env.APP_ROOT = path.join(__dirname, '../..')
process.env.DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : process.env.DIST

assert(!!process.env.APP_ROOT, 'APP_ROOT is not set')
assert(!!process.env.DIST, 'DIST is not set')
assert(!!process.env.VITE_PUBLIC, 'VITE_PUBLIC is not set')

// CONFIGURE: preload script ##################################################
// Defines the path to the preload script.
// The preload script runs in a privileged environment and can bridge the gap
// between the sandboxed renderer process and the Node.js environment of the main process.
const preloadPath = path.join(__dirname, '../preload/index.js')

// CONFIGURE: main window #####################################################
const webPreferences = {
  preload: preloadPath,
  // enables Node.js integration in the renderer process. 
  // This should be used with caution as it can pose security risks. 
  //    > 👀 just keep it disabled.
  nodeIntegration: false,
  // context isolation creates a separate JavaScript context for the preload script.
  // This is a security measure that helps prevent the preload script from leaking privileged APIs
  // to the renderer process's untrusted web content. It is highly recommended to keep this true.
  //    > 👀 just keep it on
  contextIsolation: true,
}
let win: BrowserWindow | null = null
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC!, 'favicon.ico'),
    webPreferences,
  })

  // CONFIGURE: main window dev tools #########################################
  if (process.env.NODE_ENV !== 'production') {
    win.webContents.openDevTools()
  }

  // CONFIGURE: web links #####################################################
  // This handler ensures that external links (starting with "https:")
  // are opened in the system's default web browser instead of a new Electron window.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // CONFIGURE ERROR HANDLING #################################################
  // Handles the event where the renderer process crashes.
  win.webContents.on('render-process-gone', (event, details) => {
    mainLogger.error(`Renderer process crashed:`, details)
  })

  // Handles the event where the window fails to load content.
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    mainLogger.error(`Failed to load:`, { errorCode, errorDescription })
  })

  // CONFIGURE: content loading ###############################################
  // If a Vite development server URL is available (development mode), it loads that URL.
  // Otherwise (production mode), it attempts to load the local index.html file from the 'dist' directory.
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    const indexPath = path.join(process.env.DIST!, 'index.html')
    if (fs.existsSync(indexPath)) {      
      win.loadFile(indexPath)
    } else {
      mainLogger.error(`Index file not found at: ${indexPath}. This is the expected location for the production build.`)

      const errorHtml = `
        <html>
          <body style="background: #f44336; color: white; font-family: sans-serif; padding: 20px; text-align: center;">
            <h1>Application Error</h1>
            <p>Could not load the application's main page (index.html).</p>
            <p>The file was not found in the expected directory:</p>
            <p><code>${process.env.DIST}</code></p>
            <p>Please ensure the application has been built correctly and all necessary files are present.</p>
          </body>
        </html>
      `
      win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
    }
  }
}

// CONFIGURE: app ready #######################################################
app.whenReady().then(async () => {
  mainLogger.info('🎉🎉 App is ready')
  try {
    // INITIALIZE: database ###################################################
    await dbInit()

    // Creates the main application window after the database is initialized.
    await createWindow()  
  } catch (error) {
    mainLogger.error('🚨🚨 Failed to initialize application:', error)
    app.quit()
  }
})

// CONFIGRE: app events #######################################################

// Handles the 'activate' event, which is typically triggered when the application's
// icon is clicked in the dock (macOS) and there are no windows open.
// It creates a new window if none exist.
app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    // If windows exist, focus on the first one
    allWindows[0].focus()
  } else {
    // If no windows exist, create a new one.
    createWindow()
  }
})

// Handles the 'window-all-closed' event, which is triggered when all application windows are closed.
// It quits the application, except on macOS where applications typically stay active
// even without open windows.
app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

// Handles the 'second-instance' event, which is triggered when a user tries to open
// a second instance of the application while one is already running.
// It focuses the existing main window instead of creating a new one.
app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

// CONFIGURE: IPC HANDLERS ####################################################

// Sets up an IPC (Inter-Process Communication) handler for the 'open-win' channel.
// This allows the renderer process to request the main process to open a new window.
// The 'arg' parameter can be used to pass data (e.g., a URL or route) to the new window.
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences,
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(path.join(process.env.DIST, 'index.html'), { hash: arg })
  }
})
