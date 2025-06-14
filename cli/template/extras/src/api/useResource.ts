import { useQuery } from '@tanstack/react-query'

import { APIResource, DBResource } from '../../types/resource'

export const useGetAPIResource = ({ id }: { id: number }) => {
  return useQuery<DBResource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response: APIResource = await window.api.getAPIResource(id)
      if (response.error) {
        throw new Error(response.error.msg)
      }

      return {
        ...response, 
        user_id: response.userId
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
      const response: APIResource[] = await window.api.getAPIResourceList()
      if (response.error) {
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

export const useGetDBResource = ({ id }: { id: number }) => {
  return useQuery<DBResource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const response: DBResource = await window.db.getResource(id)
      if (response.error) {
        throw new Error(response.error.msg)
      }

      return response.data
    },
    enabled: !!id,
  })
}

export const useGetDBResourceList = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  return useQuery<DBResource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const response: DBResource[] = await window.db.getResources()   
      if (response.error) {
        throw new Error(response.error.msg)
      }

      return response.data
    },
    enabled,
  })
}
