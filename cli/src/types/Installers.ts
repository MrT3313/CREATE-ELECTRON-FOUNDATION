import type { PkgInstallerMap } from './Packages.js'
import type { CLIResults } from './CLI.js'

export interface InstallerOptions extends Omit<CLIResults, 'packages'> {
  packages: PkgInstallerMap
}

export type Installer = (opts: InstallerOptions) => void
