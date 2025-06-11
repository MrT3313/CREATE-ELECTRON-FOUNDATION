// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const tanstackRouterInstaller: Installer = ({ project_dir }) => {
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
