import React, { useEffect, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import cx from 'classnames'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetAPIResourceList } from '../api/index'

export const Route = createFileRoute('/resources')({
  component: Resources,
})

export function Resources() {
  // HOOKS
  const {
    data: resources,
    isLoading,
    error: fetchError,
  } = useGetAPIResourceList({
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
        className={cx(
          'container scrollable',
          'justify-start',
          'bg-white',
          'max-h-[300px]'
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

      <br />
    </div>
  )
}
