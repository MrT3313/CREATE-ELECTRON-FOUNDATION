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
  validPackageManagers,
  validIDEs,
} from '../types/index.js'

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
    })
    .option('router', {
      type: 'string',
      description: `Router to use.`,
      choices: validRouters,
    })
    .option('styles', {
      type: 'string',
      description: `Styles to use.`,
      choices: [...validStyles, 'none'],
      coerce: (arg) => (arg === 'none' ? false : arg),
    })
    .option('database', {
      type: 'string',
      description: `Database to use.`,
      choices: [...validDatabases, 'none'],
      coerce: (arg) => (arg === 'none' ? false : arg),
    })
    .option('orm', {
      type: 'string',
      description: `ORM to use.`,
      choices: [...validORMs, 'none'],
      coerce: (arg) => (arg === 'none' ? false : arg),
    })
    .option('pkg_manager', {
      type: 'string',
      description: `Package manager to use.`,
      choices: validPackageManagers,
    })
    .option('initialize_git', {
      type: 'boolean',
      alias: 'git',
      description: 'Initialize Git repository.',
    })
    .option('install_packages', {
      type: 'boolean',
      description: 'Install packages after scaffolding.',
    })
    .option('ide', {
      type: 'string',
      description: `IDE to use.`,
      choices: [...validIDEs, 'none'],
      coerce: (arg) => (arg === 'none' ? false : arg),
    })
    .check((argv) => {
      const dbIsSet = argv.database && argv.database !== false
      const ormIsSet = argv.orm && argv.orm !== false

      if (dbIsSet !== ormIsSet) {
        throw new Error('Must provide both a database and an ORM, or neither.')
      }
      return true
    })
    .help()
    .alias('help', 'h')
    .version(false)
    .parse()

  const project_name_arg =
    (args.project_name as string) || (args._[0] as string)
  let project_name: string | undefined = project_name_arg
    ? path.basename(project_name_arg)
    : undefined

  if (project_name) {
    const validation_error = validateProjectName(project_name)
    if (validation_error) {
      logger.error(validation_error)
      project_name = undefined
    }
  }

  const result: Yargs = {
    ci: args.ci,
    y: args.y,
    project_name: project_name,
    project_dir: project_name
      ? path.resolve(process.cwd(), project_name)
      : undefined,
    router: args.router as Yargs['router'],
    styles: args.styles as Yargs['styles'],
    database: args.database as Yargs['database'],
    orm: args.orm as Yargs['orm'],
    pkg_manager: args.pkg_manager as Yargs['pkg_manager'],
    initialize_git: args.initialize_git,
    install_packages: args.install_packages,
    ide: args.ide as Yargs['ide'],
  }

  return result
}

export const validateProjectName = (name: string) => {
  const validationRegExp =
    /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/
  if (validationRegExp.test(name)) {
    return
  } else {
    return `"${name}" is not a valid project name. Please use a valid npm package name.`
  }
}
