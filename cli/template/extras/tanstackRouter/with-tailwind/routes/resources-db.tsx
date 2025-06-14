import React, { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import cx from 'classnames'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetDBResourceList } from '../api/index'

export const Route = createFileRoute('/resources')({
  component: Resources,
})

export function Resources() {
  // HOOKS
  const router = useRouter()
  const {
    data: resources,
    isLoading,
    error: fetchError,
  } = useGetDBResourceList({
    enabled: true,
  })
  // STATE
  const [error, setError] = useState<string | null>(null)

  // Log any fetch errors
  useEffect(() => {
    if (fetchError) {
      homepageLogger.error('Failed to load resources:', fetchError)
      setError('Failed to load resources. Check the logs for details.')
    }
  }, [fetchError])

  return (
    <div className={cx('page')}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className={cx('hero', 'glass')}>
        <h1>Resource List</h1>
        <span>
          This is fetching from the SQLite database.
        </span>
        <span>
          The api to fetch data from an external API is still in the code.
        </span>
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
          <p>Loading resources...</p>
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
    </div>
  )
}
