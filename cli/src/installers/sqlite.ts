// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const sqliteInstaller: Installer = ({ project_dir }) => {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for SQLite
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  addPackageDependency({
    project_dir,
    dependencies: ['better-sqlite3'],
    devMode: false,
  })
  addPackageDependency({
    project_dir,
    dependencies: ['@types/better-sqlite3'],
    devMode: true,
  })
}
