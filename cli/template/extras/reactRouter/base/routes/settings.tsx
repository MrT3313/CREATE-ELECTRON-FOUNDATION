import React from 'react'
import cx from 'classnames'

export function Settings() {

  return (
    <div className={cx('page')}>
      <h1>Settings</h1>

      <div>
        <p>CUSTOM_ENV_VAR: {window.env.CUSTOM_ENV_VAR}</p>
        <p>NODE_ENV: {window.env.NODE_ENV}</p>
      </div>
    </div>
  )
}

export default Settings
