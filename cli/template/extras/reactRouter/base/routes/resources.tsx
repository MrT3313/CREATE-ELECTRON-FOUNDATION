import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'
import cx from 'classnames'

export function Resources() {
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
      homepageLogger.error('Failed to load resources:', fetchError)
      setError('Failed to load resources. Check the logs for details.')
    }
  }, [fetchError])

  return (
    <div className="page">
      {error && <div className="error-message">{error}</div>}

      <div className={cx('hero')}>
        <h1>Resource List</h1>
      </div>

      <br />

      {/* Resource List */}
      <div
        className="container scrollable"
        style={{
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          maxHeight: '400px',
        }}
      >
        {isLoading ? (
          <div className="loading-message">Loading resources...</div>
        ) : resources ? (
          resources?.length > 0 ? (
            resources?.map((resource) => (
              <div className={cx('item')}>
                <p className="font-medium">{`IDs : ${resource.userId} - ${resource.id}`}</p>
                <p className="text-sm text-gray-600">{`Title: ${resource.title}`}</p>
                <p className="text-sm text-gray-600">{`Body: ${resource.body}`}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No resources found. Add your first resource above!
            </p>
          )
        ) : (
          <p className="text-gray-500">
            No resources found. Add your first resource above!
          </p>
        )}
      </div>
    </div>
  )
}

export default Resources
