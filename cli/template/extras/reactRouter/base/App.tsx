import React from 'react'
import { Routes, Route, Outlet } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import IndexPage from './routes/index'
import SettingsPage from './routes/settings'
import NotFoundPage from './routes/_404'

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-layout">
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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App