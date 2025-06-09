// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const drizzleInstaller: Installer = ({ project_dir }) => {
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
