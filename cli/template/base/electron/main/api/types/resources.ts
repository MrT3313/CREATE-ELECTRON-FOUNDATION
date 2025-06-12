export type ResourceBase = {
  title: string
  body: string
  user_id: number
}

export type NewResource = ResourceBase
export type Resource = ResourceBase & {
  id: number
}
