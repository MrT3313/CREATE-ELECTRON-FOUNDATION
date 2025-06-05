import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import cx from 'classnames'
import log from 'electron-log/renderer'

const utilityProcessLogger = log.scope('settings')

export function Settings() {
  const [error, setError] = useState<string | null>(null)
  const [isCounterRunning, setIsCounterRunning] = useState<boolean>(false)
  const [isRngRunning, setIsRngRunning] = useState<boolean>(false)

  const navigate = useNavigate()
  return (
    <div
      className={cx(
        'flex flex-col items-center w-full py-8 px-4 overflow-y-auto'
      )}
    >
      <h1 className="text-2xl font-bold text-white text-center">Settings</h1>

      <div className={cx('flex flex-col', 'gap-2')}>
        <button
          className={cx(
            'border border-white p-2 m-2 rounded-md hover:bg-blue-600 text-white transition-colors'
          )}
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </div>
    </div>
  )
}

export default Settings
