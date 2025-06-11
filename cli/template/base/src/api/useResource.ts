import { useQuery } from '@tanstack/react-query'

import { Resource } from '../../types/resource'

export const useGetResource = ({ id }: { id: string }) => {
  return useQuery<Resource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response = await window.api.getResource(id)
      if (response.error) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
    enabled: !!id,
  })
}

export const useGetResources = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const response = await window.api.getResources()
      if (response.error) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
    enabled,
  })
}