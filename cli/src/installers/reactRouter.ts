// FUNCTIONS
import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const reactRouterInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ['react-router'], // React Router V7
    devMode: false,
  })
}
