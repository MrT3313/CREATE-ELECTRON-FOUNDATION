import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache & Staleness
      staleTime: 0, // Time in ms after data is considered stale
      gcTime: 1000 * 60 * 5, // Garbage collection time (5 minutes)

      // Network & Retry
      networkMode: 'online', // 'online' | 'always' | 'offlineFirst'
      retry: 3, // Number of retry attempts or function
      retryOnMount: true, // Retry on component mount if query failed
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetching Behavior
      refetchOnMount: true, // Refetch on mount if data is stale
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnecting to network
      refetchInterval: false, // Auto refetch interval in ms
      refetchIntervalInBackground: false, // Continue refetching when tab not active

      // Query Function Behavior
      queryFn: undefined, // Default query function
      enabled: true, // Whether query should execute automatically

      // Structure Control
      structuralSharing: true, // Structural sharing for nested data

      // Suspense & Error Boundaries (React)
      suspense: false, // Enable suspense mode
      useErrorBoundary: false, // Throw errors to error boundary

      // Callbacks
      onError: undefined, // Called when query encounters error
      onSuccess: undefined, // Called when query succeeds
      onSettled: undefined, // Called when query settles (success or error)

      // Advanced
      select: undefined, // Transform/select data
      initialData: undefined, // Initial data for the cache
      initialDataUpdatedAt: undefined, // Timestamp of initial data
      placeholderData: undefined, // Placeholder data while loading
      keepPreviousData: false, // Keep previous data while fetching new

      // Meta
      meta: undefined, // Store additional information about query
    },

    mutations: {
      // Network & Retry
      networkMode: 'online', // 'online' | 'always' | 'offlineFirst'
      retry: 0, // Number of retry attempts
      retryDelay: (attemptIndex: number) =>
        Math.min(1000 * 2 ** attemptIndex, 30000),

      // Suspense & Error Boundaries
      useErrorBoundary: false, // Throw errors to error boundary

      // Callbacks
      onError: undefined, // Called when mutation encounters error
      onSuccess: undefined, // Called when mutation succeeds
      onSettled: undefined, // Called when mutation settles
      onMutate: undefined, // Called before mutation function

      // Meta
      meta: undefined, // Store additional information about mutation
    },
  },
})
