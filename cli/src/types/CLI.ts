import type {
  StylePackage,
  RouterPackage,
  PackageManager,
  DatabasePackage,
  ORMPackage,
} from './Packages.js'

export type ConfigKey =
  `${RouterPackage}-${StylePackage}-${DatabasePackage | 'none'}-${ORMPackage | 'none'}`

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

export interface CLIDefaults {
  pkg_manager: PackageManager // "npm"
  initialize_git: boolean
  install_dependencies: boolean
  run_migrations: boolean
  packages: {
    router: RouterPackage
    styles: StylePackage
    database: DatabasePackage
    orm: ORMPackage
  }
}

export const defaultCLIConfig: CLIDefaults = {
  pkg_manager: 'npm',
  initialize_git: false,
  install_dependencies: true,
  run_migrations: true,
  packages: {
    router: 'tanstack-router',
    styles: 'tailwind',
    database: 'sqlite',
    orm: 'drizzle',
  },
}

export interface CLIResults extends CLIDefaults {
  project_name: string
  project_dir: string
  config_key: ConfigKey
}
