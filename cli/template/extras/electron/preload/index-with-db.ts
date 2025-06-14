import { useLoading } from './useLoading'

// This is a preload script. It runs in a privileged environment before the renderer process's web page is loaded.
// It has access to Node.js APIs and can be used to selectively expose functionalities
// to the renderer process via the `contextBridge` API, enhancing security by not exposing all of Node.js directly.
import { ipcRenderer, contextBridge } from 'electron'

// NOTES: removed to be more secure - I am not sure how "secure" even just exposing these are.
//        removing just to be save but keeping for reference later
// Exposes a controlled subset of the `ipcRenderer` module to the renderer process.
// This allows the renderer to send and receive messages to/from the main process
// without having full access to the `ipcRenderer` object, which is a security best practice.
// contextBridge.exposeInMainWorld('ipcRenderer', {
//   on(...args: Parameters<typeof ipcRenderer.on>) {
//     const [channel, listener] = args
//     return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
//   },
//   off(...args: Parameters<typeof ipcRenderer.off>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.off(channel, ...omit)
//   },
//   send(...args: Parameters<typeof ipcRenderer.send>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.send(channel, ...omit)
//   },
//   invoke(...args: Parameters<typeof ipcRenderer.invoke>) {
//     const [channel, ...omit] = args
//     return ipcRenderer.invoke(channel, ...omit)
//   },
// })

contextBridge.exposeInMainWorld('api', {
  getAPIResourceById: (id: number) =>
    ipcRenderer.invoke('api/resource/getAPIResourceById', { id }),
  getAPIResourceList: () =>
    ipcRenderer.invoke('api/resource/getAPIResourceList'),

  insertAPIResource: (id: number) =>
    ipcRenderer.invoke('api/resource/insertAPIResource', { id }),
  deleteAPIResourceById: (id: number) =>
    ipcRenderer.invoke('api/resource/deleteAPIResourceById', { id }),
})

contextBridge.exposeInMainWorld('db', {
  getResource: (id: string) =>
    ipcRenderer.invoke('db/resource/getDBResourceById', { id }),
  getResources: () => ipcRenderer.invoke('db/resource/getDBResourceList'),
})

// Exposes specific environment variables to the renderer process.
contextBridge.exposeInMainWorld('env', {
  CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  NODE_ENV: process.env.NODE_ENV,
})

// A utility function that returns a Promise, resolving when the document's readyState
// matches one of the specified conditions (defaulting to 'complete' or 'interactive').
// This is useful for ensuring that DOM manipulations occur only after the DOM is ready.
function domReady(
  condition: DocumentReadyState[] = ['complete', 'interactive']
) {
  return new Promise((resolve) => {
    if (condition.includes(document.readyState)) {
      resolve(true)
    } else {
      document.addEventListener('readystatechange', () => {
        if (condition.includes(document.readyState)) {
          resolve(true)
        }
      })
    }
  })
}

// Initializes the loading spinner: appends it when the DOM is ready.
// It also sets up a mechanism to remove the loading spinner when a specific 'removeLoading' message
// is received via `window.onmessage` or after a timeout (4999ms).
const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = (ev) => {
  if (ev.data.payload === 'removeLoading') {
    removeLoading()
  }
}

setTimeout(removeLoading, 4999)
