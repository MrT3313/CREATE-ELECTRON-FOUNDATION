import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import cx from 'classnames'
import log from '../lib/logger'
const homepageLogger = log.scope('homepage')
import { useGetResources } from '../api/index'

export function Index() {
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
      <div className={cx('container','gap-0')}>
        <h1>Welcome to <span className={cx('italic')}>your</span></h1>
        <h2>Create Electron Foundation</h2>
      </div>
    </div>
  )
}

export default Index
