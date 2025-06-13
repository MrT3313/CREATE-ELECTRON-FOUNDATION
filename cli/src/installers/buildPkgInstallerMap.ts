import ora from 'ora'
import chalk from 'chalk'

// INSTALLERS
import { tailwindInstaller } from './tailwind.js'
import { tanstackRouterInstaller } from './tanstackRouter.js'
import { reactRouterInstaller } from './reactRouter.js'
import { sqliteInstaller } from './sqlite.js'
import { drizzleInstaller } from './drizzle.js'

// TYPES
import type { AvailablePackages, PkgInstallerMap } from '../types/Packages.js'

export const buildPkgInstallerMap = (
  project_name: string,
  packages: AvailablePackages[]
): PkgInstallerMap => {
  /**
   * Builds a map of the packages that are inUse in the current configuration
   * and their custom installers.
   * ####################################################################### */

  const spinner = ora(
    `${project_name} ${chalk.bold('Building')} ${chalk.bold('PkgInstallerMap')}...`
  ).start()

  const map: PkgInstallerMap = {
    'tanstack-router': {
      inUse: packages.includes('tanstack-router'),
      installer: tanstackRouterInstaller,
    },
    'react-router': {
      inUse: packages.includes('react-router'),
      installer: reactRouterInstaller,
    },
    sqlite: {
      inUse: packages.includes('sqlite'),
      installer: sqliteInstaller,
    },
    drizzle: {
      inUse: packages.includes('drizzle'),
      installer: drizzleInstaller,
    },
    tailwind: {
      inUse: packages.includes('tailwind'),
      installer: tailwindInstaller,
    },
  }

  spinner.succeed(
    `${project_name} ${chalk.bold.green('pkgInstallerMap built')} successfully`
  )
  return map
}
