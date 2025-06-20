import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import path from 'path'

// UTILS
import { logger } from '../utils/logger.js'
import { validateProjectName } from '../utils/validateProjectName.js'

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
import type {
  RouterPackage,
  StylePackage,
  DatabasePackage,
  ORMPackage,
  PackageManager,
  IDE,
} from '../types/index.js'

export const parseCliArgs = async (argv: string[]): Promise<Yargs> => {
  /**
   * boolean : any string is treated as true
   *    --ci === true
   *    --ci=random === true
   *    --ci=false === false
   *
   * choices : will reject the CLI call if the value is not in the choices
   */
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
    })
    .option('database', {
      type: 'string',
      description: `Database to use.`,
      choices: [...validDatabases, 'none'],
    })
    .option('orm', {
      type: 'string',
      description: `ORM to use.`,
      choices: [...validORMs, 'none'],
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
      default: true,
    })
    .option('install_packages', {
      type: 'boolean',
      description: 'Install packages after scaffolding.',
      default: true,
    })
    .option('ide', {
      type: 'string',
      description: `IDE to use.`,
      choices: [...validIDEs, 'none'],
    })
    .help()
    .alias('help', 'h')
    .version(false)
    .exitProcess(false)
    .parse()

  // Process database and ORM dependencies
  const dbIsSet = args.database && args.database !== 'none'
  console.error('dbIsSet', dbIsSet)
  const ormIsSet = args.orm && args.orm !== 'none'
  console.error('ormIsSet', ormIsSet)

  if (dbIsSet && !ormIsSet) {
    console.error('Setting orm to drizzle')
    args.orm = 'drizzle'
  }

  if (ormIsSet && !dbIsSet) {
    console.error('Setting database to sqlite')
    args.database = 'sqlite'
  }

  if (!dbIsSet && !ormIsSet) {
    console.error('Setting database and orm to false')
    args.database = 'none'
    args.orm = 'none'
  }

  console.error('AFTER PROCESSING:', args)

  // CONFIGURE: project name ##################################################
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

  // CONFIGURE: result ########################################################
  const result: Yargs = {
    ci: args.ci || false,
    y: args.y || false,
    project_name: project_name,
    project_dir: project_name
      ? path.resolve(process.cwd(), project_name)
      : undefined,
    router: args.router as RouterPackage | undefined,
    styles:
      args.styles === 'none'
        ? false
        : (args.styles as StylePackage | undefined),
    database:
      args.database === 'none'
        ? false
        : (args.database as DatabasePackage | undefined),
    orm: args.orm === 'none' ? false : (args.orm as ORMPackage | undefined),
    pkg_manager: args.pkg_manager as PackageManager | undefined,
    initialize_git: args.initialize_git,
    install_packages: args.install_packages,
    ide: args.ide === 'none' ? false : (args.ide as IDE | undefined),
  }

  console.error('FINAL RESULT:', result)
  return result
}
