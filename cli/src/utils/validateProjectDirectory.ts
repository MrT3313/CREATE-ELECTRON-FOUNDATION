// TERMINAL
import type { Ora } from 'ora'
import fs from 'fs'
import chalk from 'chalk'
import * as p from '@clack/prompts'

// FUNCTIONS
import { logger } from '../utils/logger.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'
import { FileSystemError } from '../utils/errors.js'

// TYPES
export const validateProjectDirectory = async (
  config: CLIResults,
  timestamp: string,
  spinner: Ora
): Promise<void> => {
  const { project_dir } = config

  // CHECK: if the project directory already exists
  if (fs.existsSync(project_dir)) {
    spinner.warn(
      `${chalk.red.bold('Project directory already exists:')} ${chalk.red(project_dir)}`
    )

    const action = await p.select({
      message: 'How would you like to handle the existing project directory?',
      options: [
        {
          value: 'backup',
          label: 'Create a backup and continue',
          hint: 'Recommended - preserves existing data',
        },
        {
          value: 'remove',
          label: 'Remove existing directory and continue',
          hint: 'Warning - this will delete all existing data in the directory',
        },
        {
          value: 'abort',
          label: 'Cancel project creation',
          hint: 'Stop and choose a different project directory',
        },
      ],
      initialValue: 'backup',
    })

    if (p.isCancel(action)) {
      throw new FileSystemError(
        'Project creation cancelled by user.',
        project_dir
      )
    }

    switch (action) {
      case 'backup': {
        const backupPath = `${project_dir}.backup.${timestamp}`
        try {
          fs.renameSync(project_dir, backupPath)
          logger.info(`📦 Existing directory backed up to: ${backupPath}`)
        } catch (error) {
          throw new FileSystemError(
            `Failed to backup existing directory: ${project_dir}`,
            project_dir,
            error as Error
          )
        }
        break
      }
      case 'remove': {
        const confirmRemoval = await p.confirm({
          message: `Are you sure you want to permanently delete this directory? This action cannot be undone.`,
          initialValue: false,
        })

        if (p.isCancel(confirmRemoval)) {
          throw new FileSystemError(
            'Project creation cancelled by user.',
            project_dir
          )
        }

        if (!confirmRemoval) {
          throw new FileSystemError(
            'User chose not to remove the directory.',
            project_dir
          )
        }

        try {
          fs.rmSync(project_dir, { recursive: true, force: true })
          logger.info(`🗑️  Removed existing directory: ${project_dir}`)
        } catch (error) {
          throw new FileSystemError(
            `Failed to remove existing directory: ${project_dir}`,
            project_dir,
            error as Error
          )
        }
        break
      }
      case 'abort': {
        throw new FileSystemError(
          'Project creation cancelled by user. Please choose a different project directory.',
          project_dir
        )
      }
    }
  }
}
