// TERMINAL
import type { Ora } from 'ora'
import fs from 'fs'
import chalk from 'chalk'
import * as p from '@clack/prompts'

// FUNCTIONS
import { getElectronUserDataPath } from './getElectronUserDataPath.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'
import { FileSystemError } from '../utils/errors.js'

// UTILS
import { logger } from '../utils/logger.js'

export const validateElectronUserDataPath = async (
  config: CLIResults,
  timestamp: string,
  spinner: Ora
): Promise<void> => {
  const { project_name } = config
  const userDataPath = getElectronUserDataPath(project_name)

  // Check if Electron userData directory already exists
  if (fs.existsSync(userDataPath)) {
    spinner.warn(
      `${chalk.red.bold('Electron userData directory already exists:')} ${chalk.red(userDataPath)}`
    )
    spinner.warn(
      chalk.yellow(
        'This may contain application data from a previous installation.'
      )
    )

    const action = await p.select({
      message:
        'How would you like to handle the existing Electron userData directory?',
      options: [
        {
          value: 'backup',
          label: 'Create a backup and continue',
          hint: 'Recommended - preserves existing data',
        },
        {
          value: 'remove',
          label: 'Remove existing data and continue',
          hint: 'Warning - this will delete all existing app data',
        },
        {
          value: 'abort',
          label: 'Cancel project creation',
          hint: 'Stop and choose a different project name',
        },
      ],
      initialValue: 'backup',
    })

    if (p.isCancel(action))
      throw new FileSystemError(
        'Project creation cancelled by user.',
        userDataPath
      )

    switch (action) {
      case 'backup':
        try {
          const backupPath = `${userDataPath}.backup.${timestamp}`
          fs.renameSync(userDataPath, backupPath)
          logger.info(`📦 Backed up existing userData to: ${backupPath}`)
        } catch (error) {
          throw new FileSystemError(
            `Failed to backup existing userData directory: ${userDataPath}`,
            userDataPath,
            error as Error
          )
        }
        break

      case 'remove': {
        const confirmRemoval = await p.confirm({
          message: `Are you sure you want to permanently delete the userData directory? This action cannot be undone.`,
          initialValue: false,
        })

        if (p.isCancel(confirmRemoval))
          throw new FileSystemError(
            'Project creation cancelled by user.',
            userDataPath
          )

        if (!confirmRemoval)
          throw new FileSystemError(
            'User chose not to remove the directory.',
            userDataPath
          )

        try {
          fs.rmSync(userDataPath, { recursive: true, force: true })
          logger.info(
            `🗑️  Removed existing userData directory: ${userDataPath}`
          )
        } catch (error) {
          throw new FileSystemError(
            `Failed to remove existing userData directory: ${userDataPath}`,
            userDataPath,
            error as Error
          )
        }
        break
      }

      case 'abort':
        throw new FileSystemError(
          'Project creation cancelled by user. Please choose a different project name.',
          userDataPath
        )

      default:
        throw new FileSystemError(
          'Invalid selection for userData directory handling.',
          userDataPath
        )
    }
  }
}
