import { setTimeout } from 'node:timers/promises'
import color from 'picocolors'

// TERMINAL > user prompting
import * as p from '@clack/prompts'
import chalk from 'chalk'

// CONSTS
import { DEFAULT_APP_NAME } from '../consts.js'

// TYPES
import { defaultCLIConfig } from '../types/CLI.js'
import type { ConfigKey, Yargs, CLIResults, IDE } from '../types/index.js'
import type {
  RouterPackage,
  DatabasePackage,
  ORMPackage,
  StylePackage,
} from '../types/Packages.js'
// import { validDatabases, validORMs } from '../types/Packages.js'

// UTILS
import { logger } from '../utils/logger.js'

export const runUserPromptCli = async (cliArgs: Yargs): Promise<CLIResults> => {
  /**
    Interactive prompts for their configuration preferences

    If the user has entered any of the values directly through the CLI then we 
    can skip the prompts and use the passed cliArgs
  ########################################################################## */

  p.intro(`${color.bgCyan(color.black('create-electron-foundation'))}`)
  try {
    // DEFINE: initial config with default values #############################
    const config_key: ConfigKey = `${cliArgs.router as RouterPackage}-${
      (cliArgs.styles as StylePackage) || 'none'
    }-${(cliArgs.database as DatabasePackage) || 'none'}-${
      (cliArgs.orm as ORMPackage) || 'none'
    }`

    // Handle database/orm relationship
    const database = cliArgs.database
    const orm = cliArgs.orm

    // If orm is specified but database is not, set database to sqlite
    if (orm && !database) {
      cliArgs.database = 'sqlite'
    }

    // If database is sqlite and orm is not specified, default to drizzle
    if (database === 'sqlite' && orm === undefined) {
      cliArgs.orm = 'drizzle'
    }

    // If database is false, orm must be false
    if (database === false && orm === undefined) {
      cliArgs.orm = false
    }

    let config: CLIResults

    if (cliArgs.ci || cliArgs.y) {
      config = {
        config_key,
        ...defaultCLIConfig,
        // 👇 overwrite defaults with passed values
        project_name: cliArgs.project_name || DEFAULT_APP_NAME,

        project_dir:
          cliArgs.project_dir ||
          `./${cliArgs.project_name || DEFAULT_APP_NAME}`,

        initialize_git:
          cliArgs.initialize_git !== undefined ? cliArgs.initialize_git : true,
        install_packages:
          cliArgs.install_packages !== undefined
            ? cliArgs.install_packages
            : true,
        ide: cliArgs.ide !== undefined ? cliArgs.ide : defaultCLIConfig.ide,

        packages: {
          ...defaultCLIConfig.packages,
          // 👇 overwrite defaults if passed through YARGS
          router: cliArgs.router || defaultCLIConfig.packages.router,
          styles:
            cliArgs.styles !== undefined
              ? cliArgs.styles
              : defaultCLIConfig.packages.styles,
          database:
            cliArgs.database !== undefined
              ? cliArgs.database
              : defaultCLIConfig.packages.database,
          orm:
            cliArgs.orm !== undefined
              ? cliArgs.orm
              : defaultCLIConfig.packages.orm,
        },
      }
    } else {
      try {
        let group: {
          project_name?: string
          router?: RouterPackage
          styles?: StylePackage | 'css'
          database?: DatabasePackage | 'none'
          orm?: ORMPackage | 'none'
          initialize_git?: boolean
          install_packages?: boolean
          ide?: IDE | 'none'
        } = {}

        const prompts: Record<
          string,
          () => Promise<string | boolean | symbol>
        > = {}

        // PROJECT NAME #########################################################
        if (!cliArgs.project_name) {
          prompts.project_name = () =>
            p.text({
              message: 'What is the name of your project?',
              placeholder: DEFAULT_APP_NAME,
              validate(value) {
                if (value.length === 0) return `Project name is required!`
                if (!/^[a-z0-9_.-]+$/.test(value))
                  return 'Project name can only contain lowercase letters, numbers, underscores, hyphens, and periods.'
                if (/^[0-9]/.test(value))
                  return 'Project name cannot start with a number.'
              },
            })
        }

        // ROUTER #############################################################
        if (!cliArgs.router) {
          prompts.router = () =>
            p.select({
              message: 'Which router would you like to use?',
              options: [
                {
                  value: 'tanstack-router',
                  label: 'Tanstack Router',
                },
                {
                  value: 'react-router',
                  label: 'React Router',
                },
              ],
              initialValue: 'tanstack-router',
            })
        }

        // STYLES #############################################################
        if (cliArgs.styles === undefined) {
          prompts.styles = () =>
            p.select({
              message: 'Which styles would you like to use?',
              options: [
                {
                  value: 'tailwind',
                  label: 'Tailwind CSS',
                },
                {
                  value: 'none',
                  label: 'Vanilla CSS',
                },
              ],
              initialValue: 'tailwind',
            })
        }

        // DATABASE AND ORM CONDITIONAL PROMPTS ##############################
        // We handle these separately because the ORM prompt depends on the
        // database choice.
        if (cliArgs.database === undefined) {
          // We'll store the database selection here so we can use it for the ORM prompt
          let databaseSelection: string | symbol = 'none'

          prompts.database = async () => {
            const result = await p.select({
              message: 'Which database would you like to use?',
              options: [
                // ...validDatabases.map((db) => ({
                //   value: db,
                //   label: db,
                // })),
                { value: 'sqlite', label: 'SQLite' },
                { value: 'none', label: 'Skip' },
              ],
              initialValue: 'sqlite',
            })

            // Store the result for the ORM prompt to use
            databaseSelection = result
            return result
          }

          prompts.orm = async () => {
            // Use the captured database selection from the previous prompt
            if (databaseSelection && databaseSelection !== 'none') {
              return await p.select({
                message: 'Which ORM would you like to use?',
                options: [
                  // Uncomment and use this if you have a validORMs array:
                  // ...validORMs.map((orm) => ({
                  //   value: orm,
                  //   label: orm,
                  // })),
                  { value: 'drizzle', label: 'Drizzle' },
                ],
                initialValue: 'drizzle',
              })
            }

            return 'none'
          }
        }

        // GIT ################################################################
        if (cliArgs.initialize_git === undefined) {
          prompts.initialize_git = () =>
            p.confirm({
              message:
                'Should we initialize a Git repository and stage the changes?',
              initialValue: true,
            })
        }

        // INSTALL PACKAGES ####################################################
        if (cliArgs.install_packages === undefined) {
          prompts.install_packages = () =>
            p.confirm({
              message: 'Should we install packages after scaffolding?',
              initialValue: true,
            })
        }

        // IDE ################################################################
        if (cliArgs.ide === undefined) {
          prompts.ide = () =>
            p.select({
              message: 'Which IDE would you like to use?',
              options: [
                {
                  value: 'cursor',
                  label: 'Cursor',
                },
                {
                  value: 'vscode',
                  label: 'VSCode',
                },
                {
                  value: 'none',
                  label: 'Neither',
                },
              ],
              initialValue: 'cursor',
            })
        }

        // 👀 Run prompts if any exist ############################################
        if (Object.keys(prompts).length > 0) {
          group = await p.group(prompts, {
            onCancel: () => {
              p.cancel('Scaffolding cancelled.')
              throw new Error('Scaffolding cancelled by user')
            },
          })
        }

        // DEFINE: config with user prompts ###################################
        /**
         * The 'p.select' prompt returns a generic 'string'. A type assertion (as) is
         * needed to ensure TypeScript recognizes it.
         */

        logger.debug('group', JSON.stringify(group, null, 2))

        // Handle database/orm relationship
        let database = cliArgs.database
        let orm = cliArgs.orm

        if (group.database) {
          database =
            group.database === 'none'
              ? false
              : (group.database as DatabasePackage)
        }

        if (group.orm) {
          orm = group.orm === 'none' ? false : (group.orm as ORMPackage)
        }

        // If orm is specified but database is not, set database to sqlite
        if (orm && !database) {
          database = 'sqlite'
        }

        // If database is sqlite and orm is not specified, default to drizzle
        if (database === 'sqlite' && orm === undefined) {
          orm = 'drizzle'
        }

        // If database is false, orm must be false
        if (database === false && orm === undefined) {
          orm = false
        }

        const mutableConfig: Partial<CLIResults> = {
          project_name: (group.project_name ||
            cliArgs.project_name ||
            DEFAULT_APP_NAME) as string,

          project_dir: `./${
            (group.project_name ||
              cliArgs.project_name ||
              DEFAULT_APP_NAME) as string
          }`,

          packages: {
            router: (group.router ||
              cliArgs.router ||
              defaultCLIConfig.packages.router) as RouterPackage,

            styles: group.styles
              ? // @ts-expect-error converting string 'none' to false
                group.styles === 'none'
                ? false
                : (group.styles as StylePackage)
              : cliArgs.styles !== undefined
                ? cliArgs.styles
                : defaultCLIConfig.packages.styles,

            database: database as DatabasePackage | false,
            orm: orm as ORMPackage | false,
          },

          initialize_git:
            group.initialize_git !== undefined
              ? group.initialize_git
              : cliArgs.initialize_git !== undefined
                ? cliArgs.initialize_git
                : true,

          install_packages:
            group.install_packages !== undefined
              ? group.install_packages
              : cliArgs.install_packages !== undefined
                ? cliArgs.install_packages
                : true,

          ide: group.ide
            ? group.ide === 'none'
              ? false
              : (group.ide as IDE)
            : cliArgs.ide !== undefined
              ? cliArgs.ide
              : defaultCLIConfig.ide,
        }

        // Update config_key with final selections
        // @ts-expect-error Config key is built up incrementally
        let config_key: Partial<ConfigKey> = ''

        if (mutableConfig.packages && mutableConfig.packages.router) {
          config_key += `${mutableConfig.packages.router as RouterPackage}-`
        } else {
          config_key += 'none-'
        }

        if (mutableConfig.packages && mutableConfig.packages.styles) {
          config_key += `${mutableConfig.packages.styles as StylePackage}-`
        } else {
          config_key += 'none-'
        }

        if (mutableConfig.packages && mutableConfig.packages.database) {
          config_key += `${mutableConfig.packages.database as DatabasePackage}-`
        } else {
          config_key += 'none-'
        }

        if (mutableConfig.packages && mutableConfig.packages.orm) {
          config_key += `${mutableConfig.packages.orm as ORMPackage}`
        } else {
          config_key += 'none'
        }

        config_key = config_key as ConfigKey

        // @ts-expect-error Config object is built from mutableConfig
        config = {
          config_key,
          ...mutableConfig,
        }

        logger.info(`
          Run User Prompt CLI config:${JSON.stringify(config, null, 2)}
        `)

        return config
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli', err)
        throw new Error('Error running prompt CLI: ' + String(err))
      }
    }

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
    if (!cliArgs.y || !cliArgs.project_name) {
      const s = p.spinner()
      s.start('Processing your choices')
      await setTimeout(1000)
      s.stop('Choices processed')
    }

    return config
  } catch (e) {
    if (e === Symbol.for('clack:cancel')) {
      p.cancel('Scaffolding cancelled by user.')
      throw new Error('Scaffolding cancelled by user')
    } else {
      p.cancel('An unexpected error occurred.')
      console.error(e)
    }
    logger.error('🚨🚨 Error running prompt cli', e)
    throw new Error('Error running prompt CLI: ' + String(e))
  }
}
