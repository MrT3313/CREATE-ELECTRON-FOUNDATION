import React, { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  // HOOKS
  const router = useRouter()
  const {
    data: resources,
    isLoading,
    error: fetchError,
  } = useGetResources({
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
    <div className="page">
      <div className="container">
        <h1>Welcome to Electron Example</h1>

        <button
          className="btn"
          onClick={() => router.navigate({ to: '/settings' })}
        >
          Utility Processes
        </button>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        {/* User List */}
        <div className="card">
          <h2>User List</h2>
          {isLoading ? (
            <div className="loading-message">Loading users...</div>
          ) : resources ? (
            resources?.map((resource) => (
              <div>
                <p className="font-medium">{resource.user_id}</p>
                <p className="text-sm text-gray-600">{resource.id}</p>
                <p className="text-sm text-gray-600">{resource.title}</p>
                <p className="text-sm text-gray-600">{resource.body}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No users found. Add your first user above!
            </p>
          )}
        </div>

        <div className="env-info">
          <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
          <p>NODE_ENV: {window.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}
