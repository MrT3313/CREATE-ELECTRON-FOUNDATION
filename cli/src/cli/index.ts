import color from 'picocolors'
import chalk from 'chalk'

// TERMINAL > user prompting
import * as p from '@clack/prompts'

// CONSTS
import { DEFAULT_APP_NAME } from '../consts.js'

// TYPES
import { defaultCLIConfig } from '../types/CLI.js'
import type {
  ConfigKey,
  Yargs,
  CLIResults,
  IDE,
  PromptResults,
} from '../types/index.js'
import type {
  RouterPackage,
  DatabasePackage,
  ORMPackage,
  StylePackage,
} from '../types/Packages.js'

// UTILS
import { logger } from '../utils/logger.js'

/**
 * Type for @clack/prompts group result that returns the specific prompt values
 * to avoid any type
 */
type PromptGroup = Partial<PromptResults>

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
        const router = cliArgs.router ?? defaultCLIConfig.packages.router
        const styles =
          cliArgs.styles !== undefined
            ? cliArgs.styles
            : defaultCLIConfig.packages.styles
        const database =
          cliArgs.database !== undefined
            ? cliArgs.database
            : defaultCLIConfig.packages.database
        const orm =
          cliArgs.orm !== undefined
            ? cliArgs.orm
            : defaultCLIConfig.packages.orm
        const ide =
          cliArgs.ide !== undefined ? cliArgs.ide : defaultCLIConfig.ide
        const initialize_git =
          cliArgs.initialize_git ?? defaultCLIConfig.initialize_git
        const install_packages =
          cliArgs.install_packages ?? defaultCLIConfig.install_packages

        const pkg_manager = cliArgs.pkg_manager ?? defaultCLIConfig.pkg_manager

        const config_key: ConfigKey = `${router}-${styles || 'none'}-${
          database || 'none'
        }-${orm || 'none'}`

        const project_name = cliArgs.project_name || DEFAULT_APP_NAME
        const project_dir = cliArgs.project_dir || `./${project_name}`

        config = {
          project_name,
          project_dir,
          initialize_git,
          install_packages,
          ide,
          pkg_manager,
          packages: {
            router,
            styles,
            database,
            orm,
          },
          config_key,
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
        let group: PromptGroup = {}
        const prompts: Record<string, () => Promise<unknown>> = {}

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
              message: 'Should we initialize an SQLite database?',
              initialValue: true,
            })
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

        // Run prompts if any exist
        if (Object.keys(prompts).length > 0) {
          group = (await p.group(prompts, {
            onCancel: () => {
              p.cancel('Scaffolding cancelled.')
              process.exit(0)
            },
          })) as PromptGroup
        }

        // DEFINE: config with user prompts ###################################
        const project_name =
          (group.project_name as string) ||
          cliArgs.project_name ||
          DEFAULT_APP_NAME

        const router =
          (group.router as RouterPackage) ||
          cliArgs.router ||
          defaultCLIConfig.packages.router

        let styles: StylePackage | false
        if (group.styles !== undefined) {
          styles = group.styles ? 'tailwind' : false
        } else {
          styles = cliArgs.styles ?? defaultCLIConfig.packages.styles
        }

        let database: DatabasePackage | false
        let orm: ORMPackage | false
        if (group.initialize_database !== undefined) {
          database = group.initialize_database ? 'sqlite' : false
          orm = group.initialize_database ? 'drizzle' : false
        } else {
          database = cliArgs.database ?? defaultCLIConfig.packages.database
          orm = cliArgs.orm ?? defaultCLIConfig.packages.orm
        }

        const initialize_git =
          group.initialize_git ??
          cliArgs.initialize_git ??
          defaultCLIConfig.initialize_git

        const install_packages =
          group.install_packages ??
          cliArgs.install_packages ??
          defaultCLIConfig.install_packages

        let ide: IDE | false
        const idePromptResult = group.ide as IDE | 'none' | undefined
        if (idePromptResult) {
          ide = idePromptResult === 'none' ? false : idePromptResult
        } else {
          ide = cliArgs.ide ?? defaultCLIConfig.ide
        }

        const pkg_manager = cliArgs.pkg_manager ?? defaultCLIConfig.pkg_manager

        const config_key: ConfigKey = `${router}-${styles || 'none'}-${
          database || 'none'
        }-${orm || 'none'}`

        const project_dir = cliArgs.project_dir || `./${project_name}`

        config = {
          project_name,
          project_dir,
          initialize_git,
          install_packages,
          ide,
          pkg_manager,
          packages: {
            router,
            styles,
            database,
            orm,
          },
          config_key,
        }
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli', err)
        process.exit(1)
      }
    }

    p.outro(`${color.blue('✨ Generated configuration')}

    ${chalk.green('🔹 Directory:')} ${chalk.yellow(config.project_dir)}
    ${chalk.green('🔹 Project Name:')} ${chalk.yellow(config.project_name)}
    ${chalk.green('🔹 UI Libraries:')} ${chalk.yellow(
      config.packages.router
    )} ${
      config.packages.styles
        ? `+ ${chalk.yellow(config.packages.styles)}`
        : chalk.yellow('Vanilla CSS')
    }
    ${chalk.green('🔹 Database:')} ${
      config.packages.database
        ? chalk.yellow(config.packages.database)
        : chalk.yellow('None')
    } ${config.packages.orm ? `+ ${chalk.yellow(config.packages.orm)}` : ''}
    ${chalk.green('🔹 Initialize Git:')} ${
      config.initialize_git ? chalk.green('Yes') : chalk.red('No')
    }
    ${chalk.green('🔹 Package Manager:')} ${chalk.yellow(config.pkg_manager)}
    `)

    return config
  } catch (err) {
    logger.error('Error in CLI Prompt:', err)
    process.exit(1)
  }
}
