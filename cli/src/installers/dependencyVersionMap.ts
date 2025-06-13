/**
 * This maps the necessary packages across configurations to a version.
 * ####################################################################### */
export const dependencyVersionMap = {
  // TailwindCSS
  tailwindcss: '~4.1.10',
  '@tailwindcss/vite': '~4.1.10',

  // Drizzle
  'drizzle-orm': '~0.44.2',
  'drizzle-kit': '~0.31.1',

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
  '@tanstack/react-router': '~1.121.2',
  '@tanstack/react-router-devtools': '~1.121.8',
  '@tanstack/router-cli': '~1.121.10',
  '@tanstack/router-plugin': '~1.121.10',
} as const

export type AvailableDependencies = keyof typeof dependencyVersionMap
