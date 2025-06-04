// TERMINAL
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";

// TYPES
import type { PackageManager } from "../types/Packages.js";

const runInstallCommand = async (
  pkgManager: PackageManager,
  projectDir: string
): Promise<void> => {
  switch (pkgManager) {
    case "npm":
      await execa(pkgManager, ["install"], {
        cwd: projectDir,
        stdout: "inherit",
        stderr: "inherit",
        timeout: 300000, // 5 minutes timeout
      });
      break;
    default:
      throw new Error(`Unsupported package manager: ${pkgManager}`);
  }
};

export const installDependencies = async ({
  projectDir,
  pkgManager = "npm"
}: {
  projectDir: string;
  pkgManager?: PackageManager;
}) => {
  const installSpinner = ora({
    text: "Installing dependencies...",
    spinner: "dots",
  });
  
  installSpinner.start();

  try {
    // Stop spinner to show npm output
    installSpinner.stop();
    console.log(chalk.blue("Installing dependencies..."));
    
    await runInstallCommand(pkgManager, projectDir);
    console.log(chalk.green("Installed dependencies!"));
  } catch (error) {
    console.log(chalk.red("Failed to install dependencies!"));
    if (error instanceof Error && error.message.includes('timed out')) {
      console.log(chalk.yellow("Installation timed out. Try running 'npm install' manually in the project directory."));
    }
    throw error;
  }
};