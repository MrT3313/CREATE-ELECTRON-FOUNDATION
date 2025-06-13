import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import cx from 'classnames'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'

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
    <div className={cx('page')}>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className={cx(
          "container scrollable", 
          'justify-start','bg-white', 
          'max-h-[400px]'
        )}
      >
        <h2 className="text-xl font-semibold mb-4">Resource List</h2>
        {isLoading ? (
          <p>Loading resources...</p>
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

export default Resources
