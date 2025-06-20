import React, { useEffect, useState } from 'react'
import cx from 'classnames'

// REACT QUERY
import { useGetDBResourceList } from '../api/index'
import { NewDBResourceForm } from '../components/NewDBResourceForm'

export function Resources() {
  const {
    data: resources,
    isLoading,
    isError,
    error: fetchError,
  } = useGetDBResourceList({
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
        <h1>DB Resource List</h1>
        <span>This is fetching from the SQLite database.</span>
        <span>
          The api to fetch data from an external API is still in the code.
        </span>
      </div>

      <br />

      <NewDBResourceForm />

      <br />

      {/* Resource List */}
      <div
        className={cx(
          'container scrollable',
          'justify-start',
          'bg-white',
          'max-h-[300px]'
        )}
      >
        {isLoading ? (
          <div className="loading-message">Loading resources...</div>
        ) : isError ? (
          <p>Error loading resources</p>
        ) : resources ? (
          resources?.length > 0 ? (
            resources?.map((resource) => (
              <div key={resource.id} className={cx('item')}>
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

      <br />
    </div>
  )
}

export default Resources
