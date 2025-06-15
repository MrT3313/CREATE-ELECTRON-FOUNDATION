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
    <div className={cx('page')}>
      {error && <div className="error-message">{error}</div>}

      <div className={cx('hero', 'glass')}>
        <h1 className="text-2xl font-bold">API Resource List</h1>
        <p>
          These resources are fetched from an external API and not stored in any
          database.
        </p>
      </div>

      <br />

      {/* Resource List */}
      <div
        className={cx(
          'container scrollable',
          'justify-start',
          'bg-white',
          'max-h-[400px]'
        )}
      >
        {isLoading ? (
          <div className="loading-message">Loading resources...</div>
        ) : isError ? (
          <p className="text-gray-500">Error loading resources</p>
        ) : resources ? (
          resources?.length > 0 ? (
            resources?.map((resource) => (
              <div
                className="p-4 mb-2 border rounded-md shadow-sm"
                key={resource.id}
              >
                <p className="font-medium">{`IDs : ${resource.user_id} - ${resource.id}`}</p>
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
