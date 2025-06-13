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
   * Copies configuration agnostic Electron base template files into the
   * users new project directory
   * ####################################################################### */
  const spinner = ora(
    `${config.project_name} ${chalk.bold('Scaffolding')} in: ${config.project_dir}...`
  ).start()

  const srcDir = path.join(PKG_ROOT, 'template/base')

  // CHECK: if the project directory already exists
  if (fs.existsSync(config.project_dir)) {
    logger.error(`Directory ${config.project_dir} already exists`)
    // TODO: improve options
    //       - query user to delete/wipe & continue or exit
    process.exit(1)
  }

  // COPY: base template files into the users new project directory
  fs.cpSync(srcDir, config.project_dir, { recursive: true })

  // UPDATE: .env file with the project name
  let envContent = `
  APP_NAME=${config.project_name}
  CEF_FRAMEWORK=Electron
  CEF_ROUTER=${config.packages.router}
  CEF_STYLES=${config.packages.styles || 'CSS'}
  `
  if (config.packages.database) {
    envContent += `\nCEF_DATABASE=${config.packages.database}`
  }
  if (config.packages.orm) {
    envContent += `\nCEF_ORM=${config.packages.orm}`
  }

  const envFilePath = path.join(config.project_dir, '.env')
  fs.writeFileSync(envFilePath, envContent)

  // RENAME: copied _gitignore to .gitignore
  fs.renameSync(
    path.join(config.project_dir, '_gitignore'),
    path.join(config.project_dir, '.gitignore')
  )

  spinner.succeed(
    `${config.project_name} ${chalk.bold.green('scaffolded')} successfully!`
  )
}
