import type {
  StylePackages,
  RouterPackages,
  PackageManager,
  DatabasePackages,
  ORMPackages,
  // AvailablePackages,
} from './Packages.js'

export interface Yargs {
  ci: boolean | undefined
  y: boolean | undefined
  project_name: string | undefined
  project_dir: string | undefined
  router: string | undefined
  styles: string | undefined
  database: string | undefined
  run_migrations: boolean | undefined
  orm: string | undefined
  pkg_manager: string | undefined
  initialize_git: boolean | undefined
  install_dependencies: boolean | undefined
}

interface CLIDefaults {
  pkgManager: PackageManager // "npm"
  initializeGit: boolean
  installDependencies: boolean
  runMigrations: boolean
  packages: {
    router: [RouterPackages] // Correct: always one router
    styles: [StylePackages] // Corrected: always one style, like router
    database: DatabasePackages[] // Correct: array, can be empty, works with .includes()
    orm: ORMPackages[] // Correct: array, can be empty, works with .includes()
  }
}

export const defaultCLIConfig: CLIDefaults = {
  pkgManager: 'npm',
  initializeGit: false,
  installDependencies: true,
  runMigrations: true,
  packages: {
    router: ['tanstack-router'],
    styles: ['tailwind'],
    database: ['sqlite'],
    orm: ['drizzle'],
  },
}

export interface CLIResults extends CLIDefaults {
  project_name: string
  projectDir: string
}
