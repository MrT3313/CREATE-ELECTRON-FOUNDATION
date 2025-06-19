import { db } from '../dbConnect.js'
import {
  resources,
  Resource,
  ResourceCreatePayload,
  NewResource,
  isResourceCreatePayload,
} from '../schema/resources.js'
import { eq, sql } from 'drizzle-orm'
import { nanoid } from 'nanoid'

/**
 * Service class for resource data operations.
 * Methods in this class are responsible for database interactions and
 * should throw errors on failure. The calling layer (e.g., IPC handlers)
 * is responsible for catching these errors and formatting the API response.
 */
export class ResourceServices {
  /**
   * Get all resources from the database.
   * @throws Will throw an error if the database query fails.
   */
  static async getResourceList(): Promise<Resource[]> {
    try {
      return await db.select().from(resources)
    } catch (error) {
      console.error('Error getting resource list:', error)
      throw new Error('Failed to retrieve resources.')
    }
  }

  /**
   * Get a resource by its ID.
   * @param id - Resource ID to retrieve.
   * @returns The resource if found, otherwise undefined.
   * @throws Will throw an error if the ID is not provided or if the query fails.
   */
  static async getResourceById(id: string): Promise<Resource | undefined> {
    if (!id) {
      throw new Error('Resource ID is required.')
    }
    try {
      return await db.select().from(resources).where(eq(resources.id, id)).get()
    } catch (error) {
      console.error(`Error getting resource by id ${id}:`, error)
      throw new Error('Failed to retrieve resource.')
    }
  }

  /**
   * Create a new resource in the database.
   * @param data - Resource data to insert.
   * @returns An object with the ID of the created resource.
   * @throws Will throw an error if data is invalid or if the insertion fails.
   */
  static async createResource(
    data: ResourceCreatePayload
  ): Promise<{ id: string }> {
    if (!isResourceCreatePayload(data)) {
      throw new Error('Invalid resource data format.')
    }

    try {
      const newResource: NewResource = { ...data, id: nanoid(10) }
      const result = await db
        .insert(resources)
        .values(newResource)
        .returning({ id: resources.id })
        .get()

      if (!result) {
        throw new Error('Resource creation failed.')
      }
      return result
    } catch (error) {
      console.error('Error creating resource:', error)
      throw new Error('Failed to create resource.')
    }
  }

  /**
   * Delete a resource by its ID.
   * @param id - Resource ID to delete.
   * @returns True if a resource was deleted, false otherwise.
   * @throws Will throw an error if the ID is not provided or if the deletion fails.
   */
  static async deleteResourceById(id: string): Promise<boolean> {
    if (!id) {
      throw new Error('Resource ID is required.')
    }
    try {
      const result = await db
        .delete(resources)
        .where(eq(resources.id, id))
        .returning({ id: resources.id })
        .get()
      return !!result
    } catch (error) {
      console.error(`Error deleting resource by id ${id}:`, error)
      throw new Error('Failed to delete resource.')
    }
  }

  /**
   * Search resources by title (case-insensitive).
   * @param searchTerm - Term to search for in resource titles.
   * @returns An array of matching resources.
   * @throws Will throw an error if the database query fails.
   */
  static async searchResourcesByTitle(searchTerm: string): Promise<Resource[]> {
    if (!searchTerm?.trim()) {
      return []
    }
    try {
      return await db
        .select()
        .from(resources)
        .where(
          sql`LOWER(${resources.title}) LIKE LOWER('%' || ${searchTerm} || '%')`
        )
    } catch (error) {
      console.error('Error searching resources:', error)
      throw new Error('Failed to search for resources.')
    }
  }
}
