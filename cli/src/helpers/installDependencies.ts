// TERMINAL
import chalk from 'chalk'
import { execa } from 'execa'

// TYPES
import type { PackageManager } from '../types/Packages.js'

const runInstallCommand = async (
  pkgManager: PackageManager,
  projectDir: string
): Promise<void> => {
  switch (pkgManager) {
    case 'npm':
      await execa(pkgManager, ['install'], {
        cwd: projectDir,
        stdout: 'inherit',
        stderr: 'inherit',
        timeout: 300000, // 5 minutes timeout
      })
      break
    default:
      throw new Error(`Unsupported package manager: ${pkgManager}`)
  }
}

export const installDependencies = async ({
  projectDir,
  pkgManager = 'npm',
}: {
  projectDir: string
  pkgManager?: PackageManager
}) => {
  console.log(chalk.blue('Installing dependencies...'))
  try {
    await runInstallCommand(pkgManager, projectDir)
    console.log(chalk.green('Installed dependencies!'))
  } catch (error) {
    console.log(chalk.red('Failed to install dependencies!'))
    if (error instanceof Error && error.message.includes('timed out')) {
      console.log(
        chalk.yellow(
          "Installation timed out. Try running 'npm install' manually in the project directory."
        )
      )
    }
    throw error
  }
}
