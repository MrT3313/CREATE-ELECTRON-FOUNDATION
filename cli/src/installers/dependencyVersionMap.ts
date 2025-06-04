/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // TailwindCSS
  "tailwindcss": "^4.1.7",
  "@tailwindcss/vite": "^4.1.7",

  // Drizzle
  "drizzle-orm": "^0.44.1",
  "drizzle-kit": "^0.31.1",

  // SQLite
  "better-sqlite3": "^11.10.0",
  "@types/better-sqlite3": "^7.6.1",
  
  // React Router
  "react-router": "^7.6.1",

  // Tanstack
  // Tanstack > query
  "@tanstack/react-query": "^5.80.2",
  "@tanstack/react-query-devtools": "^5.80.2",
  // Tanstack > router
  "@tanstack/react-router": "^1.120.11",
  "@tanstack/react-router-devtools": "^1.120.11",
  "@tanstack/router-cli": "^1.120.11",
  "@tanstack/router-plugin": "^1.120.11"


} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;