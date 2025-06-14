import { useQuery, useMutation } from '@tanstack/react-query'

import { APIResource, DBResource, NewDBResource } from '../../types/resource'

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

export const useGetDBResource = ({ id }: { id: string }) => {
  return useQuery<DBResource>({
    queryKey: ['db-resource', id],
    queryFn: async () => {
      const response = await window.api.getDBResourceById(id)
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
    queryKey: ['db-resources'],
    queryFn: async () => {
      const response = await window.api.getDBResourceList()
      if (response.error) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
    enabled,
  })
}

export const useInsertDBResource = () => {
  return useMutation({
    mutationFn: async ({ data }: { data: NewDBResource }) => {
      const response = await window.api.insertDBResource({ data })
      if (response.error) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
  })
}

export const useDeleteDBResourceById = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const response = await window.api.deleteDBResourceById({ id })
      if (response.error) {
        throw new Error(response.error.msg)
      }
      return response.data
    },
  })
}
