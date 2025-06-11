declare global {
  interface Window {
    // ipcRenderer: IpcRenderer
    api: {
      getResource: (id: number) => Promise<Resource>
      getResources: () => Promise<{ data: Resource[] }>
    }
    db: {
      getResource: (id: number) => Promise<Resource>
      getResources: () => Promise<Resource[]>
    }
    env: {
      CUSTOM_ENV_VAR: string
      NODE_ENV: string
    }
  }
}
