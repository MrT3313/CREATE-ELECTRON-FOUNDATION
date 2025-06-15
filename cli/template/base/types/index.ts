export * from './jsonplaceholder'
export * from './resource'

export type ElectronResponse<T> = T | { error: { msg: string } }
