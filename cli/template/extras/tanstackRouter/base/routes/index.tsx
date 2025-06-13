import React from 'react'
import cx from 'classnames'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  return (
    <div className="page">
      <div className={cx('hero')}>
        <h1>
          Welcome to <span className={cx('italic')}>your</span>
        </h1>
        <h2>Create Electron Foundation</h2>
      </div>

      <br />

      <div className={cx('cef-config')}>
        <span>{`Framework: Electron`}</span>
        <span>{`ROUTER: ${window.env.CEF_ROUTER}`}</span>
        <span>{`STYLES: ${window.env.CEF_STYLES}`}</span>
        <span>{`DATABASE: ${window.env.CEF_DATABASE}`}</span>
        <span>{`ORM: ${window.env.CEF_ORM}`}</span>
      </div>
    </div>
  )
}
