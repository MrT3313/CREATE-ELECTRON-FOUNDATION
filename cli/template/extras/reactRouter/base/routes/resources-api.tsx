import React, { useEffect, useState } from 'react'
import cx from 'classnames'

// REACT QUERY
import { useGetAPIResourceList } from '../api/index'

export function Resources() {
  const {
    data: resources,
    isLoading,
    isError,
    error: fetchError,
  } = useGetAPIResourceList({
    enabled: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fetchError) {
      console.error('Failed to load resources:', fetchError)
      setError('Failed to load resources. Check the logs for details.')
    }
  }, [fetchError])

  return (
    <div className="page">
      {error && <div className="error-message">{error}</div>}

      <div className={cx('hero', 'glass')}>
        <h1>API Resource List</h1>
        <span>
          This is using the{' '}
          <a
            href="https://jsonplaceholder.typicode.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontStyle: 'italic',
              textDecoration: 'underline',
            }}
          >
            JSON Placeholder API
          </a>
        </span>
      </div>

      <br />

      {/* Resource List */}
      <div
        className="container scrollable"
        style={{
          justifyContent: 'flex-start',
          backgroundColor: 'white',
          maxHeight: '300px',
        }}
      >
        {isLoading ? (
          <div className="loading-message">Loading resources...</div>
        ) : isError ? (
          <p className="text-gray-500">Error loading resources</p>
        ) : resources ? (
          resources?.length > 0 ? (
            resources?.map((resource) => (
              <div key={resource.id} className={cx('item')}>
                <p style={{ fontWeight: '500' }}>{`IDs : ${resource.user_id} - ${resource.id}`}</p>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>{`Title: ${resource.title}`}</p>
                <p style={{ fontSize: '14px', color: '#4b5563' }}>{`Body: ${resource.body}`}</p>
              </div>
            ))
          ) : (
            <p style={{ color: '#4b5563' }}>
              No resources found. Add your first resource above!
            </p>
          )
        ) : (
          <p style={{ color: '#4b5563' }}>
            No resources found. Add your first resource above!
          </p>
        )}
      </div>

      <br />
    </div>
  )
}

export default Resources
