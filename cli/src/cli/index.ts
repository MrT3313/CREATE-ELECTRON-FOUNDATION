import { setTimeout } from 'node:timers/promises'
import color from 'picocolors'

// TERMINAL > user prompting
import * as p from '@clack/prompts'

// CONSTS
import { DEFAULT_APP_NAME } from '../consts.js'
// TYPES
import type { CLIDefaults, CLIResults, CLIArgs } from '../types/CLI.js'
import type {
  DatabasePackages,
  ORMPackages,
  RouterPackages,
} from '../types/Packages.js'

// UTILS
import { logger } from '../utils/logger.js'

const defaultConfig: CLIDefaults = {
  pkgManager: 'npm',
  initializeGit: false,
  installDependencies: true,
  runMigrations: true,
  packages: {
    router: ['tanstack-router'],
    styles: ['tailwind'],
    database: ['sqlite'],
    orm: ['drizzle'],
    // tables: ["tanstack-table"],
    // forms: ["tanstack-forms"],
  },
  ci: false,
}

export const runUserPromptCli = async (
  cliArgs: CLIArgs = {}
): Promise<CLIResults> => {
  p.intro(`${color.bgCyan(color.black('create-electron-foundation'))}`)

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let group: any = {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const prompts: Record<string, any> = {}

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

    // Skip other prompts only if -y is passed
    if (!cliArgs.skipPrompts) {
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

      prompts.initialize_database = () =>
        p.confirm({
          message: 'Should we initialize a database?',
          initialValue: true,
        })

      if (!cliArgs.database) {
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

      if (!cliArgs.orm) {
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

      if (!cliArgs.styles) {
        prompts.useTailwind = () =>
          p.confirm({
            message: 'Will you be using Tailwind CSS for styling?',
            initialValue: true,
          })
      }

      if (cliArgs.initialize_git === undefined) {
        prompts.initializeGit = () =>
          p.confirm({
            message:
              'Should we initialize a Git repository and stage the changes?',
            initialValue: true,
          })
      }

      if (cliArgs.install_dependencies === undefined) {
        prompts.installDependencies = () =>
          p.confirm({
            message: 'Should we install dependencies after scaffolding?',
            initialValue: true,
          })
      }
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

    const project_name =
      cliArgs.project_name || group.project_name || DEFAULT_APP_NAME
    const router = cliArgs.router || group.router || 'tanstack-router'
    const initialize_database = cliArgs.skipPrompts
      ? true
      : (group.initialize_database ?? false)
    const database =
      cliArgs.database ||
      (initialize_database ? group.database || 'sqlite' : null)
    const initializeORM = cliArgs.skipPrompts
      ? true
      : (group.initializeORM ?? false)
    const orm =
      cliArgs.orm ||
      (initialize_database && initializeORM ? group.orm || 'drizzle' : null)
    const useTailwind =
      cliArgs.styles === 'tailwind' ||
      (cliArgs.styles === undefined &&
        (cliArgs.skipPrompts ? true : (group.useTailwind ?? true)))
    const initializeGit = cliArgs.ci
      ? false
      : cliArgs.initialize_git !== undefined
        ? cliArgs.initialize_git
        : cliArgs.skipPrompts
          ? false
          : (group.initializeGit ?? false)
    const installDependencies =
      cliArgs.install_dependencies !== undefined
        ? cliArgs.install_dependencies
        : cliArgs.skipPrompts
          ? true
          : (group.installDependencies ?? true)
    const runMigrations =
      cliArgs.run_migrations !== undefined
        ? cliArgs.run_migrations
        : cliArgs.skipPrompts
          ? true
          : (group.runMigrations ?? true)

    const config: CLIResults = {
      project_name,
      projectDir: `./${project_name}`,
      ...defaultConfig,
      initializeGit,
      installDependencies,
      runMigrations,
      packages: {
        ...defaultConfig.packages,
        router: [router as RouterPackages],
        styles: useTailwind ? ['tailwind'] : ['css'],
        database: database ? [database as DatabasePackages] : [],
        orm: orm ? [orm as ORMPackages] : [],
      },
    }

    p.note(
      `
      Project Name: ${config.project_name}
      Router: ${config.packages.router}
      Styles: ${config.packages.styles}${
        database
          ? `
      Database: ${config.packages.database}`
          : ''
      }${
        orm
          ? `
      ORM: ${config.packages.orm}`
          : ''
      }
      Install Dependencies: ${config.installDependencies}
      Run Migrations: ${config.runMigrations}
      Initialize Git: ${config.initializeGit}`,
      'Summary of your choices:'
    )

    if (!cliArgs.skipPrompts || !cliArgs.project_name) {
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
