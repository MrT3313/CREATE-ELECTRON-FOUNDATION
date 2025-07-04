import path from 'path'
import fs from 'fs-extra'
import ora from 'ora'
import chalk from 'chalk'

import { PKG_ROOT } from '../consts.js'
import { logger } from '../utils/logger.js'
import { FileSystemError } from '../utils/errors.js'
import type { CLIResults } from '../types/CLI.js'
import { selectBoilerplateDrizzle } from './selectBoilerplate.drizzle.js'
import { selectBoilerplateElectronDatabase } from './selectBoilerplate.electron.database.js'
import { safeCopy } from '../utils/safeCopy.js'

const srcDir = path.join(PKG_ROOT, 'template')

const handleRouter = (config: Readonly<CLIResults>) => {
  const { router, styles } = config.packages
  const projectDir = config.project_dir
  const routerSrc = path.join(srcDir, 'extras')

  const isTailwind = styles === 'tailwind'
  const routerDest = path.join(projectDir, 'src')

  if (router === 'react-router') {
    const reactRouterSrc = isTailwind
      ? path.join(routerSrc, 'reactRouter', 'with-tailwind')
      : path.join(routerSrc, 'reactRouter', 'base')

    safeCopy(
      path.join(reactRouterSrc, 'routes'),
      path.join(routerDest, 'routes')
    )
    safeCopy(
      path.join(reactRouterSrc, 'App.tsx'),
      path.join(routerDest, 'App.tsx')
    )
    safeCopy(
      path.join(reactRouterSrc, 'main.tsx'),
      path.join(routerDest, 'main.tsx')
    )
  } else if (router === 'tanstack-router') {
    const tanstackSrc = isTailwind
      ? path.join(routerSrc, 'tanstackRouter', 'with-tailwind')
      : path.join(routerSrc, 'tanstackRouter', 'base')

    safeCopy(path.join(tanstackSrc, 'routes'), path.join(routerDest, 'routes'))
  }
}

const handleStyles = (config: Readonly<CLIResults>) => {
  if (config.packages.styles === 'tailwind') {
    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind-index.css'),
      path.join(config.project_dir, 'index.css')
    )
    safeCopy(
      path.join(srcDir, 'configs', 'tailwind', 'tailwind.config.ts'),
      path.join(config.project_dir, 'tailwind.config.ts')
    )
  } else {
    safeCopy(
      path.join(srcDir, 'configs', 'styles', 'index.css'),
      path.join(config.project_dir, 'index.css')
    )
  }
}

const handleViteConfig = (config: Readonly<CLIResults>) => {
  const { router, styles, database, orm } = config.packages
  let viteConfig = 'vite.config'
  if (router) {
    if (router === 'react-router') {
      viteConfig += `.withReactRouter`
    }
    if (router === 'tanstack-router') {
      viteConfig += `.withTanstackRouter`
    }
  }
  if (styles) viteConfig += `.withTailwind`
  if (database && orm) viteConfig += `.withDrizzle`
  viteConfig += '.ts'

  const viteConfigPath = path.join(srcDir, 'configs', 'vite', viteConfig)

  if (fs.existsSync(viteConfigPath)) {
    safeCopy(viteConfigPath, path.join(config.project_dir, 'vite.config.ts'))
  } else {
    logger.warn(
      `No specific Vite config found for: ${viteConfig}, using default.`
    )
    safeCopy(
      path.join(srcDir, 'configs', 'vite', 'vite.config.withTanstackRouter.ts'),
      path.join(config.project_dir, 'vite.config.ts')
    )
  }
}

const handleMakefile = (config: Readonly<CLIResults>) => {
  const { router, database } = config.packages

  let makefile = 'makefile'

  if (router === 'react-router') {
    makefile += '.withReactRouter'
  } else if (router === 'tanstack-router') {
    makefile += '.withTanstack'
  }

  if (database) makefile += '.withDatabase'

  makefile += '.sh'

  const makefilePath = path.join(srcDir, 'configs', 'makefiles', makefile)

  if (fs.existsSync(makefilePath)) {
    safeCopy(makefilePath, path.join(config.project_dir, 'makefile'))
  } else {
    logger.warn(`No specific Makefile found for: ${makefile}, using default.`)
    safeCopy(
      path.join(srcDir, 'configs', 'makefiles', 'makefile.withTanstack.sh'),
      path.join(config.project_dir, 'makefile')
    )
  }
}

const handleDatabase = (config: Readonly<CLIResults>) => {
  if (!config.packages.database) return

  selectBoilerplateElectronDatabase(config)
  if (config.packages.orm === 'drizzle') {
    selectBoilerplateDrizzle(config)
  }

  // Copy preload script
  safeCopy(
    path.join(srcDir, 'extras', 'electron', 'preload', 'index-with-db.ts'),
    path.join(config.project_dir, 'electron', 'preload', 'index.ts')
  )
}

const finalizeResourceRoute = (config: Readonly<CLIResults>) => {
  const useDb = !!config.packages.database
  const resourcesFile = useDb ? 'resources-db.tsx' : 'resources-api.tsx'
  const finalPath = path.join(
    config.project_dir,
    'src',
    'routes',
    'resources.tsx'
  )

  try {
    fs.renameSync(
      path.join(config.project_dir, 'src', 'routes', resourcesFile),
      finalPath
    )
    fs.removeSync(
      path.join(
        config.project_dir,
        'src',
        'routes',
        useDb ? 'resources-api.tsx' : 'resources-db.tsx'
      )
    )
  } catch (err) {
    throw new FileSystemError(
      'Failed to finalize routes configuration',
      config.project_dir,
      err as Error
    )
  }
}

export const selectBoilerplate = (config: Readonly<CLIResults>): void => {
  const spinner = ora(
    `${chalk.blue(config.project_name)} ${chalk.green.bold(
      `Selecting Boilerplate`
    )} for ${chalk.bold.green(config.config_key)}...`
  ).start()

  handleRouter(config)
  handleStyles(config)
  handleViteConfig(config)
  handleMakefile(config)
  handleDatabase(config)

  finalizeResourceRoute(config)

  spinner.succeed(
    `${chalk.blue(config.project_name)} ${chalk.green.bold(
      'Boilerplate selected'
    )} for ${chalk.bold.green(config.config_key)}`
  )
}
