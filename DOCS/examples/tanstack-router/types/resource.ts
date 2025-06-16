interface NewDBResource {
  title: string
  body: string
  user_id: number
}
export interface DBResource extends NewDBResource {
  id: number
}
