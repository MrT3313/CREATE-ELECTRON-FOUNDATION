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
import { FileSystemError } from '../utils/errors.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

// TYPES
import type { CLIResults, ConfigKey } from '../types/CLI.js'

/**
 * Type for the update function parameters
 */
interface UpdateFunctionParams {
  readonly final?: boolean
}

/**
 * Type for the update functions that copy and set up boilerplate files
 */
type UpdateFunction = (params?: UpdateFunctionParams) => void

/**
 * Type for the update map that contains functions for each configuration
 */
type UpdateMap = Record<ConfigKey, UpdateFunction>

/**
 * Function to select and apply appropriate boilerplate based on user configuration
 * @param config - User's CLI configuration results
 * @throws {FileSystemError} If file operations fail
 */
export const selectBoilerplate = (config: Readonly<CLIResults>): void => {
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
    `${chalk.blue(config.project_name)} ${chalk.green.bold(`Selecting Boilerplate`)} for ${chalk.bold.green(
      config.config_key
    )}...`
  ).start()
  const srcDir = path.join(PKG_ROOT, 'template')

  // Define updateMap as an empty object initially to avoid circular reference issues
  const updateMap: Partial<UpdateMap> = {}

  /**
   * Helper function to safely call update functions from the map
   * Handles the case where a configuration key might not exist
   * @param key - Configuration key to apply
   * @param params - Optional parameters for the update function
   * @throws {Error} If the configuration function does not exist
   */
  const applyConfig = (
    key: ConfigKey,
    params: Readonly<UpdateFunctionParams> = {}
  ): void => {
    const fn = updateMap[key]
    if (typeof fn === 'function') {
      fn(params)
    } else {
      throw new Error(`Configuration function for '${key}' not found`)
    }
  }

  /**
   * Helper function to safely copy files with error handling
   * @param sourcePath - Source path to copy from
   * @param destPath - Destination path to copy to
   * @throws {FileSystemError} If the copy operation fails
   */
  const safeCopy = (sourcePath: string, destPath: string): void => {
    try {
      fs.copySync(sourcePath, destPath)
    } catch (err) {
      throw new FileSystemError('Failed to copy boilerplate files', {
        originalError: err,
        source: sourcePath,
        destination: destPath,
      })
    }
  }

  // Now populate the updateMap with all configuration functions
  updateMap['tanstack-router-none-none-none'] = ({
    final = true,
  }: Readonly<UpdateFunctionParams> = {}): void => {
    // TANSTACK ROUTER ######################################################
    safeCopy(
      path.join(srcDir, 'extras', 'tanstackRouter', 'base', 'routes'),
      path.join(config.project_dir, 'src', 'routes')
    )

    // STYLES ###############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'styles', 'index.css'),
      path.join(config.project_dir, 'index.css')
    )

    // VITE #################################################################
    safeCopy(
      path.join(srcDir, 'configs', 'vite', 'vite.config.withTanstackRouter.ts'),
      path.join(config.project_dir, 'vite.config.ts')
    )

    // MAKEFILE #############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'makefiles', 'makefile.withTanstack.sh'),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    if (final) {
      try {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )

        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      } catch (err) {
        throw new FileSystemError('Failed to finalize routes configuration', {
          originalError: err,
          projectDir: config.project_dir,
        })
      }
    }
  }

  updateMap['tanstack-router-tailwind-none-none'] = ({
    final = true,
  }: Readonly<UpdateFunctionParams> = {}): void => {
    // TANSTACK ROUTER ######################################################
    safeCopy(
      path.join(srcDir, 'extras', 'tanstackRouter', 'with-tailwind', 'routes'),
      path.join(config.project_dir, 'src', 'routes')
    )

    // STYLES ###############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind-index.css'),
      path.join(config.project_dir, 'index.css')
    )

    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind.config.ts'),
      path.join(config.project_dir, 'tailwind.config.ts')
    )

    // VITE #################################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'vite',
        'vite.config.withTanstackRouter.withTailwind.ts'
      ),
      path.join(config.project_dir, 'vite.config.ts')
    )

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'makefiles', 'makefile.withTanstack.sh'),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    if (final) {
      try {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )
        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      } catch (err) {
        throw new FileSystemError('Failed to finalize routes configuration', {
          originalError: err,
          projectDir: config.project_dir,
        })
      }
    }
  }

  updateMap['tanstack-router-tailwind-sqlite-drizzle'] = () => {
    applyConfig('tanstack-router-tailwind-none-none', { final: false })

    // DATABASE #############################################################
    selectBoilerplateElectronDatabase(config)

    // DRIZZLE ##############################################################
    selectBoilerplateDrizzle(config)

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'makefiles',
        'makefile.withTanstack.withDatabase.sh'
      ),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    safeCopy(
      path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
      path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
    )

    fs.removeSync(
      path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
    )
  }

  updateMap['tanstack-router-none-sqlite-drizzle'] = () => {
    applyConfig('tanstack-router-none-none-none', { final: false })

    // DATABASE #############################################################
    selectBoilerplateElectronDatabase(config)

    // DRIZZLE ##############################################################
    selectBoilerplateDrizzle(config)

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'makefiles',
        'makefile.withTanstack.withDatabase.sh'
      ),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    safeCopy(
      path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
      path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
    )

    fs.removeSync(
      path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
    )
  }

  updateMap['react-router-none-none-none'] = ({
    final = true,
  }: Readonly<UpdateFunctionParams> = {}): void => {
    // REACT ROUTER #########################################################
    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'base', 'routes'),
      path.join(config.project_dir, 'src', 'routes')
    )

    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'base', 'App.tsx'),
      path.join(config.project_dir, 'src', 'App.tsx')
    )
    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'base', 'main.tsx'),
      path.join(config.project_dir, 'src', 'main.tsx')
    )

    // STYLES ###############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'styles', 'index.css'),
      path.join(config.project_dir, 'index.css')
    )

    // VITE #################################################################
    safeCopy(
      path.join(srcDir, 'configs', 'vite', 'vite.config.withReactRouter.ts'),
      path.join(config.project_dir, 'vite.config.ts')
    )

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'makefiles', 'makefile.withReactRouter.sh'),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    if (final) {
      try {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )

        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      } catch (err) {
        throw new FileSystemError('Failed to finalize routes configuration', {
          originalError: err,
          projectDir: config.project_dir,
        })
      }
    }
  }

  updateMap['react-router-tailwind-none-none'] = ({
    final = true,
  }: Readonly<UpdateFunctionParams> = {}): void => {
    // REACT ROUTER #########################################################
    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'routes'),
      path.join(config.project_dir, 'src', 'routes')
    )
    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'App.tsx'),
      path.join(config.project_dir, 'src', 'App.tsx')
    )
    safeCopy(
      path.join(srcDir, 'extras', 'reactRouter', 'with-tailwind', 'main.tsx'),
      path.join(config.project_dir, 'src', 'main.tsx')
    )

    // STYLES ###############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind-index.css'),
      path.join(config.project_dir, 'index.css')
    )

    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind.config.ts'),
      path.join(config.project_dir, 'tailwind.config.ts')
    )

    // VITE #################################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'vite',
        'vite.config.withReactRouter.withTailwind.ts'
      ),
      path.join(config.project_dir, 'vite.config.ts')
    )

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(srcDir, 'configs', 'makefiles', 'makefile.withReactRouter.sh'),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    if (final) {
      try {
        fs.renameSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx'),
          path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
        )
        fs.removeSync(
          path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx')
        )
      } catch (err) {
        throw new FileSystemError('Failed to finalize routes configuration', {
          originalError: err,
          projectDir: config.project_dir,
        })
      }
    }
  }

  updateMap['react-router-tailwind-sqlite-drizzle'] = () => {
    applyConfig('react-router-tailwind-none-none', { final: false })

    // DATABASE #############################################################
    selectBoilerplateElectronDatabase(config)

    // DRIZZLE ##############################################################
    selectBoilerplateDrizzle(config)

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'makefiles',
        'makefile.withReactRouter.withDatabase.sh'
      ),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    safeCopy(
      path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
      path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
    )
    fs.removeSync(
      path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
    )
  }

  updateMap['react-router-none-sqlite-drizzle'] = () => {
    applyConfig('react-router-none-none-none', { final: false })

    // DATABASE #############################################################
    selectBoilerplateElectronDatabase(config)

    // DRIZZLE ##############################################################
    selectBoilerplateDrizzle(config)

    // MAKEFILE ##############################################################
    safeCopy(
      path.join(
        srcDir,
        'configs',
        'makefiles',
        'makefile.withReactRouter.withDatabase.sh'
      ),
      path.join(config.project_dir, 'makefile')
    )

    // overwrite / specify how we are fetching data
    safeCopy(
      path.join(config.project_dir, 'src', 'routes', 'resources-db.tsx'),
      path.join(config.project_dir, 'src', 'routes', 'resources.tsx')
    )
    fs.removeSync(
      path.join(config.project_dir, 'src', 'routes', 'resources-api.tsx')
    )
  }

  try {
    const configKey = config.config_key as ConfigKey
    const updateFunction = updateMap[configKey]

    if (!updateFunction) {
      throw new Error(`No configuration found for key: ${configKey}`)
    }

    updateFunction()

    spinner.succeed(
      `${chalk.blue(config.project_name)} ${chalk.bold.green('Boilerplate selected')} successfully for ${chalk.green(
        config.config_key
      )}`
    )
  } catch (e) {
    spinner.fail(
      `${chalk.blue(config.project_name)} ${chalk.red('Error selecting boilerplate')}`
    )
    logger.error('🚨🚨 Error selecting boilerplate', e)
    process.exit(1)
  }
}
