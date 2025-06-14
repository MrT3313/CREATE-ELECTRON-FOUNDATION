import type { PlaceholderJsonPost } from './jsonplaceholder'

// when we are going outside Electron - regardless of configuration
export interface APIResource extends PlaceholderJsonPost {}

// what we store in the database  - when DB is used
interface DBResourceBase {
  title: string
  body: string
  user_id: number
}
export interface NewDBResource extends DBResourceBase {} // ex: PREP for insert
export interface DBResource extends NewDBResource {
  // ex: result from fetch
  id: number
}
