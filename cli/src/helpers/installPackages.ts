// TERMINAL
import chalk from 'chalk'
import ora from 'ora'

// TYPES
import type { PkgInstallerMap } from '../types/Packages.js'
import type { InstallerOptions } from '../types/Installers.js'

export const installPackages = (options: InstallerOptions) => {
  /**
   * This runs the installer for all the packages that the user has selected
   */
  const { packages } = options

  for (const [name, pkgOpts] of Object.entries(packages) as [
    string,
    PkgInstallerMap[keyof PkgInstallerMap],
  ][]) {
    if (pkgOpts.inUse) {
      const spinner = ora(
        `${options.projectName} ${chalk.bold(`Handling: ${name}`)}...`
      ).start()
      pkgOpts.installer(options)
      spinner.succeed(
        `${options.projectName} ${chalk.green(`setup boilerplate for`)} ${chalk.bold.green(name)}`
      )
    }
  }
}
