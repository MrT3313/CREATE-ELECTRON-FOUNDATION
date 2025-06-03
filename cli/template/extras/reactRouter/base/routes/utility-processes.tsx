import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import log from 'electron-log/renderer'

const utilityProcessLogger = log.scope('utility-processes')

export function Settings() {
  const [error, setError] = useState<string | null>(null)
  const [isCounterRunning, setIsCounterRunning] = useState<boolean>(false)
  const [isRngRunning, setIsRngRunning] = useState<boolean>(false)

  const navigate = useNavigate()
  
  return (
    <div className="page">
      <div className="container">
        <h1>Triggering Utility Process(es)</h1>
        
        <button 
          className="btn"
          onClick={() => navigate('/')}
        >
          Home
        </button>

        <div className="button-group">
          <button 
            className={`btn btn-primary ${isCounterRunning ? 'btn-disabled' : ''}`}
            onClick={async () => {
              setIsCounterRunning(true)
              setError(null)
              try {
                const result = await window.electronAPI.launchCounterUtility()
                if (result.success) {
                  // Optionally, provide user feedback here, e.g., a toast notification
                } else {
                  setError(`Failed to launch counter: ${result.message}`)
                }
              } catch (err) {
                setError('An unexpected error occurred while launching the counter.')
              } finally {
                setIsCounterRunning(false)
              }
            }}
            disabled={isCounterRunning}
          >
            {isCounterRunning ? 'Counter Running...' : 'Launch Counter Utility'}
          </button>

          <button 
            className={`btn btn-primary ${isRngRunning ? 'btn-disabled' : ''}`}
            onClick={async () => {
              setIsRngRunning(true)
              setError(null)
              try {
                const result = await window.electronAPI.launchRngUtility()
                if (result.success) {
                  // Optionally, provide user feedback here, e.g., a toast notification
                } else {
                  setError(`Failed to launch rng: ${result.message}`)
                }
              } catch (err) {
                setError('An unexpected error occurred while launching the RNG utility.')
              } finally {
                setIsRngRunning(false)
              }
            }}
            disabled={isRngRunning}
          >
            {isRngRunning ? 'RNG Running...' : 'Launch RNG Utility'}
          </button>
        </div>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings