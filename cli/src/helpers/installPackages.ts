// TERMINAL
import chalk from 'chalk'
import ora from 'ora'

// TYPES
import type { PkgInstallerMap } from '../types/Packages.js'
import type { InstallerOptions } from '../types/Installers.js'

export const installPackages = (options: InstallerOptions) => {
  /**
   * Runs the dedicated installer for all the inUse packages
   * Updates the package.json with the new dependencies - it does NOT "npm i"
   * ####################################################################### */
  const { packages } = options

  for (const [name, pkgOpts] of Object.entries(packages) as [
    string,
    PkgInstallerMap[keyof PkgInstallerMap],
  ][]) {
    if (pkgOpts.inUse) {
      const spinner = ora(
        `${chalk.blue(options.project_name)} ${chalk.bold(`Handling: ${name}`)}...`
      ).start()
      pkgOpts.installer(options)
      spinner.succeed(
        `${chalk.blue(options.project_name)} ${chalk.green(`setup boilerplate for`)} ${chalk.bold.green(name)}`
      )
    }
  }
}
