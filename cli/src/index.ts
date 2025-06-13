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
  /**
   * ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
   * Main entry point for the Create Electron Foundation CLI
   *
   * Steps:
   * 1. PARSE command line arguments for configurations
   * 2. PROMPT user to fill configurations
   * 3. CONFIGURE inUse packages & custom installers
   * 4. SCAFFOLD base project (configuration agnostic files)
   * 5. INSTALL packages (update the package.json - not 'npm i')
   * 6. SELECT boilerplate (⭐️ most important file -- copies the configuration specific files into the users project)
   * 7. UPDATE package.json
   * 8. INITIALIZE git
   * 9. OPEN in IDE
   * ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
   * ####################################################################### */

  const ide = process.env.IDE || 'cursor'

  // 1. PARSE: command line arguments #########################################
  logger.info(`process.argv: ${JSON.stringify(process.argv, null, 2)}`)
  const cliArgs: Yargs = await parseCliArgs(process.argv)

  // INJECT ENV VARIABLES ######################################################
  if (cliArgs.project_name) {
    process.env.APP_NAME = cliArgs.project_name
    process.env.CEF_FRAMEWORK = 'Electron'
    process.env.CEF_ROUTER = cliArgs.router
    process.env.CEF_STYLES = cliArgs.styles || 'CSS'
    if (cliArgs.database) {
      process.env.CEF_DATABASE = cliArgs.database
    }
    if (cliArgs.orm) {
      process.env.CEF_ORM = cliArgs.orm
    }
  }

  renderTitle()

  // Log current Node.js version
  logger.info(`Node.js version: ${process.version}`)
  assert(process.version === 'v22.15.1', 'Node.js version must be 22.15.1')

  // 2. PROMPT: user to fill configurations ###################################
  const config: CLIResults = await runUserPromptCli(cliArgs)

  // 3. CONFIGURE: inUse packages & custom installers #########################
  const inUsePackages = Object.values(config.packages).flat()
  const usePackages = buildPkgInstallerMap(config.project_name, inUsePackages)

  // 4. SCAFFOLD: base project (configuration agnostic files) ##################
  scaffoldProject(config)

  // 5. INSTALL: packages (update the package.json - not 'npm i') #############
  installPackages({
    ...config,
    packages: usePackages,
  })

  // 6. SELECT: boilerplate ###################################################
  // ⭐️ most important file -- copies the configuration specific files into the users project ⭐️
  selectBoilerplate(config)

  // 7. UPDATE: package.json ###################################################
  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.name = config.project_name
  fs.writeJSONSync(path.join(config.project_dir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  // 8. INITIALIZE: git #######################################################
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

  // 9. OPEN: in IDE ##########################################################
  if (ide && !cliArgs.ci) {
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
