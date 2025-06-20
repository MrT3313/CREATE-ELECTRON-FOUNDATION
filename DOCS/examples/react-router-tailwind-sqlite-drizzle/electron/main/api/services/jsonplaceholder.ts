import { response } from '../../utils/response'

const JSONPLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com'

export class jsonPlaceholderServices {
  static async getAPIResourceList() {
    try {
      const response = await fetch(`${JSONPLACEHOLDER_URL}/posts`)
      const data = await response.json()
      return data
    } catch (error) {
      return response.error({
        msg: `Error getting post list: ${error.message}`,
      })
    }
  }
  static async getAPIResourceById(id: number) {
    try {
      const response = await fetch(`${JSONPLACEHOLDER_URL}/posts/${id}`)
      const data = await response.json()
      return data
    } catch (error) {
      return response.error({
        msg: `Error getting post by id: ${error.message}`,
      })
    }
  }
}
