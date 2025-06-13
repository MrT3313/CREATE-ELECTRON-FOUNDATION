// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const drizzleInstaller: Installer = ({ project_dir }) => {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for Drizzle ORM
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  addPackageDependency({
    project_dir,
    dependencies: ['drizzle-orm'],
    devMode: false,
  })
  addPackageDependency({
    project_dir,
    dependencies: ['drizzle-kit'],
    devMode: true,
  })
}
