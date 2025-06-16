import type {
  StylePackage,
  RouterPackage,
  PackageManager,
  DatabasePackage,
  ORMPackage,
  IDE,
} from './index.js'

export type ConfigKey =
  `${RouterPackage}-${StylePackage | 'none'}-${DatabasePackage | 'none'}-${ORMPackage | 'none'}`

export interface Yargs {
  ci: undefined | boolean
  y: undefined | boolean
  project_name: undefined | string
  project_dir: undefined | string
  router: undefined | RouterPackage
  styles: undefined | StylePackage | false
  database: undefined | DatabasePackage | false
  orm: undefined | ORMPackage | false
  pkg_manager: undefined | PackageManager
  initialize_git: undefined | boolean
  install_packages: undefined | boolean
  ide: undefined | IDE | false
}

export interface CLIDefaults {
  pkg_manager: PackageManager // "npm"
  ide: IDE | false
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
