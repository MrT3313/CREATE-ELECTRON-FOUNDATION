import path from 'path'
import fs from 'fs'

// TERMINAL
import ora from 'ora'
import chalk from 'chalk'

// UTILS
import { logger } from '../utils/logger.js'
import { PKG_ROOT } from '../consts.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'

export const scaffoldProject = (config: CLIResults): void => {
  /**
   * copy as much of the base boilerplate for electron
   * that is unaffected by the user's choices
   */
  const spinner = ora(
    `${config.project_name} ${chalk.bold('Scaffolding')} in: ${config.project_dir}...`
  ).start()

  const srcDir = path.join(PKG_ROOT, 'template/base')

  if (fs.existsSync(config.project_dir)) {
    logger.error(`Directory ${config.project_dir} already exists`)
    process.exit(1)
  }

  fs.cpSync(srcDir, config.project_dir, { recursive: true })

  const envContent = `APP_NAME=${config.project_name}\n`
  const envFilePath = path.join(config.project_dir, '.env')
  fs.writeFileSync(envFilePath, envContent)

  fs.renameSync(
    path.join(config.project_dir, '_gitignore'),
    path.join(config.project_dir, '.gitignore')
  )

  spinner.succeed(
    `${config.project_name} ${chalk.bold.green('scaffolded')} successfully!`
  )
}
