import React from 'react'
import cx from 'classnames'

// REACT ROUTER
import { 
  Routes, 
  Route, 
  Outlet, 
  useNavigate, 
  useLocation
} from 'react-router'

// REACT QUERY
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'

// PAGES
import IndexPage from './routes/index'
import SettingsPage from './routes/settings'
import ResourcesPage from './routes/resources'
import NotFoundPage from './routes/_404'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className={cx('header')}>
      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/" && "active"
        )}
        onClick={() => navigate('/', { replace: true })}
      >
        Home
      </button>

      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/resources" && "active"
        )}
        onClick={() => navigate('/resources', { replace: true })}
      >
        Resources
      </button>

      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/settings" && "active"
        )}
        onClick={() => navigate('/settings', { replace: true })}
      >
        Settings
      </button>
    </div>
  )
}

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cx("app-layout")}>
        <Header />
        <Outlet />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<IndexPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
