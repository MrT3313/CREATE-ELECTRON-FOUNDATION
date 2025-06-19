import type {
  StylePackage,
  RouterPackage,
  PackageManager,
  DatabasePackage,
  ORMPackage,
  IDE,
} from './index.js'

/**
 * Configuration key format: [router]-[styles]-[database]-[orm]
 * Example: "tanstack-router-tailwind-sqlite-drizzle"
 */
export type ConfigKey =
  `${RouterPackage}-${StylePackage | 'none'}-${DatabasePackage | 'none'}-${ORMPackage | 'none'}`

/**
 * Command-line arguments passed to the CLI
 */
export interface Yargs {
  readonly ci?: boolean
  readonly y?: boolean
  readonly project_name?: string
  readonly project_dir?: string
  readonly router?: RouterPackage
  readonly styles?: StylePackage | false
  readonly database?: DatabasePackage | false
  readonly orm?: ORMPackage | false
  readonly pkg_manager?: PackageManager
  readonly initialize_git?: boolean
  readonly install_packages?: boolean
  readonly ide?: IDE | false
}

/**
 * Package configuration for the project
 */
export interface PackageConfiguration {
  readonly router: RouterPackage
  readonly styles: StylePackage | false
  readonly database: DatabasePackage | false
  readonly orm: ORMPackage | false
}

/**
 * Default CLI configuration values
 */
export interface CLIDefaults {
  readonly pkg_manager: PackageManager
  readonly ide: IDE | false
  readonly initialize_git: boolean
  readonly install_packages: boolean
  readonly packages: PackageConfiguration
}

/**
 * Default configuration with predefined values
 */
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

/**
 * Results from CLI prompt execution, combining default values and user input
 */
export interface CLIResults extends CLIDefaults {
  readonly project_name: string
  readonly project_dir: string
  readonly config_key: ConfigKey
}

/**
 * Results from user prompt interactions
 */
export interface PromptResults {
  readonly project_name?: string
  readonly router?: RouterPackage
  readonly styles?: boolean
  readonly initialize_database?: boolean
  readonly initialize_git?: boolean
  readonly install_packages?: boolean
  readonly ide?: IDE | false
}
