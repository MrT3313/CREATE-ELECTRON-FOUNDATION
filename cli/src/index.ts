#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import assert from 'assert'

// FUNCTIONS
import { renderTitle } from './utils/renderTitle.js'
import { runUserPromptCli } from './cli/index.js'
import { buildPkgInstallerMap } from './installers/buildPkgInstallerMap.js'
import { scaffoldProject } from './helpers/scaffoldProject.js'
import { installPackages } from './helpers/installPackages.js'
import { selectBoilerplate } from './helpers/selectBoilerplate.js'
import { installDependencies } from './helpers/installDependencies.js'
import { parseCliArgs } from './helpers/parseCliArgs.js'

// UTILS
import { logger } from './utils/logger.js'

// TERMINAL
import { execaSync } from 'execa'
import ora from 'ora'
import chalk from 'chalk'

// TYPES
import type { Yargs, CLIResults } from './types/CLI.js'

const main = async () => {
  const ide = process.env.IDE || 'cursor'

  // Parse command line arguments
  logger.info(`process.argv: ${JSON.stringify(process.argv, null, 2)}`)
  const cliArgs: Yargs = await parseCliArgs(process.argv)

  // INJECT ENV VARIABLES ######################################################
  // Set APP_NAME early if project_name is available from args.
  // runUserPromptCli will use this or prompt if necessary, then set config.project_name
  if (cliArgs.project_name) {
    process.env.APP_NAME = cliArgs.project_name
  }

  // START ####################################################################
  renderTitle()

  // Log current Node.js version
  logger.info(`Node.js version: ${process.version}`)
  assert(process.version === 'v22.15.1', 'Node.js version must be 22.15.1')

  // 1. run the user prompt cli ###############################################
  const config: CLIResults = await runUserPromptCli(cliArgs)

  // 2. configure packages ####################################################
  const inUsePackages = Object.values(config.packages).flat()
  const usePackages = buildPkgInstallerMap(config.project_name, inUsePackages)

  // 3. scaffold base project #################################################
  scaffoldProject(config)

  // 4. install packages ######################################################
  installPackages({
    ...config,
    packages: usePackages,
  })

  // 5. select boilerplate ####################################################
  selectBoilerplate(config)

  // 6. update package.json ###################################################
  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.name = config.project_name
  fs.writeJSONSync(path.join(config.project_dir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  // 7. install dependencies ##################################################
  if (config.install_dependencies) {
    await installDependencies({
      pkg_manager: config.pkg_manager,
      project_dir: config.project_dir,
    })
  }

  // 8. migrations #########################################################
  if (
    config.install_dependencies &&
    config.run_migrations &&
    config.packages.database?.includes('sqlite') &&
    config.packages.orm?.includes('drizzle')
  ) {
    const migrationsSpinner = ora({
      text: 'Setting up database...',
      spinner: 'dots',
    })
    migrationsSpinner.start()

    let command = `cd "${config.project_name}"`
    command += ` && npm run db:setup`

    try {
      execaSync(command, {
        shell: true,
      })
      migrationsSpinner.succeed(
        chalk.green('Database setup completed successfully!')
      )
    } catch (err) {
      logger.error(`Failed to execute: ${command}`)
      logger.error(err)
      migrationsSpinner.fail(chalk.red('Database setup failed!'))
    }
  } else if (
    config.run_migrations &&
    !(
      config.packages.database?.includes('sqlite') &&
      config.packages.orm?.includes('drizzle')
    )
  ) {
    if (config.run_migrations) {
      logger.info(
        'Skipping database migrations as database/ORM requirements are not met or migrations disabled.'
      )
    }
  }

  // 9. initialize git ########################################################
  if (config.initialize_git && !cliArgs.ci) {
    const initializeGitSpinner = ora({
      text: 'Initializing Git...',
      spinner: 'dots',
    })
    initializeGitSpinner.start()

    let command = `cd "${config.project_name}"`
    command += ` && git init && git add . && git commit -m "Initial Scaffolding : create-electron-foundation"`

    try {
      execaSync(command, {
        shell: true,
      })
      initializeGitSpinner.succeed(chalk.green('Git initialized successfully!'))
    } catch (err) {
      logger.error(`Failed to execute: ${command}`)
      logger.error(err)
      initializeGitSpinner.fail(chalk.red('Git initialization failed!'))
    }
  }

  // 10. open in ide ##########################################################
  if (ide && !cliArgs.ci) {
    // Do not open IDE in CI mode
    let command = `cd "${config.project_name}"`
    command += ` && ${ide} .`

    try {
      execaSync(command, {
        shell: true,
      })
    } catch (err) {
      logger.error(`Failed to execute: ${command}`)
      logger.error(err)
    }
  }

  logger.success(
    `${config.project_name} ${chalk.bold.green('Project Initialized Successfully with create-electron-foundation!')}`
  )
}

main().catch((error) => {
  logger.error('An unexpected error occurred:')
  if (error instanceof Error) {
    logger.error(error.message)
    if (error.stack) {
      logger.error(error.stack)
    }
  } else {
    logger.error(String(error))
  }
  process.exit(1)
})
