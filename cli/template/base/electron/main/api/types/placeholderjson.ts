export type PlaceholderJsonPost = {
  userId: number // NOT UNIQUE
  id: number // UNIQUE
  title: string
  body: string
}
export type PlaceholderJsonPosts = PlaceholderJsonPost[]

export type PlaceholderJsonUser = {
  id: number // UNIQUE
  name: string
  username: string
  email: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  phone: string
  website: string
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}
export type PlaceholderJsonUsers = PlaceholderJsonUser[]
