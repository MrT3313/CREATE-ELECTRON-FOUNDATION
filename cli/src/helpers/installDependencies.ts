// TERMINAL
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";

// TYPES
import type { PackageManager } from "../types/Packages.js";

const runInstallCommand = async (
  pkgManager: PackageManager,
  projectDir: string
): Promise<null> => {
  switch (pkgManager) {
    // When using npm, inherit the stderr stream so that the progress bar is shown
    case "npm":
      await execa(pkgManager, ["install"], {
        cwd: projectDir,
        stderr: "inherit",
      });

      return null;
    default:
      // Or throw an error for unsupported package managers
      // throw new Error(`Unsupported package manager: ${pkgManager}`);
      return null; // Ensure all paths return null
  }
};

export const installDependencies = async ({
  projectDir,
  pkgManager = "npm"
}: {
  projectDir: string;
  pkgManager?: PackageManager;
}) => {
  const installSpinner = await runInstallCommand(pkgManager, projectDir);

  // If the spinner was used to show the progress, use succeed method on it
  // If not, use the succeed on a new spinner
  (installSpinner ?? ora()).succeed(
    chalk.green("Successfully installed dependencies!\n")
  );
};