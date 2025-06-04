import { useQuery } from '@tanstack/react-query'

import { Resource } from '../../types/resource'

export const useGetResource = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  return useQuery<Resource>({
    queryKey: ['resource'],
    queryFn: async () => {
      try {
        const response = await window.ipcRenderer.invoke('db/resource/getResource')
        return response
      } catch (err) {
        throw err
      }
    },
    enabled: !!enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // retry 2 times
    refetchOnWindowFocus: false, // don't refetch when window regains focus
    refetchOnMount: false, // don't refetch when component mounts
    refetchOnReconnect: false, // don't refetch when component reconnects
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
    refetchIntervalInBackground: false, // don't refetch in background
  })
}

export const useGetResources = ({
  enabled = true,
}: {
  enabled?: boolean
}) => {
  return useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      try {
        const response = await window.ipcRenderer.invoke('db/resource/getList')
        return response
      } catch (err) {
        throw err
      }
    },
    enabled: !!enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // retry 2 times
    refetchOnWindowFocus: false, // don't refetch when window regains focus
    refetchOnMount: false, // don't refetch when component mounts
    refetchOnReconnect: false, // don't refetch when component reconnects
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
    refetchIntervalInBackground: false, // don't refetch in background
  })
}