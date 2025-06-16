import type {
  StylePackage,
  RouterPackage,
  PackageManager,
  DatabasePackage,
  ORMPackage,
} from './Packages.js'

export type ConfigKey =
  `${RouterPackage}-${StylePackage | 'none'}-${DatabasePackage | 'none'}-${ORMPackage | 'none'}`

export interface Yargs {
  ci: boolean | undefined
  y: boolean | undefined
  project_name: string | undefined
  project_dir: string | undefined
  router: RouterPackage | undefined
  styles: StylePackage | undefined | false
  database: DatabasePackage | undefined | false
  orm: ORMPackage | undefined | false
  pkg_manager: PackageManager | undefined
  initialize_git: boolean | undefined
  install_packages: boolean | undefined
  ide: 'cursor' | false | undefined
}

export interface CLIDefaults {
  pkg_manager: PackageManager // "npm"
  ide: false | 'cursor' // "cursor"
  initialize_git: boolean
  install_packages: boolean
  packages: {
    router: RouterPackage
    styles: StylePackage | false
    database: DatabasePackage | false
    orm: ORMPackage | false
  }
}

export const defaultCLIConfig: CLIDefaults = {
  pkg_manager: 'npm',
  ide: 'cursor',
  initialize_git: false,
  packages: {
    router: 'tanstack-router',
    styles: 'tailwind',
    database: 'sqlite',
    orm: 'drizzle',
  },
  install_packages: false,
}

export interface CLIResults extends CLIDefaults {
  project_name: string
  project_dir: string
  config_key: ConfigKey
}
