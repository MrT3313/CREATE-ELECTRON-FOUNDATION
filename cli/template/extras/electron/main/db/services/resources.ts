import { db } from '../dbConnect'
import {
  resources,
  Resource,
  ResourceCreatePayload,
  NewResource,
  isResourceCreatePayload,
} from '../schema/resources'
import { response, ApiResponse, isSuccessResponse } from '../../utils/response'
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { Result } from '../../../../types/utility-types'

/**
 * Service class for resource data operations
 * Provides type-safe methods for CRUD operations on resources
 */
export class ResourceServices {
  /**
   * Get all resources from the database
   * @returns Response with all resources or error
   */
  static async getResourceList(): Promise<ApiResponse<Resource[]>> {
    try {
      const list = await db.select().from(resources)
      return response.ok(list || [])
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return response.error(`Error getting resource list: ${errorMessage}`)
    }
  }

  /**
   * Get a resource by its ID
   * @param id - Resource ID to retrieve
   * @returns Response with the resource or error
   */
  static async getResourceById(id: string): Promise<ApiResponse<Resource>> {
    try {
      if (!id) {
        return response.error('Resource ID is required')
      }

      const resource = await db
        .select()
        .from(resources)
        .where(eq(resources.id, id))
        .get()

      if (!resource) {
        return response.notFound('Resource not found')
      }

      return response.ok(resource)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return response.error(`Error getting resource: ${errorMessage}`)
    }
  }

  /**
   * Create a new resource in the database
   * @param data - Resource data to insert
   * @returns Response with the created resource ID or error
   */
  static async createResource(
    data: ResourceCreatePayload
  ): Promise<ApiResponse<{ id: string }>> {
    try {
      if (!data) {
        return response.badRequest('Resource data is required')
      }

      // Validate input data
      if (!isResourceCreatePayload(data)) {
        return response.badRequest('Invalid resource data format')
      }

      // Create a new resource with generated ID
      const newResource: NewResource = {
        ...data,
        id: nanoid(10),
      }

      // Insert the resource
      const result = await db
        .insert(resources)
        .values(newResource)
        .returning()
        .get()

      if (!result) {
        return response.error('Resource creation failed')
      }

      return response.ok({ id: newResource.id })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return response.error(`Error creating resource: ${errorMessage}`)
    }
  }

  /**
   * Delete a resource by its ID
   * @param id - Resource ID to delete
   * @returns Response indicating success or error
   */
  static async deleteResourceById(id: string): Promise<ApiResponse<void>> {
    try {
      if (!id) {
        return response.badRequest('Resource ID is required')
      }

      const result = await db
        .delete(resources)
        .where(eq(resources.id, id))
        .returning({ id: resources.id })
        .get()

      if (!result) {
        return response.notFound('Resource not found or deletion failed')
      }

      return response.ok()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return response.error(`Error deleting resource: ${errorMessage}`)
    }
  }

  /**
   * Search resources by title (case-insensitive)
   * @param searchTerm - Term to search for in resource titles
   * @returns Response with matching resources or error
   */
  static async searchResourcesByTitle(
    searchTerm: string
  ): Promise<ApiResponse<Resource[]>> {
    try {
      if (!searchTerm?.trim()) {
        return response.badRequest('Search term is required')
      }

      // Use SQL LIKE for case-insensitive search
      const searchResults = await db
        .select()
        .from(resources)
        .where(
          sql`LOWER(${resources.title}) LIKE LOWER('%' || ${searchTerm} || '%')`
        )

      return response.ok({ data: searchResults })
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      return response.error({
        msg: `Error searching resources: ${errorMessage}`,
      })
    }
  }

  /**
   * Type-safe helper to safely unwrap an API response
   * @param apiResponse - API response to unwrap
   * @returns A Result object with the unwrapped data or error
   */
  static unwrapResponse<T>(apiResponse: ApiResponse<T>): Result<T, string> {
    if (isSuccessResponse(apiResponse)) {
      return { success: true, value: apiResponse.data }
    } else {
      return {
        success: false,
        error: apiResponse.msg,
      }
    }
  }
}
