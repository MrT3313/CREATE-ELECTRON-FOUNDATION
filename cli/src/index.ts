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

// UTILS
import { logger } from './utils/logger.js'

// TERMINAL
import { execaSync } from 'execa'
import ora from 'ora'
import chalk from 'chalk'
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

// TYPES
import type { CLIResults, CLIArgs } from './types/CLI.js'
import type {
  RouterPackages,
  DatabasePackages,
  ORMPackages,
  StylePackages,
} from './types/Packages.js'

const main = async () => {
  const ide = process.env.IDE || 'cursor'

  // Parse command line arguments
  const argv = await yargs(hideBin(process.argv))
    .option('project_name', {
      type: 'string',
      description: 'Name of the project',
    })
    .option('router', {
      type: 'string',
      choices: ['tanstack-router', 'react-router'],
      description: 'Router to use',
      default: 'tanstack-router',
    })
    .option('database', {
      type: 'string',
      choices: ['sqlite', 'null'],
      description: "Database to use (e.g., 'sqlite'). Pass 'null' for no database.",
      default: 'null',
      coerce: (arg: string) => (arg.toLowerCase() === 'null' ? null : arg),
    })
    .option('run_migrations', {
      type: 'boolean',
      description: 'Run migrations',
      default: true,
    })
    .option('orm', {
      type: 'string',
      choices: ['drizzle', 'null'],
      description: "ORM to use (e.g., 'drizzle'). Pass 'null' for no ORM.",
      default: 'null',
      coerce: (arg: string) => (arg.toLowerCase() === 'null' ? null : arg),
    })
    .option('styles', {
      type: 'string',
      choices: ['tailwind', 'css'],
      description: 'Styles to use',
      default: 'tailwind',
    })
    .option('initialize_git', {
      type: 'boolean',
      description: 'Initialize Git repository',
      default: true,
    })
    .option('install_dependencies', {
      type: 'boolean',
      description: 'Install dependencies',
      default: true,
    })
    .option('ci', {
      type: 'boolean',
      description: 'Run in CI mode (non-interactive, skip IDE open)',
      default: false,
    })
    .option('y', {
      type: 'boolean',
      alias: 'yes',
      description: 'Skip prompts and use defaults',
    })
    .check((argv) => {
      if (argv.database !== null && argv.orm === null) {
        throw new Error("If a database is selected, an ORM must also be selected (e.g., --orm=drizzle).")
      }
      if (argv.database === null && argv.orm !== null) {
        throw new Error("If no database is selected, ORM must also be 'null'.")
      }
      if (argv.database === null && argv.run_migrations && (argv.install_dependencies || argv.ci)) {
        if (!argv.y && !argv.ci) {
            logger.warn("`run_migrations` is true but no database is selected. Migrations will be skipped.")
        }
        argv.run_migrations = false;
      }
      return true
    })
    .help()
    .alias('help', 'h')
    .version(false)
    .parse()

  // Extract named options and positional arguments
  const cliArgs: CLIArgs = {
    project_name: (argv.project_name as string) || (argv._[0] as string),
    router: argv.router as RouterPackages,
    database: argv.database as DatabasePackages | null,
    orm: argv.orm as ORMPackages | null,
    styles: argv.styles as StylePackages,
    initialize_git: argv.initialize_git as boolean,
    install_dependencies: argv.install_dependencies as boolean,
    run_migrations: argv.run_migrations as boolean,
    skipPrompts: (argv.y as boolean) || (argv.ci as boolean),
    ci: argv.ci as boolean,
  }

  // INJECT ENV VARIABLES ######################################################
  if (!cliArgs.project_name && cliArgs.skipPrompts) {
    logger.error("Project name is required. Please provide it as an argument or via the --project_name option.")
    process.exit(1);
  }
  // Set APP_NAME early if project_name is available from args.
  // runUserPromptCli will use this or prompt if necessary, then set config.projectName
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
  const usePackages = buildPkgInstallerMap(config.projectName, inUsePackages)

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
  const pkgJson = fs.readJSONSync(path.join(config.projectDir, 'package.json'))
  pkgJson.name = config.projectName
  fs.writeJSONSync(path.join(config.projectDir, 'package.json'), pkgJson, {
    spaces: 2,
  })

  // 7. install dependencies ##################################################
  if (config.installDependencies) {
    await installDependencies({
      pkgManager: config.pkgManager,
      projectDir: config.projectDir,
    })
  }

  // 8. migrations #########################################################
  if (
    config.installDependencies &&
    config.runMigrations && 
    config.packages.database?.includes('sqlite') &&
    config.packages.orm?.includes('drizzle')
  ) {
    const migrationsSpinner = ora({
      text: 'Setting up database...',
      spinner: 'dots',
    })
    migrationsSpinner.start()

    let command = `cd "${config.projectName}"`
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
  } else if (config.runMigrations && !(config.packages.database?.includes('sqlite') && config.packages.orm?.includes('drizzle'))) {
    if (config.runMigrations) { 
        logger.info("Skipping database migrations as database/ORM requirements are not met or migrations disabled.");
    }
  }

  // 9. initialize git ########################################################
  if (config.initializeGit) {
    const initializeGitSpinner = ora({
      text: 'Initializing Git...',
      spinner: 'dots',
    })
    initializeGitSpinner.start()

    let command = `cd "${config.projectName}"`
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
  if (ide && !config.ci) { // Do not open IDE in CI mode
    let command = `cd "${config.projectName}"`
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
    `${config.projectName} ${chalk.bold.green('Project Initialized Successfully with create-electron-foundation!')}`
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
