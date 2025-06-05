import { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import cx from 'classnames'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResource } from '../api/index'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  // HOOKS
  const router = useRouter()
  const {
    data: usersResponse,
    isLoading,
    error: fetchError,
  } = useGetResource({
    enabled: true,
  })
  // STATE
  const [error, setError] = useState<string | null>(null)

  // Log any fetch errors
  useEffect(() => {
    if (fetchError) {
      homepageLogger.error('Failed to load users:', fetchError)
      setError('Failed to load users. Check the logs for details.')
    }
  }, [fetchError])

  return (
    <div
      className={cx(
        'flex flex-col items-center w-full py-8 px-4 overflow-y-auto'
      )}
    >
      <h1 className="text-2xl font-bold text-white text-center">
        Welcome to Electron Example
      </h1>

      <div>
        <button
          className={cx(
            'border border-white p-2 m-2 rounded-md hover:bg-blue-600 text-white transition-colors'
          )}
          onClick={() => router.navigate({ to: '/settings' })}
        >
          Utility Processes
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">User List</h2>
        {isLoading ? (
          <p>Loading users...</p>
        ) : usersResponse ? (
          <div>
            <p className="font-medium">{usersResponse.userId}</p>
            <p className="text-sm text-gray-600">{usersResponse.id}</p>
            <p className="text-sm text-gray-600">{usersResponse.title}</p>
            <p className="text-sm text-gray-600">{usersResponse.body}</p>
          </div>
        ) : (
          <p className="text-gray-500">
            No users found. Add your first user above!
          </p>
        )}
      </div>

      <div className="mt-4 text-white text-sm">
        <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
        <p>NODE_ENV: {window.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
