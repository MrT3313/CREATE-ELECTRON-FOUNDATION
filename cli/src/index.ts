#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import * as p from '@clack/prompts'

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
import { handleError, CLIError } from './utils/errors.js'

// TERMINAL
import { execa } from 'execa'
import ora from 'ora'
import chalk from 'chalk'

// TYPES
import type { Yargs, CLIResults } from './types/CLI.js'
import { AvailablePackages } from './types/index.js'

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

  // 1. PARSE: command line arguments #########################################
  const cliArgs: Yargs = await parseCliArgs(process.argv)

  renderTitle()
  logger.info(`Node.js version: ${process.version}`)

  // 2. PROMPT: user to fill configurations ###################################
  const config: CLIResults = await runUserPromptCli(cliArgs)

  // Display summary to ensure it's visible to the user
  p.note(
    `
    Project Name: ${chalk.blue.bold(config.project_name)}
    Router: ${chalk.green.bold(config?.packages?.router)}
    Styles: ${chalk.green.bold(config?.packages?.styles || 'Vanilla CSS')}
    Database: ${config?.packages?.database ? chalk.green.bold(config?.packages?.database) : chalk.red.bold('false')}
    ORM: ${config?.packages?.orm ? chalk.green.bold(config?.packages?.orm) : chalk.red.bold('false')}
    Initialize Git: ${config.initialize_git ? chalk.green.bold('true') : chalk.red.bold('false')}
    Install Packages: ${config.install_packages ? chalk.green.bold('true') : chalk.red.bold('false')}
    IDE: ${config.ide ? chalk.green.bold(config.ide) : chalk.red.bold('false')}
    `,
    'Summary of your choices:'
  )

  // INJECT ENV VARIABLES ######################################################
  if (cliArgs.project_name) {
    process.env.APP_NAME = cliArgs.project_name
    process.env.CEF_FRAMEWORK = 'Electron'
    process.env.CEF_ROUTER = cliArgs.router
    process.env.CEF_STYLES = cliArgs.styles || 'Vanilla CSS'
    if (cliArgs.database) {
      process.env.CEF_DATABASE = cliArgs.database
    }
    if (cliArgs.orm) {
      process.env.CEF_ORM = cliArgs.orm
    }
  }

  // 3. CONFIGURE: inUse packages & custom installers #########################
  const inUsePackages = Object.values(config.packages)
    .flat()
    .filter((pkg): pkg is AvailablePackages => !!pkg)
  const usePackages = buildPkgInstallerMap(config.project_name, inUsePackages)

  // 4. SCAFFOLD: base project (configuration agnostic files) ##################
  await scaffoldProject(config)

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

  // 8. INSTALL PACKAGES ######################################################
  if (!cliArgs.ci && config.install_packages) {
    const projectSetupSpinner = ora(
      `${chalk.blue(config.project_name)} ${chalk.green.bold('Installing Packages')}...`
    ).start()

    let command = `cd ${config.project_dir} && make ri`
    if (process.platform === 'darwin') {
      /**
        # ------------------------------------------------------------------------------
        # macOS/nvm Compatibility Fix
        #
        # Problem:
        # On macOS, if Node.js is installed via Homebrew, it can set a global
        # `npm_config_prefix` environment variable. This variable conflicts with nvm
        # (Node Version Manager), which this Makefile uses for Node version management.
        # When nvm detects this variable, it throws an error and exits to prevent
        # potential package corruption.
        #
        # Solution:
        # This block conditionally prepares a command to `unset` the conflicting
        # environment variable *only on macOS*.
        #
        # - `uname -s`: This command gets the name of the operating system kernel.
        #   On macOS, it returns "Darwin".
        # - `ifeq ... endif`: This is a makefile conditional. The code inside only runs
        #   if the condition is met.
        # - `UNSET_NPM_CONFIG_PREFIX`: We define a variable that is empty by default.
        #   On Darwin systems, we set it to `unset npm_config_prefix &&`.
        #
        # This variable is then prepended to any command that uses `npm` or `nvm`,
        # ensuring the conflict is resolved for that specific command without
        # permanently altering the user's shell configuration.
        # ------------------------------------------------------------------------------
       */
      command = `cd ${config.project_dir} && unset npm_config_prefix && make ri`
    }

    try {
      await execa(command, {
        shell: true,
      })
      projectSetupSpinner.succeed(
        `${chalk.blue(config.project_name)} ${chalk.bold.green('Packages installed')} successfully!`
      )
    } catch (err) {
      projectSetupSpinner.fail(
        `${chalk.blue(config.project_name)} ${chalk.red('Packages installation failed!')}`
      )
      throw new CLIError(
        `Package installation failed: ${command}`,
        'PACKAGE_INSTALL_ERROR',
        false,
        err instanceof Error ? err : new Error(String(err))
      )
    }
  }

  // 9. INITIALIZE: git #######################################################
  if (config.initialize_git && !cliArgs.ci) {
    const initializeGitSpinner = ora({
      text: 'Initializing Git...',
      spinner: 'dots',
    }).start()

    try {
      await execa('git', ['init'], { cwd: config.project_dir })
      await execa('git', ['add', '.'], { cwd: config.project_dir })
      await execa(
        'git',
        ['commit', '-m', 'Initial Scaffolding from create-electron-foundation'],
        {
          cwd: config.project_dir,
        }
      )
      initializeGitSpinner.succeed(
        `${chalk.blue(config.project_name)} ${chalk.bold.green('Git initialized')} successfully!`
      )
    } catch (err) {
      initializeGitSpinner.fail(
        `${chalk.blue(config.project_name)} ${chalk.red('Git initialization')} failed!`
      )
      throw new CLIError(
        'Git initialization failed',
        'GIT_INIT_ERROR',
        true,
        err instanceof Error ? err : new Error(String(err))
      )
    }
  }

  // 10. OPEN: in IDE ##########################################################
  if (config.ide && !cliArgs.ci) {
    let command = `cd "${config.project_name}"`
    if (config.ide === 'cursor') {
      command += ` && ${config.ide} .`
    } else if (config.ide === 'vscode') {
      command += ` && code .`
    }

    try {
      await execa(command, {
        shell: true,
      })
    } catch (err) {
      logger.error(`Failed to execute: ${command}`)
      logger.error(err)
      if (err instanceof Error) {
        logger.error(err.message)
      }
    }
  }

  logger.success(
    `${chalk.blue(config.project_name)} ${chalk.bold.green(
      'Project Scaffolded Successfully'
    )} ${chalk.white('with')} ${chalk.blue('create-electron-foundation!')}`
  )
}

main().catch((error) => {
  const cliError = handleError(error)

  logger.error(`❌ ${cliError.message}`)

  if (cliError.cause && cliError.cause.stack) {
    logger.debug('Stack trace:', cliError.cause.stack)
  }

  if (cliError.recoverable) {
    logger.info(
      '💡 This error might be recoverable. Please check your configuration and try again.'
    )
  }

  process.exit(cliError.code === 'VALIDATION_ERROR' ? 2 : 1)
})
