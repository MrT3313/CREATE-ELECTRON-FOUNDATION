#!/usr/bin/env node
// FUNCTIONS
import { runUserPromptCli } from "./cli/index.js";
import { renderTitle } from "./utils/renderTitle.js";
import { buildPkgInstallerMap } from "./installers/buildPkgInstallerMap.js";
import { scaffoldProject } from "./helpers/scaffoldProject.js";
import { installPackages } from "./helpers/installPackages.js";
import { selectBoilerplate } from "./helpers/selectBoilerplate.js";

// UTILS
import { logger } from "./utils/logger.js";

// TYPES
import type { CLIResults } from "./types/CLI.js";

const main = async () => {
  const ide = process.env.IDE || "cursor";

  // START ####################################################################
  renderTitle();
  
  // 1. run the user prompt cli ###############################################
  const config: CLIResults = await runUserPromptCli();

  // 2. configure packages ####################################################
  const inUsePackages = Object.values(config.packages).flat();
  const usePackages = buildPkgInstallerMap(config.projectName, inUsePackages);

  // 3. scaffold base project #################################################
  scaffoldProject(config);

  // 4. install packages ######################################################
  // THIS IS CAUSING ISSUES!
  installPackages({ 
    ...config, 
    packages: usePackages 
  })

  // 5. select boilerplate ####################################################
  selectBoilerplate(config);
  
  // // 3. create the project ####################################################
  // const projectConfig = await createProject({
  //   ...config,
  //   packages: usePackages,
  // });
  // logger.info("✅✅ Project created successfully");

  // // 4. install dependencies ##################################################
  // if (config.installDependencies) {
  // await installDependencies({
  //     pkgManager: config.pkgManager,
  //     projectDir: config.projectDir,
  //   });
  // }

  // // The following block attempts to execute `cd {config.projectName} && make kac`.
  // // It assumes `config.projectName` holds the name of the directory to change into,
  // // and that the current working directory of this script is the parent of `config.projectName`.
  // // `execSync` from `child_process` is required for this to work.
  // // Ensure `import { execSync } from 'child_process';` is present at the top of the file.

  // if (config.projectName) {
  //   logger.info(`Attempting to run setup command in project: ${config.projectName}`);
    
  //   // Using quotes around config.projectName to handle potential spaces or special characters,
  //   // though typically project names avoid these.
  //   const command = `cd "${config.projectName}" && ${ide} . && make kac`;
  //   const spinner = ora(`Executing: ${command}`).start();
    
  //   try {
  //     // `stdio: 'inherit'` pipes the child process's stdio to the parent, making output visible.
  //     execaSync(command, { stdio: 'inherit', shell: true });
  //     spinner.succeed(chalk.green(`Successfully executed: ${command}`));
  //     logger.info(`Setup command completed successfully for project ${config.projectName}.`);
  //   } catch (error) {
  //     spinner.fail(chalk.red(`Failed to execute: ${command}`));
  //     logger.error(`Command execution failed for project ${config.projectName}.`);
      
  //     if (error instanceof Error) {
  //       logger.error(`Error: ${error.message}`);
  //     } else {
  //       logger.error(`An unknown error occurred during command execution: ${String(error)}`);
  //     }

  //     // The error object from execSync might have a 'status' property with the exit code.
  //     if (typeof error === 'object' && error !== null && 'status' in error) {
  //       logger.error(`Exit status: ${error.status}`);
  //     }
  //     // Consider if the main script should terminate on this failure.
  //     // For example: process.exit(1);
  //   }
  // } else {
  //   logger.warn("Project name is not defined in the configuration. Skipping setup command.");
  // }
  
}

main();