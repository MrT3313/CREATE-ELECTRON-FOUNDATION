// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const tanstackRouterInstaller: Installer = ({ project_dir }) => {
  /**
   * Updates the project package.json with relevant package(s) and script(s)
   * for Tanstack Router
   *
   * This does NOT 'npm i' any packages.
   * ####################################################################### */

  addPackageDependency({
    project_dir,
    dependencies: [
      '@tanstack/react-router',
      '@tanstack/react-router-devtools',
      '@tanstack/router-plugin',
    ],
    devMode: true,
  })
}
