import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import log from '../lib/logger';
const homepageLogger = log.scope('homepage');
import { useGetResource } from '../api/index'

export function Index() {
  const navigate = useNavigate()
  const { data: usersResponse, isLoading, error: fetchError } = useGetResource({
    enabled: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fetchError) {
      homepageLogger.error('Failed to load users:', fetchError);
      setError('Failed to load users. Check the logs for details.')
    }
  }, [fetchError])
  
  return (
    <div className="page">
      <div className="container">
        <h1>Welcome to Electron Example</h1>
        
        <button 
          className="btn"
          onClick={() => navigate('/settings')}
        >
          Settings
        </button>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="card">
          <h2>User List</h2>
          {isLoading ? (
            <div className="loading-message">Loading users...</div>
          ) : usersResponse ? (
            <div className="user-info">
              <h3>{usersResponse.title}</h3>
              <div className="user-details">
                <p><strong>User ID:</strong> {usersResponse.userId}</p>
                <p><strong>ID:</strong> {usersResponse.id}</p>
                <p>{usersResponse.body}</p>
              </div>
            </div>
          ) : (
            <div className="no-data-message">
              No users found. Add your first user above!
            </div>
          )}
        </div>
        
        <div className="env-info">
          <p><strong>CUSTOM_ENV_VAR:</strong> {window.env.CUSTOM_ENV_VAR}</p>
          <p><strong>NODE_ENV:</strong> {window.env.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}

export default Index