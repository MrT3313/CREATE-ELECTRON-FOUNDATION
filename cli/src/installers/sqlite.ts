// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const sqliteInstaller: Installer = ({ project_dir }) => {
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
