import path from 'path'
import fs from 'fs-extra'
import sort from 'sort-package-json'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateElectronDatabase = (config: CLIResults) => {
  const srcDir = path.join(PKG_ROOT, 'template')

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

  fs.copySync(
    path.join(srcDir, 'extras', 'src', 'api'),
    path.join(config.project_dir, 'src', 'api')
  )

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

  const sortedPkgJson = sort(pkgJson)
  fs.writeFileSync(
    path.join(config.project_dir, 'package.json'),
    JSON.stringify(sortedPkgJson, null, 2) + '\n'
  )
}
