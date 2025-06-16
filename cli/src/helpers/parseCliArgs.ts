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
  StylePackage,
  DatabasePackage,
  ORMPackage,
  PackageManager,
  RouterPackage,
  IDE,
} from '../types/index.js'

export const parseCliArgs = async (argv: string[]): Promise<Yargs> => {
  /**
   * @function parseCliArgs
   * @async
   * @description Parses command-line arguments using `yargs` to configure the application setup.
   *
   * This function is responsible for the following:
   * 1.  **Defining CLI Options:** It sets up various command-line flags such as `--project_name`, `--router`, `--styles`, `--database`, and more, including booleans like `--ci` and `--git`.
   * 2.  **Graceful Validation:** Instead of failing on invalid input, it performs checks within a `.check()` block. If an argument is invalid (e.g., wrong format, not in the list of allowed values), it logs an error message and sets the corresponding value to `undefined`.
   * 3.  **Handling Edge Cases:**
   *     - It ensures that string-based arguments are handled in a case-insensitive manner.
   *     - It prevents options from being specified multiple times (e.g., `--router=a --router=b`).
   *     - It validates dependent options, ensuring that if a database is specified, an ORM must also be specified, and vice-versa.
   * 4.  **Returning Configuration:** It processes the raw arguments from `yargs` and returns a cleaned, structured `Yargs` object. This object can then be used by the rest of the application to determine which components to scaffold and how to configure the project. The non-failing validation allows for a subsequent prompting mechanism (e.g., using `clack`) to fill in any missing (`undefined`) values.
   *
   * @param {string[]} argv - An array of command-line arguments, typically from `process.argv`.
   * @returns {Promise<Yargs>} A promise that resolves to a `Yargs` object containing the parsed and validated configuration.
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
      description: `Router to use. Valid options: ${validRouters.join(', ')}`,
    })
    .option('styles', {
      type: 'string',
      description: `Styles to use. Valid options: ${validStyles.join(
        ', '
      )}, false`,
    })
    .option('database', {
      type: 'string',
      description: `Database to use. Valid options: ${validDatabases.join(
        ', '
      )}, false`,
    })
    .option('orm', {
      type: 'string',
      description: `ORM to use. Valid options: ${validORMs.join(', ')}, false`,
    })
    .option('pkg_manager', {
      type: 'string',
      description: `Package manager to use. Valid options: ${validPackageManagers.join(
        ', '
      )}`,
    })
    .option('initialize_git', {
      type: 'string',
      alias: 'git',
      description: 'Initialize Git repository. Can be set to false.',
    })
    .option('install_packages', {
      type: 'string',
      description: 'Install packages after scaffolding. Can be set to false.',
    })
    .option('ide', {
      type: 'string',
      description: `IDE to use. Valid options: ${validIDEs.join(
        ', '
      )}, or false`,
    })
    .check((argv) => {
      // VALIDATORS
      if (Array.isArray(argv.router)) {
        logger.error(
          'The router option can only be specified once. Setting to undefined.'
        )
        argv.router = undefined
      } else if (argv.router) {
        const router = argv.router.toLowerCase()
        if (!validRouters.includes(router)) {
          logger.error(`Invalid router: ${argv.router}. Setting to undefined.`)
          argv.router = undefined
        } else {
          argv.router = router
        }
      }

      if (Array.isArray(argv.styles)) {
        logger.error(
          'The styles option can only be specified once. Setting to undefined.'
        )
        argv.styles = undefined
      } else if (argv.styles) {
        const styles = argv.styles.toLowerCase()
        if (styles !== 'false' && !validStyles.includes(styles)) {
          logger.error(`Invalid styles: ${argv.styles}. Setting to undefined.`)
          argv.styles = undefined
        } else {
          argv.styles = styles
        }
      }

      if (Array.isArray(argv.database)) {
        logger.error(
          'The database option can only be specified once. Setting to undefined.'
        )
        argv.database = undefined
      } else if (argv.database) {
        const database = argv.database.toLowerCase()
        if (database !== 'false' && !validDatabases.includes(database)) {
          logger.error(
            `Invalid database: ${argv.database}. Setting to undefined.`
          )
          argv.database = undefined
        } else {
          argv.database = database
        }
      }

      if (Array.isArray(argv.orm)) {
        logger.error(
          'The orm option can only be specified once. Setting to undefined.'
        )
        argv.orm = undefined
      } else if (argv.orm) {
        const orm = argv.orm.toLowerCase()
        if (orm !== 'false' && !validORMs.includes(orm)) {
          logger.error(`Invalid ORM: ${argv.orm}. Setting to undefined.`)
          argv.orm = undefined
        } else {
          argv.orm = orm
        }
      }

      if (Array.isArray(argv.pkg_manager)) {
        logger.error(
          'The pkg_manager option can only be specified once. Setting to undefined.'
        )
        argv.pkg_manager = undefined
      } else if (argv.pkg_manager) {
        const pkg_manager = argv.pkg_manager.toLowerCase()
        if (!validPackageManagers.includes(pkg_manager)) {
          logger.error(
            `Invalid package manager: ${argv.pkg_manager}. Setting to undefined.`
          )
          argv.pkg_manager = undefined
        } else {
          argv.pkg_manager = pkg_manager
        }
      }

      if (Array.isArray(argv.initialize_git)) {
        logger.error(
          'The initialize_git option can only be specified once. Setting to undefined.'
        )
        argv.initialize_git = undefined
      } else if (
        argv.initialize_git &&
        argv.initialize_git.toLowerCase() !== 'true' &&
        argv.initialize_git.toLowerCase() !== 'false'
      ) {
        logger.error(
          `Invalid initialize_git: ${argv.initialize_git}. Must be true or false. Setting to undefined.`
        )
        argv.initialize_git = undefined
      }

      if (Array.isArray(argv.install_packages)) {
        logger.error(
          'The install_packages option can only be specified once. Setting to undefined.'
        )
        argv.install_packages = undefined
      } else if (
        argv.install_packages &&
        argv.install_packages.toLowerCase() !== 'true' &&
        argv.install_packages.toLowerCase() !== 'false'
      ) {
        logger.error(
          `Invalid install_packages: ${argv.install_packages}. Must be true or false. Setting to undefined.`
        )
        argv.install_packages = undefined
      }

      if (Array.isArray(argv.ide)) {
        logger.error(
          'The ide option can only be specified once. Setting to undefined.'
        )
        argv.ide = undefined
      } else if (argv.ide) {
        const ide = argv.ide.toLowerCase()
        if (ide !== 'false' && !validIDEs.includes(ide)) {
          logger.error(`Invalid IDE: ${argv.ide}. Setting to undefined.`)
          argv.ide = undefined
        } else {
          argv.ide = ide
        }
      }

      const dbIsSet = argv.database && argv.database !== 'false'
      const ormIsSet = argv.orm && argv.orm !== 'false'

      if (dbIsSet !== ormIsSet) {
        logger.error(
          'Must provide both a database and an ORM, or neither. Setting both to undefined.'
        )
        argv.database = undefined
        argv.orm = undefined
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
    if (!/^[a-zA-Z0-9_-]+$/.test(project_name)) {
      logger.error(
        'Project name can only contain letters, numbers, underscores, and hyphens. Setting to undefined.'
      )
      project_name = undefined
    } else if (/^\d/.test(project_name)) {
      logger.error(
        'Project name cannot start with a number. Setting to undefined.'
      )
      project_name = undefined
    }
  }

  const result: Yargs = {
    project_dir: project_name_arg ? path.resolve(project_name_arg) : undefined,

    ci: args.ci || undefined,
    y: args.y || undefined,

    project_name: project_name || undefined,

    router: (args.router as RouterPackage) || undefined,

    styles:
      args.styles === undefined // nothing was passed in for --styles=<...>
        ? undefined
        : args.styles === 'false' // --styles=false
          ? false
          : (args.styles as StylePackage), // pass validated styles

    database:
      args.database === undefined // nothing was passed in for --database=<...>
        ? undefined
        : args.database === 'false' // --database=false
          ? false
          : (args.database as DatabasePackage), // pass validated database

    orm:
      args.orm === undefined // nothing was passed in for --orm=<...>
        ? undefined
        : args.orm === 'false' // --orm=false
          ? false
          : (args.orm as ORMPackage), // pass validated orm

    pkg_manager: (args.pkg_manager as PackageManager) || undefined,

    initialize_git:
      args.initialize_git === undefined
        ? undefined
        : args.initialize_git.toLowerCase() === 'true'
          ? true
          : false,

    install_packages:
      args.install_packages === undefined
        ? undefined
        : args.install_packages.toLowerCase() === 'true'
          ? true
          : false,

    ide:
      args.ide === undefined
        ? undefined
        : args.ide === 'false'
          ? false
          : (args.ide as IDE),
  }

  logger.info('PARSED CLI ARGS', JSON.stringify(result, null, 2))
  return result
}
