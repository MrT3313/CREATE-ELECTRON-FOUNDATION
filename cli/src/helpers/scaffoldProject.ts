import path from 'path'
import fs from 'fs'

// TERMINAL
import ora from 'ora'
import chalk from 'chalk'

// UTILS
import { PKG_ROOT } from '../consts.js'

// TYPES
import type { CLIResults } from '../types/CLI.js'

// FUNCTIONS
import { validateElectronUserDataPath } from '../utils/validateElectronUserDataPath.js'
import { validateProjectDirectory } from '../utils/validateProjectDirectory.js'

export const scaffoldProject = async (config: CLIResults): Promise<void> => {
  /**
   * Copies configuration agnostic Electron base template files into the
   * users new project directory
   * ####################################################################### */
  const spinnerText = `${chalk.blue(config.project_name)} ${chalk.bold('Scaffolding')} in: ${config.project_dir}...`
  const spinner = ora(spinnerText).start()

  const srcDir = path.join(PKG_ROOT, 'template/base')
  const timestamp = new Date().getTime().toString()

  // CHECK: if the project directory already exists
  await validateProjectDirectory(config, timestamp, spinner)
  spinner.text = spinnerText

  // CHECK: Electron userData directory conflicts
  await validateElectronUserDataPath(config, timestamp, spinner)
  spinner.text = spinnerText

  // COPY: base template files into the users new project directory
  fs.cpSync(srcDir, config.project_dir, { recursive: true })

  // UPDATE: .env.production & .env.development
  const devEnvContent = `
    CUSTOM_ENV_VAR=my-custom-env-var\n
    NODE_ENV=development\n
    APP_NAME=${config.project_name}\n
    CEF_FRAMEWORK=Electron\n
    CEF_ROUTER=${config.packages.router}\n
    CEF_STYLES=${config.packages.styles || 'Vanilla CSS'}\n
    CEF_DATABASE=${config.packages.database || 'false'}\n
    CEF_ORM=${config.packages.orm || 'false'}
  `

  const devEnvFilePath = path.join(config.project_dir, '.env.development')
  fs.writeFileSync(devEnvFilePath, devEnvContent)

  const prodEnvContent = `
    CUSTOM_ENV_VAR=my-custom-env-var\n
    NODE_ENV=production\n
    APP_NAME=${config.project_name}\n
    CEF_FRAMEWORK=Electron\n
    CEF_ROUTER=${config.packages.router}\n
    CEF_STYLES=${config.packages.styles || 'Vanilla CSS'}\n
    CEF_DATABASE=${config.packages.database || 'false'}\n
    CEF_ORM=${config.packages.orm || 'false'}
  `
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

  const routerCopy = config.packages.router
    .split('-')
    .map((el: string) => el.toUpperCase())
    .join(' ')
  titleCopy += ` : ${routerCopy}`

  const stylesCopy =
    config.packages.styles === 'tailwind' ? 'TAILWIND CSS' : 'VANILLA CSS'
  titleCopy += ` : ${stylesCopy}`

  if (config.packages.database) {
    const databaseCopy =
      config.packages.database === 'sqlite' ? 'SQLITE' : 'NONE'
    titleCopy += ` : ${databaseCopy}`
  }

  if (config.packages.orm) {
    const ormCopy = config.packages.orm === 'drizzle' ? 'DRIZZLE' : 'NONE'
    titleCopy += ` : ${ormCopy}`
  }

  indexHtmlContent = indexHtmlContent.replace(
    /<title>.*<\/title>/,
    `<title>${titleCopy}</title>`
  )
  fs.writeFileSync(indexPath, indexHtmlContent)

  spinner.succeed(
    `${chalk.blue(config.project_name)} ${chalk.bold.green('scaffolded')} successfully!`
  )
}
