import path from 'path'
import fs from 'fs-extra'
import sort from 'sort-package-json'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateDrizzle = (config: CLIResults) => {
  const srcDir = path.join(PKG_ROOT, 'template')

  fs.copySync(
    path.join(srcDir, 'configs', 'drizzle', 'drizzle.config.ts'),
    path.join(config.project_dir, 'drizzle.config.ts')
  )

  const drizzleScripts = {
    'drizzle:generate':
      'npm run drizzle:rebuild:sqlite && drizzle-kit generate',
    'drizzle:migrate': 'npm run drizzle:rebuild:sqlite && drizzle-kit migrate',
    'drizzle:studio': 'npm run drizzle:rebuild:sqlite && drizzle-kit studio',
  }

  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.scripts = {
    ...pkgJson.scripts,
    ...drizzleScripts,
  }

  const sortedPkgJson = sort(pkgJson)
  fs.writeFileSync(
    path.join(config.project_dir, 'package.json'),
    JSON.stringify(sortedPkgJson, null, 2) + '\n'
  )
}
