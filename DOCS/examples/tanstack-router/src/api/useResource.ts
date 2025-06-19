// REACT QUERY
import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'

// TYPES
import type { APIResource, NewAPIResource, ElectronResponse } from '../../types'

function isErrorResponse<T>(
  response: ElectronResponse<T>
): response is { error: { msg: string } } {
  return (response as { error: { msg: string } }).error !== undefined
}

// API ########################################################################
export const useGetAPIResource = ({ id }: { id: number }) => {
  return useQuery<APIResource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response = await window.api.getAPIResourceById(id)
      if (isErrorResponse(response)) {
        throw new Error(response.error.msg)
      }
      return response
    },
    enabled: !!id,
  })
}

export const useGetAPIResourceList = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  return useQuery<APIResource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await window.api.getAPIResourceList()
      if (isErrorResponse(response)) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
    enabled,
  })
}

export const useInsertAPIResource = () => {
  return useMutation<APIResource, Error, NewAPIResource>({
    mutationFn: async (resource: NewAPIResource) => {
      const response = await window.api.insertAPIResource(resource)
      if (isErrorResponse(response)) {
        throw new Error(response.error.msg)
      }
      return response
    },
  })
}

export const useDeleteAPIResource = () => {
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await window.api.deleteAPIResourceById(id)
    },
  })
}
