import path from 'path'
import fs from 'fs-extra'

// UTILS
import { PKG_ROOT } from '../consts.js'

// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const tailwindInstaller: Installer = ({ project_dir }) => {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for TailwindCSS
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  addPackageDependency({
    project_dir,
    dependencies: ['tailwindcss', '@tailwindcss/vite'],
    devMode: true,
  })

  const templateDir = path.join(PKG_ROOT, 'template')

  const cssSrc = path.join(
    templateDir,
    'configs',
    'tailwind',
    'tailwind-index.css'
  )
  const cssDest = path.join(project_dir, 'index.css')
  fs.copySync(cssSrc, cssDest)

  const tailwindConfigSrc = path.join(
    templateDir,
    'configs',
    'tailwind',
    'tailwind.config.ts'
  )
  const tailwindConfigDest = path.join(project_dir, 'tailwind.config.ts')
  fs.copySync(tailwindConfigSrc, tailwindConfigDest)
}
