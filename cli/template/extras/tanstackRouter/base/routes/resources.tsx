import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'

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
  } = useGetResources({
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

      {/* Resource List */}
      <div className="container scrollable" style={{ maxHeight: '400px', justifyContent: 'flex-start' }}>
        <h2>Resource List</h2>
        {isLoading ? (
          <div className="loading-message">Loading resources...</div>
        ) : resources ? (
          resources?.length > 0 ? resources?.map((resource) => (
            <div className={cx('flex flex-col')}>
              <p className="font-medium">{`IDs : ${resource.user_id} - ${resource.id}`}</p>
              <p className="text-sm text-gray-600">{`Title: ${resource.title}`}</p>
              <p className="text-sm text-gray-600">{`Body: ${resource.body}`}</p>
            </div>
          )) : (
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
