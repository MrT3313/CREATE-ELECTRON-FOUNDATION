import React from 'react'

function NotFoundRoute() {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-white">
      <h1>Page Not Found</h1>

      <p>The requested page could not be found.</p>

      <div className="btn">
        <a href="/" className="text-white">
          Go to Home
        </a>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded text-xs font-mono">
        <p>Debug Info:</p>
        <p>Current URL: {window.location.href}</p>
        <p>Environment: {window.env?.NODE_ENV}</p>
      </div>
    </div>
  )
}

export default NotFoundRoute
