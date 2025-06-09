// TERMINAL
import chalk from 'chalk'
import { execa } from 'execa'

// TYPES
import type { PackageManager } from '../types/Packages.js'

const runInstallCommand = async (
  pkg_manager: PackageManager,
  project_dir: string
): Promise<void> => {
  switch (pkg_manager) {
    case 'npm':
      await execa(pkg_manager, ['install'], {
        cwd: project_dir,
        stdout: 'inherit',
        stderr: 'inherit',
        timeout: 300000, // 5 minutes timeout
      })
      break
    default:
      throw new Error(`Unsupported package manager: ${pkg_manager}`)
  }
}

export const installDependencies = async ({
  project_dir,
  pkg_manager = 'npm',
}: {
  project_dir: string
  pkg_manager?: PackageManager
}) => {
  console.log(chalk.blue('Installing dependencies...'))
  try {
    await runInstallCommand(pkg_manager, project_dir)
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
