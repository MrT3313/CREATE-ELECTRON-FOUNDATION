import path from 'path'
import fs from 'fs-extra'

// TYPES
import { CLIResults } from '../types/CLI.js'

// CONSTS
import { PKG_ROOT } from '../consts.js'

export const selectBoilerplateElectronDatabase = (config: CLIResults) => {
  const srcDir = path.join(PKG_ROOT, 'template/extras')

  fs.copySync(
    path.join(srcDir, 'electron', 'db'),
    path.join(config.project_dir, 'electron', 'main', 'db')
  )

  fs.copySync(
    path.join(srcDir, 'electron', 'index-db.ts'),
    path.join(config.project_dir, 'electron', 'main', 'index.ts')
  )

  fs.copySync(
    path.join(srcDir, 'config', 'makefile-db.sh'),
    path.join(config.project_dir, 'makefile')
  )
}