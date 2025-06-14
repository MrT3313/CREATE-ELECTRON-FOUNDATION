export type PlaceholderJsonPostBase = {
  userId: number // NOT UNIQUE
  id: number // UNIQUE
  title: string
  body: string
}

export interface NewPlaceholderJsonPost extends PlaceholderJsonPostBase {} // ex: PREP for insert
export interface PlaceholderJsonPost extends NewPlaceholderJsonPost {
  // ex: result from fetch
  id: number
}