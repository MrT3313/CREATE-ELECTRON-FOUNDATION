export interface NewAPIResource {
  userId: number
  title: string
  body: string
}
export interface APIResource extends NewAPIResource {
  id: number
}
