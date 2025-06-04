import path from "path";
import fs from 'fs'

// TERMINAL
import ora from 'ora'
import chalk from 'chalk'

// UTILS
import { logger } from "../utils/logger.js";
import { PKG_ROOT } from "../consts.js";

// TYPES
import type { CLIResults } from "../types/CLI.js";

export const scaffoldProject = (config: CLIResults, debug=false): void => {
  /**
   * copy as much of the base boilerplate for electron
   * that is unaffected by the user's choices
   */  
  const spinner = ora(`${config.projectName} ${chalk.bold("Scaffolding")} in: ${config.projectDir}...`).start();

  const srcDir = path.join(PKG_ROOT, "template/base");

  if (fs.existsSync(config.projectDir)) {
    logger.error(`Directory ${config.projectDir} already exists`);
    process.exit(1);
  }
  
  fs.cpSync(srcDir, config.projectDir, { recursive: true });
  
  const envContent = `APP_NAME=${config.projectName}\n`;
  const envFilePath = path.join(config.projectDir, '.env');
  fs.writeFileSync(envFilePath, envContent);
  
  fs.renameSync(
    path.join(config.projectDir, "_gitignore"),
    path.join(config.projectDir, ".gitignore")
  );

  spinner.succeed(
    `${config.projectName} ${chalk.bold.green("scaffolded")} successfully!`
  );
}