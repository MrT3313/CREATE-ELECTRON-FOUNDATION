import React, { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import log from 'electron-log/renderer'

const utilityProcessLogger = log.scope('settings')

export const Route = createFileRoute('/settings')({
  component: Settings,
})

export function Settings() {
  const [error, setError] = useState<string | null>(null)
  const [isCounterRunning, setIsCounterRunning] = useState<boolean>(false)
  const [isRngRunning, setIsRngRunning] = useState<boolean>(false)

  const router = useRouter()
  return (
    <div className="app-layout">
      <div className="page">
        <div className="container">
          <h1>Settings</h1>

          <button className="btn" onClick={() => router.navigate({ to: '/' })}>
            Home
          </button>
        </div>
      </div>
    </div>
  )
}
