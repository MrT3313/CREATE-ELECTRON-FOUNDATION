import React from 'react'

function NotFoundRoute() {
  return (
    <div className="page">
      <div className="container">
        <h1>Page Not Found</h1>
        <p style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>
          The requested page could not be found.
        </p>
        
        <a href="/" className="nav-link">
          Go to Home
        </a>
        
        <div className="debug-info">
          <h3>Debug Info:</h3>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Environment:</strong> {window.env?.NODE_ENV}</p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundRoute