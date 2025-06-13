import path from 'path'
import fs from 'fs-extra'
import sort from 'sort-package-json'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateDrizzle = (config: CLIResults) => {
  /**
   * Copies the Drizzle ORM boilerplate into the users new project directory
   * Updates the package.json with the scripts - these is heavily connected to
   *    and interact with the scripts added in the selectBoilerplate.electron.database.ts
   * ####################################################################### */
  const srcDir = path.join(PKG_ROOT, 'template')

  // COPY: drizzle.config.ts
  fs.copySync(
    path.join(srcDir, 'configs', 'drizzle', 'drizzle.config.ts'),
    path.join(config.project_dir, 'drizzle.config.ts')
  )

  // UPDATE: package.json with drizzle scripts
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

  // SORT: package.json
  const sortedPkgJson = sort(pkgJson)
  fs.writeFileSync(
    path.join(config.project_dir, 'package.json'),
    JSON.stringify(sortedPkgJson, null, 2) + '\n'
  )
}
