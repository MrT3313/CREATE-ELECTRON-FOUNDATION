import { useQuery } from '@tanstack/react-query'

import { Resource } from '../../types/resource'

export const useGetResource = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery<Resource>({
    queryKey: ['resource'],
    queryFn: () => {
      return fetch('https://jsonplaceholder.typicode.com/posts/1').then((res) =>
        res.json()
      )
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2, // retry 2 times
    refetchOnWindowFocus: false, // don't refetch when window regains focus
    refetchOnMount: false, // don't refetch when component mounts
    refetchOnReconnect: false, // don't refetch when component reconnects
    refetchInterval: 1000 * 60 * 5, // refetch every 5 minutes
    refetchIntervalInBackground: false, // don't refetch in background
  })
}
