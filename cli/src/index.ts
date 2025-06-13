#!/usr/bin/env node
import fs from 'fs-extra'
import path from 'path'
import { renderTitle } from './utils/renderTitle.js'
import { runUserPromptCli } from './cli/index.js'
import { buildPkgInstallerMap } from './installers/buildPkgInstallerMap.js'
import { scaffoldProject } from './helpers/scaffoldProject.js'
import { installPackages } from './helpers/installPackages.js'
import { selectBoilerplate } from './helpers/selectBoilerplate.js'
import { parseCliArgs } from './helpers/parseCliArgs.js'
import chalk from 'chalk'
import type { Yargs, CLIResults } from './types/CLI.js'

// UTILS
import { logger } from './utils/logger.js'

// TERMINAL
import { execaSync } from 'execa'
import ora from 'ora'

const main = async () => {
  const cliArgs: Yargs = await parseCliArgs(process.argv)

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
  logger.info(`Node.js version: ${process.version}`)

  const config: CLIResults = await runUserPromptCli(cliArgs)

  const inUsePackages = Object.values(config.packages).flat()
  const usePackages = buildPkgInstallerMap(config.project_name, inUsePackages)

  scaffoldProject(config)

  installPackages({
    ...config,
    packages: usePackages,
  })

  selectBoilerplate(config)

  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.name = config.project_name
  fs.writeJSONSync(path.join(config.project_dir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  if (config.initialize_git && !cliArgs.ci) {
    const initializeGitSpinner = ora({
      text: 'Initializing Git...',
      spinner: 'dots',
    }).start()

    try {
      execaSync('git', ['init'], { cwd: config.project_dir })
      execaSync('git', ['add', '.'], { cwd: config.project_dir })
      execaSync(
        'git',
        ['commit', '-m', 'Initial Scaffolding from create-electron-foundation'],
        {
          cwd: config.project_dir,
        }
      )
      initializeGitSpinner.succeed(chalk.green('Git initialized successfully!'))
    } catch (err) {
      initializeGitSpinner.fail(chalk.red('Git initialization failed!'))
      if (err instanceof Error) {
        logger.error(err.message)
      }
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
