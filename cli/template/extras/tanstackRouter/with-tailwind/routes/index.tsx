import React, { useEffect, useState } from 'react'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import cx from 'classnames'
import log from '../lib/logger'

export const Route = createFileRoute('/')({
  component: Index,
})

export function Index() {
  return (
    <div className={cx('page')}>
      <div className={cx('container','gap-0')}>
      <h1>Welcome to <span className={cx('italic')}>your</span></h1>
        <h2>Create Electron Foundation</h2>
      </div>
    </div>
  )
}
