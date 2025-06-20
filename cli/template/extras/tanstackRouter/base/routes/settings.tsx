import React from 'react'
import cx from 'classnames'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/settings')({
  component: Settings,
})

export function Settings() {
  return (
    <div className="page">
      <div className={cx('hero', 'glass')}>
        <h1>Settings</h1>
      </div>

      <br />

      <div className="env-vars">
        <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
        <p>NODE_ENV: {window.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
