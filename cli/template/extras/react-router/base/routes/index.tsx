import React from 'react'
import cx from 'classnames'

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

      <div
        className={cx('card-content')}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          fontSize: '1.2rem',
        }}
      >
        <span>{`Framework: ${window.env.CEF_FRAMEWORK}`}</span>
        <span>{`Router: ${window.env.CEF_ROUTER}`}</span>
        <span>{`Styles: ${window.env.CEF_STYLES}`}</span>
        <span>{`Database: ${window.env.CEF_DATABASE}`}</span>
        <span>{`ORM: ${window.env.CEF_ORM}`}</span>
      </div>
    </div>
  )
}

const Index = () => {
  return (
    <div className="page">
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

export default Index
