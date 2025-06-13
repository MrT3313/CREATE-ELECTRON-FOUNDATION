import { setTimeout } from 'node:timers/promises'
import color from 'picocolors'

// TERMINAL > user prompting
import * as p from '@clack/prompts'

// CONSTS
import { DEFAULT_APP_NAME } from '../consts.js'

// TYPES
import type { ConfigKey, Yargs, CLIResults } from '../types/CLI.js'
import { defaultCLIConfig } from '../types/CLI.js'
import type {
  RouterPackage,
  DatabasePackage,
  ORMPackage,
  StylePackage,
} from '../types/Packages.js'

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
    let config: CLIResults

    if (cliArgs.y || cliArgs.ci) {
      /**
        If --yes | -y | ci is passed in the CLI, we can skip the prompts and use 
        the passed cliArgs or fallback on the default values

        There is no user prompting in this flow
      ######################################################################## */

      try {
        // DEFINE: initial config with default values ###########################
        const config_key: ConfigKey = `${cliArgs.router as RouterPackage}-${(cliArgs.styles as StylePackage) || 'none'}-${(cliArgs.database as DatabasePackage) || 'none'}-${(cliArgs.orm as ORMPackage) || 'none'}`
        config = {
          config_key,
          ...defaultCLIConfig,
          project_name: cliArgs.project_name || DEFAULT_APP_NAME,
          project_dir: `./${cliArgs.project_name || DEFAULT_APP_NAME}`,
        }

        // UPDATE: config with passed cliArgs #################################
        if (cliArgs.router) {
          config.packages.router = cliArgs.router as RouterPackage
        }

        if (cliArgs.styles !== undefined) {
          config.packages.styles = cliArgs.styles as StylePackage
        }

        if (cliArgs.database !== undefined) {
          config.packages.database = cliArgs.database as DatabasePackage
        }

        if (cliArgs.orm !== undefined) {
          config.packages.orm = cliArgs.orm as ORMPackage
        }

        if (cliArgs.initialize_git) {
          config.initialize_git = cliArgs.initialize_git
        }
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli --yes', err)
        process.exit(1)
      }
    } else {
      /**
        prompt the user for their desired configuration - skipping values entered
        directly through the CLI
      ###################################################################### */

      try {
        // TODO: fix typing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let group: any = {}
        // TODO: fix typing
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prompts: Record<string, any> = {}

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

        // DATABASE ###########################################################
        if (cliArgs.database === undefined) {
          prompts.initialize_database = () =>
            p.confirm({
              message: 'Should we initialize a database?',
              initialValue: true,
            })

          // TODO: fix typing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prompts.database = ({ results }: { results: any }) => {
            if (results.initialize_database) {
              return p.select({
                message: 'Which database would you like to use?',
                options: [
                  {
                    value: 'sqlite',
                    label: 'SQLite',
                  },
                ],
                initialValue: 'sqlite',
              })
            }
            return Promise.resolve(null)
          }
        }

        // ORM ################################################################
        if (cliArgs.orm === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prompts.initializeORM = ({ results }: { results: any }) => {
            if (results.initialize_database) {
              return p.confirm({
                message: 'Should we initialize an ORM?',
                initialValue: true,
              })
            }
            return Promise.resolve(false)
          }

          // TODO: fix typing
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          prompts.orm = ({ results }: { results: any }) => {
            if (results.initialize_database && results.initializeORM) {
              return p.select({
                message: 'Which ORM would you like to use?',
                options: [
                  {
                    value: 'drizzle',
                    label: 'Drizzle',
                  },
                ],
                initialValue: 'drizzle',
              })
            }
            return Promise.resolve(null)
          }
        }

        // STYLES #############################################################
        if (cliArgs.styles === undefined) {
          prompts.styles = () =>
            p.confirm({
              message: 'Will you be using Tailwind CSS for styling?',
              initialValue: true,
            })
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

        // INSTALL PACKAGES ###################################################
        // TODO: add this to the prompts (if node issues are resolved with native modules & better-sqlite3)

        // Run prompts if any exist
        if (Object.keys(prompts).length > 0) {
          group = await p.group(prompts, {
            onCancel: () => {
              p.cancel('Scaffolding cancelled.')
              process.exit(0)
            },
          })
        }

        // DEFINE: config with user prompts ###################################
        const initialize_git = group.initialize_git || cliArgs.initialize_git
        const router = group.router || cliArgs.router
        const styles = group.styles ? 'tailwind' : cliArgs.styles
        const database = group.database || cliArgs.database
        const project_name = group.project_name || cliArgs.project_name
        const orm = group.orm || cliArgs.orm

        const config_key: ConfigKey = `${router as RouterPackage}-${(styles as StylePackage) || 'none'}-${(database as DatabasePackage) || 'none'}-${(orm as ORMPackage) || 'none'}`

        config = {
          config_key,
          project_name: project_name || DEFAULT_APP_NAME,
          project_dir: `./${project_name || DEFAULT_APP_NAME}`,
          pkg_manager: 'npm',
          initialize_git,
          packages: {
            router,
            styles: styles as StylePackage,
            database,
            orm,
          },
        }
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli', err)
        process.exit(1)
      }
    }

    p.note(
      `
      Project Name: ${config.project_name}
      Router: ${config?.packages?.router}
      Styles: ${config?.packages?.styles}
      Database: ${config?.packages?.database}
      ORM: ${config?.packages?.orm}
      Initialize Git: ${config.initialize_git}`,
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
    } else {
      p.cancel('An unexpected error occurred.')
      console.error(e)
    }
    logger.error('🚨🚨 Error running prompt cli', e)
    process.exit(1)
  }
}
