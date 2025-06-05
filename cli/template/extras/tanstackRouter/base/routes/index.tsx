import React, { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
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
          ) : usersResponse ? (
            <div className="user-info">
              <h3>{usersResponse.userId}</h3>
              <div className="user-details">
                <p>ID: {usersResponse.id}</p>
                <p>Title: {usersResponse.title}</p>
                <p>Body: {usersResponse.body}</p>
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              No users found. Add your first user above!
            </div>
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
