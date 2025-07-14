/**
 * This maps the necessary packages across configurations to a version.
 * ####################################################################### */
export const dependencyVersionMap = {
  // TailwindCSS
  tailwindcss: '~4.1.11',
  '@tailwindcss/vite': '~4.1.11',

  // Drizzle
  'drizzle-orm': '~0.44.3',
  'drizzle-kit': '~0.31.4',

  // SQLite
  'better-sqlite3': '~11.10.0',
  '@types/better-sqlite3': '~7.6.13',

  // React Router
  'react-router': '~7.6.2',

  // Tanstack
  // Tanstack > query
  '@tanstack/react-query': '~5.80.2',
  '@tanstack/react-query-devtools': '~5.80.2',
  // Tanstack > router
  '@tanstack/react-router': '~1.127.3',
  '@tanstack/react-router-devtools': '~1.127.3',
  '@tanstack/router-cli': '~1.121.10',
  '@tanstack/router-plugin': '~1.127.5',
} as const

export type AvailableDependencies = keyof typeof dependencyVersionMap
