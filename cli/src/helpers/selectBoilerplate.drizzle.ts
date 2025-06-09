import path from 'path'
import fs from 'fs-extra'
import sort from 'sort-package-json'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateDrizzle = (config: CLIResults) => {
  const srcDir = path.join(PKG_ROOT, 'template/extras')

  fs.copySync(
    path.join(srcDir, 'drizzle', 'config', 'vite.config.tsr-withtailwind.ts'),
    path.join(config.project_dir, 'vite.config.ts')
  )

  fs.copySync(
    path.join(srcDir, 'drizzle', 'config', 'drizzle.config.ts'),
    path.join(config.project_dir, 'drizzle.config.ts')
  )

  fs.copySync(
    path.join(srcDir, 'drizzle', 'api'),
    path.join(config.project_dir, 'src', 'api')
  )

  const drizzleScripts = {
    'drizzle:rebuild': 'npm rebuild better-sqlite3',
    'drizzle:generate': 'drizzle-kit generate',
    'drizzle:migrate': 'drizzle-kit migrate',
    'drizzle:studio': 'drizzle-kit studio',
  }

  const workflowScripts = {
    'db:setup':
      'npm run drizzle:rebuild && npm run drizzle:generate && npm run drizzle:migrate',
  }

  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.scripts = {
    ...pkgJson.scripts,
    // "postinstall": "electron-rebuild -f -w better-sqlite3",
    ...drizzleScripts,
    ...workflowScripts,
  }

  const sortedPkgJson = sort(pkgJson)
  fs.writeFileSync(
    path.join(config.project_dir, 'package.json'),
    JSON.stringify(sortedPkgJson, null, 2) + '\n'
  )
}