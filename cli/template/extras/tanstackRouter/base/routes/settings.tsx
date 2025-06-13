import React from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

export function Settings() {
  const router = useRouter()
  return (
    <div className="page">
      <h1>Settings</h1>

      <div className="flex flex-col justify-center items-center text-white text-sm">
        <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
        <p>NODE_ENV: {window.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
