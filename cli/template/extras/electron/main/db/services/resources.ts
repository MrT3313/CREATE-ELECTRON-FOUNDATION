import { db } from '../dbConnect'
import { resources } from '../schema'
import { response } from '../../utils/response'
import { eq } from 'drizzle-orm'
export class resourceServices {
  static async getDBResourceList() {
    try {
      const list = await db.select().from(resources)
      return response.ok({ data: list || [] })
    } catch (error) {
      return response.error({
        msg: `Error getting resource list: ${error.message}`,
      })
    }
  }

  static async getDBResourceById(id: string) {
    try {
      const numericId = parseInt(id, 10)
      if (isNaN(numericId)) {
        return response.error({ msg: 'Invalid resource ID' })
      }
      const info = await db
        .select()
        .from(resources)
        .where(eq(resources.id, numericId))
      if (!info || info.length === 0) {
        return response.error({ msg: 'Resource does not exist' })
      }
      return response.ok({ data: info[0] })
    } catch (error) {
      return response.error({ msg: `Error getting resource: ${error.message}` })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async insertDBResource(data: any) {
    try {
      // Prepare the data with timestamps
      const now = new Date()
      const insertData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      }

      const result = db.transaction(() => {
        return db.insert(resources).values(insertData).run()
      })

      if (!result || !result.lastInsertRowid) {
        return response.error({ msg: 'Resource insert failed' })
      }

      return response.ok({ data: { id: result.lastInsertRowid } })
    } catch (error) {
      return response.error({
        msg: `Error inserting resource: ${error.message}`,
      })
    }
  }

  static async deleteDBResourceById(id: string) {
    try {
      const numericId = parseInt(id, 10)
      if (isNaN(numericId)) {
        return response.error({ msg: 'Invalid resource ID' })
      }
      const result = db.transaction(() => {
        return db.delete(resources).where(eq(resources.id, numericId)).run()
      })

      if (!result || result.changes === 0) {
        return response.error({
          msg: 'Resource deletion failed - no rows affected',
        })
      }

      return response.ok()
    } catch (error) {
      return response.error({
        msg: `Error deleting resource: ${error.message}`,
      })
    }
  }
}
