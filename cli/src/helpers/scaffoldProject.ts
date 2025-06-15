import path from 'path'
import fs from 'fs'

// TERMINAL
import ora from 'ora'
import chalk from 'chalk'

// UTILS
import { logger } from '../utils/logger.js'
import { PKG_ROOT } from '../consts.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'

export const scaffoldProject = (config: CLIResults): void => {
  /**
   * Copies configuration agnostic Electron base template files into the
   * users new project directory
   * ####################################################################### */
  const spinner = ora(
    `${chalk.blue(config.project_name)} ${chalk.bold('Scaffolding')} in: ${config.project_dir}...`
  ).start()

  const srcDir = path.join(PKG_ROOT, 'template/base')

  // CHECK: if the project directory already exists
  if (fs.existsSync(config.project_dir)) {
    logger.error(`Directory ${config.project_dir} already exists`)
    // TODO: improve options
    //       - query user to delete/wipe & continue or exit
    process.exit(1)
  }

  // COPY: base template files into the users new project directory
  fs.cpSync(srcDir, config.project_dir, { recursive: true })

  // UPDATE: .env.production & .env.development
  const devEnvContent = `CUSTOM_ENV_VAR=my-custom-env-var\nAPP_NAME=${config.project_name}\nCEF_FRAMEWORK=Electron\nCEF_ROUTER=${config.packages.router}\nCEF_STYLES=${config.packages.styles || 'Vanilla CSS'}\nCEF_DATABASE=${config.packages.database || 'false'}\nCEF_ORM=${config.packages.orm || 'false'}`
  const devEnvFilePath = path.join(config.project_dir, '.env.development')
  fs.writeFileSync(devEnvFilePath, devEnvContent)

  const prodEnvContent = `CUSTOM_ENV_VAR=my-custom-env-var\nAPP_NAME=${config.project_name}\nCEF_FRAMEWORK=Electron\nCEF_ROUTER=${config.packages.router}\nCEF_STYLES=${config.packages.styles || 'Vanilla CSS'}\nCEF_DATABASE=${config.packages.database || 'false'}\nCEF_ORM=${config.packages.orm || 'false'}`
  const prodEnvFilePath = path.join(config.project_dir, '.env.production')
  fs.writeFileSync(prodEnvFilePath, prodEnvContent)

  // RENAME: copied _gitignore to .gitignore
  fs.renameSync(
    path.join(config.project_dir, '_gitignore'),
    path.join(config.project_dir, '.gitignore')
  )

  // UPDATE: index.html title
  const indexPath = path.join(config.project_dir, 'index.html')
  let indexHtmlContent = fs.readFileSync(indexPath, 'utf-8')

  let titleCopy = `ELECTRON`

  logger.info(chalk.red.bold(`--0-- ${JSON.stringify(config, null, 2)}`))

  // logger.info(`--1-- ${config.packages.router}`)
  const routerCopy = config.packages.router
    .split('-')
    .map((el: string) => el.toUpperCase())
    .join(' ')
  titleCopy += ` : ${routerCopy}`
  // logger.info(`--1.1-- ${titleCopy}`)

  // logger.info(`--2-- ${config.packages.styles}`)
  const stylesCopy =
    config.packages.styles === 'tailwind' ? 'TAILWIND CSS' : 'VANILLA CSS'
  titleCopy += ` : ${stylesCopy}`
  // logger.info(`--2.1-- ${titleCopy}`)

  // logger.info(`--3-- ${config.packages.database}`)
  if (config.packages.database) {
    const databaseCopy =
      config.packages.database === 'sqlite' ? 'SQLITE' : 'NONE'
    titleCopy += ` : ${databaseCopy}`
  }
  // logger.info(`--3.1-- ${titleCopy}`)

  // logger.info(`--4-- ${config.packages.orm}`)
  if (config.packages.orm) {
    const ormCopy = config.packages.orm === 'drizzle' ? 'DRIZZLE' : 'NONE'
    titleCopy += ` : ${ormCopy}`
  }
  // logger.info(`--4.1-- ${titleCopy}`)

  // logger.info(`--5-- ${titleCopy}`)
  indexHtmlContent = indexHtmlContent.replace(
    /<title>.*<\/title>/,
    `<title>${titleCopy}</title>`
  )
  fs.writeFileSync(indexPath, indexHtmlContent)

  spinner.succeed(
    `${chalk.blue(config.project_name)} ${chalk.bold.green('scaffolded')} successfully!`
  )
}
