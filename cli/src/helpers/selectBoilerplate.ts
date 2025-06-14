import path from 'path'
import fs from 'fs-extra'

// TERMINAL
import ora from 'ora'
import chalk from 'chalk'

// HELPERS
import { selectBoilerplateDrizzle } from './selectBoilerplate.drizzle.js'
import { selectBoilerplateElectronDatabase } from './selectBoilerplate.electron.database.js'

// UTILS
import { logger } from '../utils/logger.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'

export const selectBoilerplate = (config: CLIResults) => {
  /**
   * ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
   * This is a very important function
   *
   * It is responsible for copying the correct template files for the current
   * user configuration
   *
   * The "brain" of this logic is in the "updateMap" object which is a map of
   * functions. The key for this "brain" is the config_key generated earlier.
   *
   * CONFIG KEY STRUCTURE: [router]-[styles]-[database]-[orm]
   *
   * As the various configurations are "tiered" so is the logic within the
   * "udpateMap".
   *
   * EXAMPLE:
   *    A) config.config_key === 'tanstack-router-none-none-none'
   *    B) config.config_key === 'tanstack-router-tailwind-none-none'
   *    C) config.config_key === 'tanstack-router-tailwind-sqlite-drizzle'
   *
   *    updateMap['tanstack-router-tailwind-sqlite-drizzle']()
   *      will call updateMap['tanstack-router-tailwind-none-none']() and build from there
   *    updateMap['tanstack-router-tailwind-none-none']()
   *      will call updateMap['tanstack-router-none-none-none']() and build from there
   *    updateMap['tanstack-router-none-none-none']
   *      has no dependencies
   *
   *    The same logic applies for other configurations
   *    D) config.config_key === 'react-router-none-none-none'
   *    E) config.config_key === 'react-router-tailwind-none-none'
   *    F) config.config_key === 'react-router-tailwind-sqlite-drizzle'
   * ⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️
   * ####################################################################### */

  const spinner = ora(
    `${config.project_name} ${chalk.bold('Selecting Boilerplate')}...`
  ).start()
  const srcDir = path.join(PKG_ROOT, 'template')

  // TODO: fix typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMap: any = {
    'tanstack-router-none-none-none': ({
      final = true,
    }: {
      final?: boolean
    } = {}) => {
      // TANSTACK ROUTER ######################################################
      fs.copySync(
        path.join(srcDir, 'extras', 'tanstackRouter', 'base', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      // STYLES ###############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'styles', 'index.css'),
        path.join(config.project_dir, 'index.css')
      )

      // VITE #################################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'vite',
          'vite.config.withTanstackRouter.ts'
        ),
        path.join(config.project_dir, 'vite.config.ts')
      )

      // MAKEFILE #############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'makefiles', 'makefile.withTanstack.sh'),
        path.join(config.project_dir, 'makefile')
      )

      // overwrite / specify how we are fetching data
      if (final) {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )

        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      }
    },
    'tanstack-router-tailwind-none-none': ({
      final = true,
    }: {
      final?: boolean
    } = {}) => {
      // TANSTACK ROUTER ######################################################
      fs.copySync(
        path.join(
          srcDir,
          'extras',
          'tanstackRouter',
          'with-tailwind',
          'routes'
        ),
        path.join(config.project_dir, 'src', 'routes')
      )

      // STYLES ###############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'tailwind', 'tailwind-index.css'),
        path.join(config.project_dir, 'index.css')
      )

      fs.copySync(
        path.join(srcDir, 'configs', 'tailwind', 'tailwind.config.ts'),
        path.join(config.project_dir, 'tailwind.config.ts')
      )

      // VITE #################################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'vite',
          'vite.config.withTanstackRouter.withTailwind.ts'
        ),
        path.join(config.project_dir, 'vite.config.ts')
      )

      // MAKEFILE ##############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'makefiles', 'makefile.withTanstack.sh'),
        path.join(config.project_dir, 'makefile')
      )

      // overwrite / specify how we are fetching data
      if (final) {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )
        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      }
    },
    'tanstack-router-tailwind-sqlite-drizzle': () => {
      updateMap['tanstack-router-tailwind-none-none']({ final: false })

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)

      // MAKEFILE ##############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withTanstack.withDatabase.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )

      // overwrite / specify how we are fetching data
      fs.renameSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
        path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
      )

      fs.removeSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
      )
    },
    'tanstack-router-none-sqlite-drizzle': () => {
      updateMap['tanstack-router-none-none-none']({ final: false })

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)

      // MAKEFILE ##############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withTanstack.withDatabase.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )

      // overwrite / specify how we are fetching data
      fs.renameSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
        path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
      )

      fs.removeSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
      )
    },
    'react-router-none-none-none': ({
      final = true,
    }: {
      final?: boolean
    } = {}) => {
      // REACT ROUTER #########################################################
      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'base', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'base', 'App.tsx'),
        path.join(config.project_dir, 'src', 'App.tsx')
      )
      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'base', 'main.tsx'),
        path.join(config.project_dir, 'src', 'main.tsx')
      )

      // STYLES ###############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'styles', 'index.css'),
        path.join(config.project_dir, 'index.css')
      )

      // VITE #################################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'vite', 'vite.config.withReactRouter.ts'),
        path.join(config.project_dir, 'vite.config.ts')
      )

      // MAKEFILE #############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withReactRouter.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )

      if (final) {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )
        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      }
    },
    'react-router-tailwind-none-none': ({
      final = true,
    }: {
      final?: boolean
    } = {}) => {
      // REACT ROUTER #########################################################
      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'App.tsx'),
        path.join(config.project_dir, 'src', 'App.tsx')
      )
      fs.copySync(
        path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'main.tsx'),
        path.join(config.project_dir, 'src', 'main.tsx')
      )

      // STYLES ###############################################################
      fs.copySync(
        path.join(srcDir, 'configs', 'tailwind', 'tailwind-index.css'),
        path.join(config.project_dir, 'index.css')
      )

      fs.copySync(
        path.join(srcDir, 'configs', 'tailwind', 'tailwind.config.ts'),
        path.join(config.project_dir, 'tailwind.config.ts')
      )

      // VITE #################################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'vite',
          'vite.config.withReactRouter.withTailwind.ts'
        ),
        path.join(config.project_dir, 'vite.config.ts')
      )

      // MAKEFILE #############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withReactRouter.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )

      if (final) {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )
        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      }
    },
    'react-router-tailwind-sqlite-drizzle': () => {
      updateMap['react-router-tailwind-none-none']({ final: false })

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)

      // MAKEFILE #############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withReactRouter.withDatabase.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )
      fs.renameSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
        path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
      )
      fs.removeSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
      )
    },
    'react-router-none-sqlite-drizzle': () => {
      updateMap['react-router-none-none-none']({ final: false })

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)

      // MAKEFILE #############################################################
      fs.copySync(
        path.join(
          srcDir,
          'configs',
          'makefiles',
          'makefile.withReactRouter.withDatabase.sh'
        ),
        path.join(config.project_dir, 'makefile')
      )
      fs.renameSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
        path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
      )
      fs.removeSync(
        path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
      )
    },
  }

  try {
    logger.debug('🔍🔍 config.config_key', config.config_key)
    updateMap[config.config_key]()

    spinner.succeed(
      `${config.project_name} ${chalk.bold.green('Boilerplate selected')} successfully`
    )
  } catch (e) {
    spinner.fail(
      `${config.project_name} ${chalk.red('Error selecting boilerplate')}`
    )
    logger.error('🚨🚨 Error selecting boilerplate', e)
    process.exit(1)
  }
}
