import React from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_404')({
  component: NotFoundRoute,
})

function NotFoundRoute() {
  return (
    <div className="app-layout">
      <div className="page">
        <div className="container">
          <h1>Page Not Found</h1>
          <p>The requested page could not be found.</p>
          <a href="/" className="nav-link">Go to Home</a>
          <div className="debug-info">
            <h3>Debug Info:</h3>
            <p>Current URL: {window.location.href}</p>
            <p>Environment: {window.env?.NODE_ENV}</p>
          </div>
        </div>
      </div>
    </div>
  )
}