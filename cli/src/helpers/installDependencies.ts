import chalk from 'chalk'
import { execa } from 'execa'
import ora, { type Ora } from 'ora'
import { logger } from '../utils/logger.js'
import type { PackageManager } from '../types/Packages.js'

const runInstallCommand = async (
  pkgManager: PackageManager,
  projectDir: string
): Promise<Ora | null> => {
  switch (pkgManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case 'npm':
      await execa(pkgManager, ['install'], {
        cwd: projectDir,
        stderr: 'inherit',
      })

      return null
    default:
      // TODO: add support for other package managers
      return null
  }
}

export const installDependencies = async ({
  projectDir,
  pkgManager = 'npm',
}: {
  projectDir: string
  pkgManager?: PackageManager
}) => {
  logger.info('Installing dependencies...')

  const installSpinner = await runInstallCommand(pkgManager, projectDir)

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  ;(installSpinner ?? ora()).succeed(
    chalk.green('Successfully installed dependencies!\n')
  )
}
