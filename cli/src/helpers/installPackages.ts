// TERMINAL
import chalk from "chalk";
import ora from "ora";

// UTILS
import { logger } from "../utils/logger.js";

// TYPES
import type { PkgInstallerMap } from "../types/Packages.js";
import type { InstallerOptions } from "../types/Installers.js";
  
export const installPackages = (options: InstallerOptions) => {
  /**
   * This runs the installer for all the packages that the user has selected
   */
  const { packages } = options;

  for (const [name, pkgOpts] of Object.entries(packages) as [string, PkgInstallerMap[keyof PkgInstallerMap]][]) {
    if (pkgOpts.inUse) {
      const spinner = ora(`Installing ${chalk.bold(name)}...`).start();
      pkgOpts.installer(options);
      spinner.succeed(
        chalk.green(
          `Successfully setup boilerplate for ${chalk.green.bold(name)}`
        )
      );
    }
  }
};
