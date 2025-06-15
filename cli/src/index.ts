#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'

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
import { execa } from 'execa'
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

  // 1. PARSE: command line arguments #########################################
  const cliArgs: Yargs = await parseCliArgs(process.argv)

  renderTitle()
  logger.info(`Node.js version: ${process.version}`)

  // 2. PROMPT: user to fill configurations ###################################
  const config: CLIResults = await runUserPromptCli(cliArgs)

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

  // 8. INSTALL PACKAGES ######################################################
  if (!cliArgs.ci && config.install_packages) {
    const projectSetupSpinner = ora(
      `${chalk.blue(config.project_name)} ${chalk.green.bold('Installing Packages')}...`
    ).start()

    const command = `cd ${config.project_dir} && make ri`

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
      logger.error(`Failed to execute: ${command}`)
      logger.error(err)
      if (err instanceof Error) {
        logger.error(err.message)
      }
      process.exit(1)
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
      if (err instanceof Error) {
        logger.error(err.message)
      }
      process.exit(1)
    }
  }

  // 10. OPEN: in IDE ##########################################################
  if (config.ide && !cliArgs.ci) {
    let command = `cd "${config.project_name}"`
    command += ` && ${config.ide} .`

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
    )} with ${chalk.blue('create-electron-foundation!')}`
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
