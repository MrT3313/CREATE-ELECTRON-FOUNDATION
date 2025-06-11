import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'

export function Index() {
  const navigate = useNavigate()
  const {
    data: resources,
    isLoading,
    error: fetchError,
  } = useGetResources({
    enabled: true,
  })
  const [error, setError] = useState<string | null>(null)

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

        <button className="btn" onClick={() => navigate('/settings')}>
          Settings
        </button>

        {error && <div className="error-message">{error}</div>}

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
          <p>
            <strong>CUSTOM_ENV_VAR:</strong> {window.env.CUSTOM_ENV_VAR}
          </p>
          <p>
            <strong>NODE_ENV:</strong> {window.env.NODE_ENV}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Index
