import React from 'react'
import cx from 'classnames'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  return (
    <div className="page">
      <div className={cx('container','gap-0')}>
        <h1>Welcome to <span className={cx('italic')}>your</span></h1>
        <h2>Create Electron Foundation</h2>
      </div>
    </div>
  )
}
