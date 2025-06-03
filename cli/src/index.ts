#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";

// FUNCTIONS
import { renderTitle } from "./utils/renderTitle.js";
import { runUserPromptCli } from "./cli/index.js";
import { buildPkgInstallerMap } from "./installers/buildPkgInstallerMap.js";
import { scaffoldProject } from "./helpers/scaffoldProject.js";
import { installPackages } from "./helpers/installPackages.js";
import { selectBoilerplate } from "./helpers/selectBoilerplate.js";

// UTILS
import { logger } from "./utils/logger.js";

// TERMINAL
import { execaSync } from 'execa';
import ora from "ora";
import chalk from "chalk";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// TYPES
import type { CLIResults, CLIArgs } from "./types/CLI.js";

const main = async () => {
  const ide = process.env.IDE || "cursor";

  // Parse command line arguments
  const argv = await yargs(hideBin(process.argv))
    .option('projectName', {
      type: 'string',
      description: 'Name of the project'
    })
    .option('router', {
      type: 'string',
      choices: ['tanstack-router', 'react-router'],
      description: 'Router to use'
    })
    .option('database', {
      type: 'string',
      choices: ['sqlite'],
      description: 'Database to use'
    })
    .option('orm', {  
      type: 'string',
      choices: ['drizzle'],
      description: 'ORM to use'
    })
    .option('styles', {
      type: 'string',
      choices: ['tailwind', 'css'],
      description: 'Styles to use'
    })
    .option('git', {
      type: 'boolean',
      description: 'Initialize Git repository'
    })
    .option('install', {
      type: 'boolean',
      description: 'Install dependencies'
    })
    .help()
    .alias('help', 'h')
    .version(false)
    .parse();

  // Extract named options and positional arguments
  const cliArgs: CLIArgs = {
    projectName: argv.projectName as string || argv._[0] as string,
    router: argv.router as any,
    database: argv.database as any,
    orm: argv.orm as any,
    styles: argv.styles as any,
    git: argv.git,
    install: argv.install
  };

  // INJECT ENV VARIABLES ######################################################
  process.env.APP_NAME = cliArgs.projectName;

  // START ####################################################################
  renderTitle();
  
  // 1. run the user prompt cli ###############################################
  const config: CLIResults = await runUserPromptCli(cliArgs);

  // 2. configure packages ####################################################
  const inUsePackages = Object.values(config.packages).flat();
  const usePackages = buildPkgInstallerMap(config.projectName, inUsePackages);

  // 3. scaffold base project #################################################
  scaffoldProject(config);

  // 4. install packages ######################################################
  installPackages({ 
    ...config, 
    packages: usePackages 
  })

  // 5. select boilerplate ####################################################
  selectBoilerplate(config);

  // 6. update package.json ###################################################
  const pkgJson = fs.readJSONSync(
    path.join(config.projectDir, "package.json")
  );
  pkgJson.name = config.projectName;
  fs.writeJSONSync(
    path.join(config.projectDir, "package.json"),
    pkgJson,
    { spaces: 2 }
  );

  // 6. install dependencies ##################################################
  // if (config.installDependencies) {
  // await installDependencies({
  //     pkgManager: config.pkgManager,
  //     projectDir: config.projectDir,
  //   });
  // }
  
  // ##########################################################################
  // The following block attempts to execute `cd {config.projectName} && make kac`.
  // It assumes `config.projectName` holds the name of the directory to change into,
  // and that the current working directory of this script is the parent of `config.projectName`.
  // `execSync` from `child_process` is required for this to work.
  // Ensure `import { execSync } from 'child_process';` is present at the top of the file.

  if (config.projectName) {
    // Using quotes around config.projectName to handle potential spaces or special characters,
    // though typically project names avoid these.
    let command = `cd "${config.projectName}"`;
    if (config.initializeGit) command += ` && git init && git add . && git commit -m "Initial Scaffolding : create-electron-foundation"`;
    if (config.installDependencies) command += ` && npm i`;
    if (ide) command += ` && ${ide} .`;
    
    const spinner = ora(`Executing: ${command}`).start();
    
    try {
      // `stdio: 'inherit'` pipes the child process's stdio to the parent, making output visible.
      execaSync(command, { stdio: 'inherit', shell: true });
      spinner.succeed(chalk.green(`Successfully executed: ${command}`));
    } catch (error) {
      spinner.fail(chalk.red(`Failed to execute: ${command}`));
      logger.error(`Command execution failed for project ${config.projectName}.`);
      
      if (error instanceof Error) {
        logger.error(`Error: ${error.message}`);
      } else {
        logger.error(`An unknown error occurred during command execution: ${String(error)}`);
      }

      // The error object from execSync might have a 'status' property with the exit code.
      if (typeof error === 'object' && error !== null && 'status' in error) {
        logger.error(`Exit status: ${error.status}`);
      }
      // Consider if the main script should terminate on this failure.
      // For example: process.exit(1);
    }
  } else {
    logger.warn("Project name is not defined in the configuration. Skipping setup command.");
  }
}

main();