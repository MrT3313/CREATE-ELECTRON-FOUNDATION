import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import cx from 'classnames'

export const Route = createFileRoute('/')({
  component: Index,
})

function ConfigCard() {
  return (
    <div className={cx('reminders', 'glass')}>
      <div className={cx('card-header')}>
        <div className={cx('icon', 'glass')}>⚙️</div>
        <div>
          <h3 className={cx('card-title')}>Configuration</h3>
          <p className={cx('card-subtitle')}>Environment Settings</p>
        </div>
      </div>

      <div className={cx('card-content', 'flex flex-col gap-2 text-lg')}>
        <span>{`Framework: ${window.env.CEF_FRAMEWORK}`}</span>
        <span>{`Router: ${window.env.CEF_ROUTER}`}</span>
        <span>{`Styles: ${window.env.CEF_STYLES}`}</span>
        <span>{`Database: ${window.env.CEF_DATABASE}`}</span>
        <span>{`ORM: ${window.env.CEF_ORM}`}</span>
      </div>
    </div>
  )
}

export function Index() {
  return (
    <div className={cx('page')}>
      <div className={cx('hero', 'glass')}>
        <h1>
          Welcome to <span className={cx('italic')}>your</span>
        </h1>
        <h2>Create Electron Foundation</h2>
      </div>

      <br />

      <ConfigCard />
    </div>
  )
}
