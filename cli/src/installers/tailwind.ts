import { addPackageDependency } from '../utils/addPackageDependency.js'

// TYPES
import type { Installer } from '../types/Installers.js'

export const tailwindInstaller: Installer = ({ project_dir }) => {
  addPackageDependency({
    project_dir,
    dependencies: ['tailwindcss', '@tailwindcss/vite'],
    devMode: true,
  })
}
