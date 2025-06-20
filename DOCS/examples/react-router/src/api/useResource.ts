// REACT QUERY
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

// TYPES
import type {
  APIResource,
  DBResource,
  NewAPIResource,
  ElectronResponse,
} from '../../types'

// API ########################################################################
export const useGetAPIResource = ({ id }: { id: number }) => {
  return useQuery<DBResource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response: ElectronResponse<APIResource> =
        await window.api.getAPIResourceById(id)
      if ('error' in response) {
        throw new Error(response.error.msg)
      }

      return {
        ...response,
        user_id: response.userId,
      }
    },
    enabled: !!id,
  })
}

export const useGetAPIResourceList = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  return useQuery<DBResource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const response: ElectronResponse<APIResource[]> =
        await window.api.getAPIResourceList()
      if ('error' in response) {
        throw new Error(response.error.msg)
      }

      return response.map((resource) => ({
        ...resource,
        user_id: resource.userId,
      }))
    },
    enabled,
  })
}

export const useInsertAPIResource = () => {
  return useMutation<DBResource, Error, NewAPIResource>({
    mutationFn: async (resource: NewAPIResource) => {
      const response: ElectronResponse<DBResource> =
        await window.api.insertAPIResource(resource)
      if ('error' in response) {
        throw new Error(response.error.msg)
      }

      return response
    },
  })
}

export const useDeleteAPIResource = () => {
  return useMutation<DBResource, Error, number>({
    mutationFn: async (id: number) => {
      const response: ElectronResponse<DBResource> =
        await window.api.deleteAPIResourceById(id)
      if ('error' in response) {
        throw new Error(response.error.msg)
      }

      return response
    },
  })
}
