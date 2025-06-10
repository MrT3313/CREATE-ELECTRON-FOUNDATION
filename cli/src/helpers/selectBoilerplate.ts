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
  const spinner = ora(
    `${config.project_name} ${chalk.bold('Selecting Boilerplate')}...`
  ).start()
  const srcDir = path.join(PKG_ROOT, 'template/extras')

  console.log('THE CONFIG KEY', config.config_key)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateMap: any = {
    'tanstack-router-none-none-none': () => {
      // TANSTACK ROUTER > base (no tailwind) #################################
      fs.copySync(
        path.join(srcDir, 'tanstackRouter', 'base', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      // STYLES > css #########################################################
      fs.copySync(
        path.join(srcDir, 'styles', 'index.css'),
        path.join(config.project_dir, 'index.css')
      )

      // VITE > with tanstack (no tailwind) ###################################
      fs.copySync(
        path.join(srcDir, 'tanstackRouter', 'base', 'config', 'vite.config.ts'),
        path.join(config.project_dir, 'vite.config.ts')
      )
    },
    'tanstack-router-tailwind-none-none': () => {
      // TANSTACK ROUTER > base (with tailwind) ###############################
      fs.copySync(
        path.join(srcDir, 'tanstackRouter', 'with-tailwind', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      // STYLES > tailwind ####################################################
      fs.copySync(
        path.join(srcDir, 'styles', 'tailwind-index.css'),
        path.join(config.project_dir, 'index.css')
      )

      // VITE > with tanstack (with tailwind) #################################
      fs.copySync(
        path.join(
          srcDir,
          'tanstackRouter',
          'with-tailwind',
          'config',
          'vite.config.ts'
        ),
        path.join(config.project_dir, 'vite.config.ts')
      )
    },
    'tanstack-router-tailwind-sqlite-drizzle': () => {
      updateMap['tanstack-router-tailwind-none-none']()

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)
    },
    'react-router-tailwind-none-none': () => {
      // REACT ROUTER > base (no tailwind) ####################################
      fs.copySync(
        path.join(srcDir, 'reactRouter', 'with-tailwind', 'routes'),
        path.join(config.project_dir, 'src', 'routes')
      )

      fs.copySync(
        path.join(srcDir, 'reactRouter', 'with-tailwind', 'App.tsx'),
        path.join(config.project_dir, 'src', 'App.tsx')
      )

      fs.copySync(
        path.join(srcDir, 'reactRouter', 'with-tailwind', 'main.tsx'),
        path.join(config.project_dir, 'src', 'main.tsx')
      )

      // STYLES
      fs.copySync(
        path.join(srcDir, 'styles', 'tailwind-index.css'),
        path.join(config.project_dir, 'index.css')
      )

      // VITE
      fs.copySync(
        path.join(
          srcDir,
          'reactRouter',
          'with-tailwind',
          'config',
          'vite.config.ts'
        ),
        path.join(config.project_dir, 'vite.config.ts')
      )
    },
    'react-router-tailwind-sqlite-drizzle': () => {
      updateMap['react-router-tailwind-none-none']()

      // DATABASE #############################################################
      selectBoilerplateElectronDatabase(config)

      // DRIZZLE ##############################################################
      selectBoilerplateDrizzle(config)
    },
  }

  try {
    console.log('NOW PLEASE FUCK ME HERE', config.config_key)
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
