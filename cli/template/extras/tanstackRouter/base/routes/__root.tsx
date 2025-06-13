import React from 'react'
import cx from 'classnames'
import { useRouter, useRouterState } from '@tanstack/react-router'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from '../lib/queryClient'

export const Route = createRootRoute({
  component: Root,
})

const Header = () => {
  const router = useRouter()
  const { location } = useRouterState()

  return (
    <div className={cx('header')}>
      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/" && "active"
        )}
        onClick={() => router.navigate({ 
          to: '/',
          replace: true
        })}
      >
        Home
      </button>

      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/resources" && "active"
        )}
        onClick={() => router.navigate({ 
          to: '/resources' ,
          replace: true
        })}
      >
        Resources
      </button>

      <button
        className={cx(
          "btn btn-gradient-header-menu",
          "text-xs",
          location.pathname === "/settings" && "active"
        )}
        onClick={() => router.navigate({ 
          to: '/settings',
          replace: true
        })}
      >
        Settings
      </button>
    </div>
  )
}

export function Root() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className={cx('app-layout', 'border-2 border-black')}>
        <Header />
        <br />
        <Outlet />
      </div>
      <TanStackRouterDevtools position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
