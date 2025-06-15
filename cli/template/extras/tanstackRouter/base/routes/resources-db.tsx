import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetDBResourceList } from '../api/index'
import { NewDBResourceForm } from '../components/NewDBResourceForm'

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
    <div className="page">
      {error && <div className="error-message">{error}</div>}

      <div className={cx('hero', 'glass')}>
        <h1>Resource List</h1>
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
