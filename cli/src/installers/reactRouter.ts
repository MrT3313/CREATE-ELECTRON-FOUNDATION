// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const reactRouterInstaller: Installer = ({ project_dir }) => {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for React Router V7
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  addPackageDependency({
    project_dir,
    dependencies: ['react-router'], // React Router V7
    devMode: false,
  })
}
