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
    // DEFINE: initial config with default values ###########################
    const config_key: ConfigKey = `${cliArgs.router as RouterPackage}-${
      (cliArgs.styles as StylePackage) || 'none'
    }-${(cliArgs.database as DatabasePackage) || 'none'}-${
      (cliArgs.orm as ORMPackage) || 'none'
    }`
    const config: CLIResults = {
      config_key,
      ...defaultCLIConfig,
      project_name: cliArgs.project_name || DEFAULT_APP_NAME,
      project_dir:
        cliArgs.project_dir || `./${cliArgs.project_name || DEFAULT_APP_NAME}`,
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

    if (cliArgs.ide !== undefined) {
      config.ide = cliArgs.ide as IDE
    }

    if (!cliArgs.y && !cliArgs.ci) {
      /**
        prompt the user for their desired configuration - skipping values entered
        directly through the CLI
      ###################################################################### */

      try {
        let group: Partial<Omit<Yargs, 'ci' | 'y'>> = {}
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
            p.select({
              message: 'Which database would you like to use?',
              options: [
                { value: 'sqlite', label: 'SQLite' },
                { value: 'none', label: 'Skip' },
              ],
              initialValue: 'sqlite',
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
                  value: 'css',
                  label: 'Vanilla CSS',
                },
              ],
              initialValue: 'tailwind',
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
          group = await p.group(prompts, {
            onCancel: () => {
              p.cancel('Scaffolding cancelled.')
              process.exit(0)
            },
          })
        }

        // DEFINE: config with user prompts ###################################
        /**
         * The 'p.select' prompt returns a generic 'string'. A type assertion (as) is
         * needed to ensure TypeScript recognizes it.
         */
        if (group.project_name) config.project_name = group.project_name

        if (group.router) config.packages.router = group.router as RouterPackage

        if (group.styles)
          config.packages.styles =
            // @ts-expect-error - 'css' is a valid StylePackage
            group.styles === 'css' ? false : (group.styles as StylePackage)

        if (group.database)
          config.packages.database = group.database as DatabasePackage

        if (group.orm) config.packages.orm = group.orm as ORMPackage

        if (group.initialize_git !== undefined)
          config.initialize_git = group.initialize_git

        if (group.install_packages !== undefined)
          config.install_packages = group.install_packages

        if (group.ide) config.ide = group.ide as IDE

        const config_key: ConfigKey = `${config.packages.router as RouterPackage}-${
          (config.packages.styles as StylePackage) || 'none'
        }-${(config.packages.database as DatabasePackage) || 'none'}-${
          (config.packages.orm as ORMPackage) || 'none'
        }`
        config.config_key = config_key

        logger.info(`
          Run User Prompt CLI config:${JSON.stringify(config, null, 2)}
        `)
      } catch (err) {
        logger.error('🚨🚨 Error running prompt cli', err)
        process.exit(1)
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
    } else {
      p.cancel('An unexpected error occurred.')
      console.error(e)
    }
    logger.error('🚨🚨 Error running prompt cli', e)
    process.exit(1)
  }
}
