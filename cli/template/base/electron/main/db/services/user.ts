import { asc, between, count, eq, getTableColumns, sql } from 'drizzle-orm'
import { db } from '../dbConnect'
import { users } from '../schema'
import { response } from '../../utils/response'
import log from '../../logger/index'

// CONFIGURE: logger ##########################################################
const userServiceLogger = log.scope('db/services/user')

export class userServices {
  static async getUserById(id: number) {
    try {
      const info = await db.select().from(users).where(eq(users.id, id))
      if(!info || info.length === 0){
        return response.error({msg:'User does not exist'})
      }
      return response.ok({data:info[0]})
    } catch (error) {
      return response.error({msg: `Error getting user: ${error.message}`})
    }
  }

  static async updateUserById(id: number, data: any) {
    try {
      const result = db.transaction(() => {
        return db.update(users)
          .set(data)
          .where(eq(users.id, id))
          .run();
      });
      
      if (!result || result.changes === 0) {
        return response.error({msg: 'User update failed - no rows affected'});
      }
      
      return response.ok();
    } catch (error) {
      return response.error({msg: `Error updating user: ${error.message}`});
    }
  }
  
  static async insertUser(data: any) {
    try {
      // Prepare the data with timestamps
      const now = new Date();
      const insertData = {
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      const result = db.transaction(() => {
        return db.insert(users)
          .values(insertData)
          .run();
      });
      
      if (!result || !result.lastInsertRowid) {
        return response.error({msg: 'User insert failed'});
      }
      
      return response.ok({data: {id: result.lastInsertRowid}});
    } catch (error) {
      return response.error({msg: `Error inserting user: ${error.message}`});
    }
  }

  static async getUserList() {
    try {
      const list = await db.select().from(users)
      return response.ok({data: list || []})
    } catch (error) {
      return response.error({msg: `Error getting user list: ${error.message}`})
    }
  }

  static async deleteUserById(id: number) {
    try {
      const result = db.transaction(() => {
        return db.delete(users)
          .where(eq(users.id, id))
          .run();
      });
      
      if (!result || result.changes === 0) {
        return response.error({msg: 'User deletion failed - no rows affected'});
      }
      
      return response.ok();
    } catch (error) {
      return response.error({msg: `Error deleting user: ${error.message}`});
    }
  }
}
