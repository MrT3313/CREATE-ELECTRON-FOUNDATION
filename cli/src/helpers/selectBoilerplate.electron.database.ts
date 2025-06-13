import path from 'path'
import fs from 'fs-extra'
import sort from 'sort-package-json'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateElectronDatabase = (config: CLIResults) => {
  /**
   * Copies the Electron database boilerplate into the users new project directory
   * Updates the package.json with the scripts - these is heavily connected to
   *    and interact with the scripts added in the selectBoilerplate.drizzle.ts
   * ####################################################################### */
  const srcDir = path.join(PKG_ROOT, 'template')

  // COPY: electron/main/db
  fs.copySync(
    path.join(srcDir, 'extras', 'electron', 'main', 'db'),
    path.join(config.project_dir, 'electron', 'main', 'db')
  )

  fs.copySync(
    path.join(srcDir, 'extras', 'electron', 'main', 'index-db.ts'),
    path.join(config.project_dir, 'electron', 'main', 'index.ts')
  )

  fs.copySync(
    path.join(srcDir, 'extras', 'electron', 'preload', 'index-with-db.ts'),
    path.join(config.project_dir, 'electron', 'preload', 'index.ts')
  )

  // COPY: src/api
  // this keeps the 'non DB' functionality to query "outside" of Electron configuration
  // in this case we are using the jsonplaceholder api: https://jsonplaceholder.typicode.com/
  fs.copySync(
    path.join(srcDir, 'extras', 'src', 'api'),
    path.join(config.project_dir, 'src', 'api')
  )

  // UPDATE: package.json with better-sqlite3 scripts
  const betterSqliteScripts = {
    'electron:rebuild': 'electron-rebuild -f -w better-sqlite3',
    'electron:check':
      "node -e \"try { require('better-sqlite3'); console.log('✓ better-sqlite3 loaded successfully'); } catch(e) { console.log('✗ better-sqlite3 failed:', e.message); console.log('Run: npm run rebuild:electron'); process.exit(1); }\"",
  }

  const drizzleScripts = {
    'drizzle:rebuild:sqlite': 'npm rebuild better-sqlite3',
  }

  const workflowScripts = {
    dev: 'npm run electron:rebuild && vite',
    'db:setup': 'npm run drizzle:generate && npm run drizzle:migrate',
  }

  const pkgJson = fs.readJSONSync(path.join(config.project_dir, 'package.json'))
  pkgJson.scripts = {
    ...pkgJson.scripts,
    ...drizzleScripts,
    ...betterSqliteScripts,
    ...workflowScripts,
  }

  // SORT: package.json
  const sortedPkgJson = sort(pkgJson)
  fs.writeFileSync(
    path.join(config.project_dir, 'package.json'),
    JSON.stringify(sortedPkgJson, null, 2) + '\n'
  )
}
