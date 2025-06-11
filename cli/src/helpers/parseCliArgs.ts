import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'

// UTILS
import { logger } from '../utils/logger.js'

// TYPES
import type { Yargs } from '../types/CLI.js'
import {
  validStyles,
  validRouters,
  validDatabases,
  validORMs,
} from '../types/Packages.js'

export const parseCliArgs = async (argv: string[]): Promise<Yargs> => {
  const args = await yargs(hideBin(argv))
    .option('ci', {
      type: 'boolean',
      description: 'Run in CI mode',
      default: false,
    })
    .option('y', {
      type: 'boolean',
      alias: 'yes',
      description: 'Skip prompts and use defaults',
      default: false,
    })
    .option('project_name', {
      type: 'string',
      description: 'Name of the project',
      default: process.env.APP_NAME,
    })
    .option('router', {
      type: 'string',
      choices: ['tanstack-router', 'react-router'],
      description: 'Router to use',
    })
    .option('styles', {
      type: 'string',
      choices: ['tailwind', 'false'],
      description: 'Styles to use',
    })
    .option('database', {
      type: 'string',
      choices: ['sqlite', 'false'],
      description:
        "Database to use (e.g., 'sqlite'). Empty String or non-existent param === ''",
    })
    .option('orm', {
      type: 'string',
      choices: ['drizzle', 'false'],
      description:
        "ORM to use (e.g., 'drizzle'). Empty String or non-existent param === ''",
    })
    .option('pkg_manager', {
      type: 'string',
      choices: ['npm'],
      description: 'Package manager to use',
      default: 'npm',
    })
    .option('initialize_git', {
      type: 'boolean',
      alias: 'git',
      description: 'Initialize Git repository',
      default: true,
    })
    .check((argv) => {
      if (argv.router && !validRouters.includes(argv.router)) {
        logger.error(`Invalid router: ${argv.router}. Setting to undefined.`)
        argv.router = undefined
      }

      if (argv.styles) {
        if (argv.styles !== 'false' && !validStyles.includes(argv.styles)) {
          logger.error(`Invalid styles: ${argv.styles}. Setting to undefined.`)
          argv.styles = undefined
        }
      }

      if (argv.database) {
        if (
          argv.database !== 'false' &&
          !validDatabases.includes(argv.database)
        ) {
          logger.error(
            `Invalid database: ${argv.database}. Setting to undefined.`
          )
          argv.database = undefined
        }
      }

      if (argv.orm) {
        if (argv.orm !== 'false' && !validORMs.includes(argv.orm)) {
          logger.error(`Invalid ORM: ${argv.orm}. Setting to undefined.`)
          argv.orm = undefined
        }
      }

      if (
        (argv.database && argv.database.length > 0 && !argv.orm) ||
        (!argv.database && argv.orm && argv.orm.length > 0)
      ) {
        throw new Error('Invalid database <-> orm configuration')
      }
      return true
    })
    .help()
    .alias('help', 'h')
    .version(false)
    .parse()

  const project_name = (args.project_name as string) || (args._[0] as string)
  if (!project_name) {
    throw new Error(
      'Project name is required. Please provide it as an argument or via the --project_name option.'
    )
  }

  const result: Yargs = {
    ci: args.ci || undefined,
    y: args.y || undefined,
    project_name: project_name || undefined,
    project_dir: project_name ? path.resolve(project_name) : undefined,
    router: args.router || undefined,
    styles:
      args.styles === undefined
        ? undefined
        : args.styles === 'false'
          ? false
          : args.styles,
    database:
      args.database === undefined
        ? undefined
        : args.database === 'false'
          ? false
          : args.database,
    orm:
      args.orm === undefined
        ? undefined
        : args.orm === 'false'
          ? false
          : args.orm,
    pkg_manager: args.pkg_manager || undefined,
    initialize_git: args.initialize_git || undefined,
  }

  return result
}
