import React, { useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import cx from 'classnames'
import log from 'electron-log/renderer'

const utilityProcessLogger = log.scope('settings')

export const Route = createFileRoute('/settings')({
  component: Settings,
})

export function Settings() {
  const router = useRouter()
  return (
    <div className={cx('page')}>
      <div className={cx('hero', 'glass')}>
        <h1>Settings</h1>
      </div>

      <br />

      <div className={cx('env-vars')}>
        <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
        <p>NODE_ENV: {window.env.NODE_ENV}</p>
      </div>
    </div>
  )
}
