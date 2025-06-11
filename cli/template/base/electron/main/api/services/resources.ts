import { response } from '../../utils/response'

// TYPES
import { PlaceholderJsonPosts, PlaceholderJsonPost } from '../types'

export class resourceServices {
  static async getResourceList() {
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts`)
      if (!res.ok) {
        return response.error({ msg: 'Failed to fetch resources' })
      }
      const data: PlaceholderJsonPosts = await res.json()
      return response.ok({ data })
    } catch (error) {
      return response.error({ msg: `Error getting resource: ${error.message}` })
    }
  }

  static async getResourceById(id: string) {
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/posts/${id}`
      )
      if (!res.ok) {
        return response.error({ msg: `Resource with id ${id} not found` })
      }
      const data: PlaceholderJsonPost = await res.json()
      return response.ok({ data })
    } catch (error) {
      return response.error({ msg: `Error getting resource: ${error.message}` })
    }
  }
}
