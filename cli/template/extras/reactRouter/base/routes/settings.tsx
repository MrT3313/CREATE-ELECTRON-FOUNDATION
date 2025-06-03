import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import log from 'electron-log/renderer'

const utilityProcessLogger = log.scope('settings')

export function Settings() {
  const [error, setError] = useState<string | null>(null)
  const [isCounterRunning, setIsCounterRunning] = useState<boolean>(false)
  const [isRngRunning, setIsRngRunning] = useState<boolean>(false)

  const navigate = useNavigate()
  
  return (
    <div className="page">
      <div className="container">
        <h1>Settings</h1>
        
        <button 
          className="btn"
          onClick={() => navigate('/')}
        >
          Home
        </button>
      </div>
    </div>
  )
}

export default Settings