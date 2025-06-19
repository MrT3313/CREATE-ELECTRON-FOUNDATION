import color from 'picocolors'

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
        // DEFINE: initial config with default values ###########################
        const config_key: ConfigKey = `${cliArgs.router as RouterPackage}-${
          (cliArgs.styles as StylePackage) || 'none'
        }-${(cliArgs.database as DatabasePackage) || 'none'}-${
          (cliArgs.orm as ORMPackage) || 'none'
        }`

        // Create a mutable configuration object that will be modified with cli args
        const mutableConfig = {
          config_key,
          ...defaultCLIConfig,
          project_name: cliArgs.project_name || DEFAULT_APP_NAME,
          project_dir:
            cliArgs.project_dir ||
            `./${cliArgs.project_name || DEFAULT_APP_NAME}`,
          packages: {
            ...defaultCLIConfig.packages,
          },
        }

        // UPDATE: config with passed cliArgs #################################
        if (cliArgs.router) {
          mutableConfig.packages.router = cliArgs.router as RouterPackage
        }

        if (cliArgs.styles !== undefined) {
          mutableConfig.packages.styles = cliArgs.styles as StylePackage
        }

        if (cliArgs.database !== undefined) {
          mutableConfig.packages.database = cliArgs.database as DatabasePackage
        }

        if (cliArgs.orm !== undefined) {
          mutableConfig.packages.orm = cliArgs.orm as ORMPackage
        }

        if (cliArgs.initialize_git) {
          mutableConfig.initialize_git = cliArgs.initialize_git
        }

        if (cliArgs.ide !== undefined) {
          mutableConfig.ide = cliArgs.ide as IDE
        }

        // Assign the mutable config to the readonly config variable
        config = mutableConfig as CLIResults
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
        const project_name = group.project_name || cliArgs.project_name

        const router = group.router || cliArgs.router // group.router prompt is skipped if --router=<...> is passed in the CLI

        const styles = group.styles || cliArgs.styles // group.styles prompt is skipped if --styles=<...> is passed in the CLI

        const database = group.database || cliArgs.database // group.database prompt is skipped if --database=<...> is passed in the CLI

        const orm = group.orm || cliArgs.orm

        const initialize_git = group.initialize_git || cliArgs.initialize_git // group.initialize_git prompt is skipped if --initialize_git=<...> is passed in the CLI

        const install_packages =
          group.install_packages || cliArgs.install_packages // group.install_packages prompt is skipped if --install_packages=<...> is passed in the CLI

        const ide = group.ide || cliArgs.ide // group.ide prompt is skipped if --ide=<...> is passed in the CLI

        // Ensure we have valid values for all required fields or use defaults
        const routerValue =
          (router as RouterPackage) || defaultCLIConfig.packages.router
        const stylesValue =
          typeof styles === 'boolean'
            ? styles
              ? ('tailwind' as StylePackage)
              : false
            : (styles as StylePackage) || defaultCLIConfig.packages.styles

        const databaseValue =
          typeof database === 'boolean'
            ? database
              ? ('sqlite' as DatabasePackage)
              : false
            : (database as DatabasePackage) ||
              defaultCLIConfig.packages.database

        const ormValue =
          typeof orm === 'boolean'
            ? orm
              ? ('drizzle' as ORMPackage)
              : false
            : (orm as ORMPackage) || defaultCLIConfig.packages.orm

        const config_key: ConfigKey = `${routerValue}-${
          stylesValue || 'none'
        }-${databaseValue || 'none'}-${ormValue || 'none'}`

        // Create config object with proper typing
        config = {
          config_key,
          project_name: project_name || DEFAULT_APP_NAME,
          project_dir:
            cliArgs.project_dir || `./${project_name || DEFAULT_APP_NAME}`,
          pkg_manager: defaultCLIConfig.pkg_manager,
          ide: (ide || defaultCLIConfig.ide) as IDE | false,
          initialize_git: Boolean(
            initialize_git ?? defaultCLIConfig.initialize_git
          ),
          packages: {
            router: routerValue,
            styles: stylesValue,
            database: databaseValue,
            orm: ormValue,
          },
          install_packages: Boolean(
            install_packages ?? defaultCLIConfig.install_packages
          ),
        }
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli', err)
        process.exit(1)
      }
    }

    p.outro(`${color.blue('✨ Generated configuration')}

    ${color.green('🔹 Directory:')} ${color.yellow(config.project_dir)}
    ${color.green('🔹 Project Name:')} ${color.yellow(config.project_name)}
    ${color.green('🔹 UI Libraries:')} ${color.yellow(
      config.packages.router
    )} ${
      config.packages.styles
        ? `+ ${color.yellow(config.packages.styles)}`
        : color.yellow('Vanilla CSS')
    }
    ${color.green('🔹 Database:')} ${
      config.packages.database
        ? color.yellow(config.packages.database)
        : color.yellow('None')
    } ${config.packages.orm ? `+ ${color.yellow(config.packages.orm)}` : ''}
    ${color.green('🔹 Initialize Git:')} ${
      config.initialize_git ? color.green('Yes') : color.red('No')
    }
    ${color.green('🔹 Package Manager:')} ${color.yellow(config.pkg_manager)}
    `)

    return config
  } catch (err) {
    logger.error('Error in CLI Prompt:', err)
    process.exit(1)
  }
}
