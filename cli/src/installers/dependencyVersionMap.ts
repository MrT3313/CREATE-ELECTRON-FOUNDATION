/*
 * This maps the necessary packages to a version.
 * This improves performance significantly over fetching it from the npm registry.
 */
export const dependencyVersionMap = {
  // TailwindCSS
  "tailwindcss": "^4.1.7",
  "@tailwindcss/vite": "^4.1.7",

  "@tanstack/react-query": "^5.79.0",
  "@tanstack/react-router": "^1.120.11",

  "@tanstack/react-query-devtools": "^5.79.0",
  "@tanstack/react-router-devtools": "^1.120.11",
  "@tanstack/router-cli": "^1.120.11",
  "@tanstack/router-devtools": "^1.120.11",
  "@tanstack/router-plugin": "^1.120.11",
} as const;
export type AvailableDependencies = keyof typeof dependencyVersionMap;