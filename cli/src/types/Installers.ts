import type { PkgInstallerMap } from './Packages.js'
import type { CLIResults } from './CLI.js'

export interface InstallerOptions {
  project_name: CLIResults['project_name']
  project_dir: CLIResults['project_dir']
  pkg_manager: CLIResults['pkg_manager']
  packages: PkgInstallerMap
}

export type Installer = (opts: InstallerOptions) => void
