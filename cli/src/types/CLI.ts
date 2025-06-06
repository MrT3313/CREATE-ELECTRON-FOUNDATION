import type {
  StylePackages,
  RouterPackages,
  PackageManager,
  DatabasePackages,
  ORMPackages,
  AvailablePackages,
} from './Packages.js'

export interface CLIArgs {
  project_name?: string
  initialize_git?: boolean
  install_dependencies?: boolean
  run_migrations?: boolean
  router?: RouterPackages
  styles?: StylePackages
  database?: DatabasePackages | null
  orm?: ORMPackages | null
  skipPrompts?: boolean
  ci?: boolean
}

export interface CLIDefaults {
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
  ci: boolean
}

export interface CLIResults extends CLIDefaults {
  projectName: string
  projectDir: string
}
