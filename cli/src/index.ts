#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";
import assert from "assert";

// FUNCTIONS
import { renderTitle } from "./utils/renderTitle.js";
import { runUserPromptCli } from "./cli/index.js";
import { buildPkgInstallerMap } from "./installers/buildPkgInstallerMap.js";
import { scaffoldProject } from "./helpers/scaffoldProject.js";
import { installPackages } from "./helpers/installPackages.js";
import { selectBoilerplate } from "./helpers/selectBoilerplate.js";
import { installDependencies } from "./helpers/installDependencies.js";

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
    .option('runMigrations', {
      type: 'boolean',
      description: 'Run migrations'
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
    .option('initializeGit', {
      type: 'boolean',
      description: 'Initialize Git repository'
    })
    .option('installDependencies', {
      type: 'boolean',
      description: 'Install dependencies'
    })
    .option('y', {
      type: 'boolean',
      alias: 'yes',
      description: 'Skip prompts and use defaults'
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
    initializeGit: argv.initializeGit as boolean,
    installDependencies: argv.installDependencies as boolean,
    runMigrations: argv.runMigrations as boolean,
    skipPrompts: argv.y as boolean,
  };

  // INJECT ENV VARIABLES ######################################################
  process.env.APP_NAME = cliArgs.projectName;

  // START ####################################################################
  renderTitle();
  
  // Log current Node.js version
  logger.info(`Node.js version: ${process.version}`);
  assert(process.version === "v22.15.1", "Node.js version must be 22.15.1");

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

  // const NewPkgJson = fs.readJSONSync(
  //   path.join(config.projectDir, "package.json")
  // );
  // logger.info(JSON.stringify(NewPkgJson, null, 2));

  // 7. install dependencies ##################################################
  if (config.installDependencies) {
  await installDependencies({
      pkgManager: config.pkgManager,
      projectDir: config.projectDir,
    });
  }

  // 8. migrations #########################################################
  // TODO: move to its own helper function
  // @ts-ignore
  if (config.installDependencies && config.packages.database.includes("sqlite") && config.packages.orm.includes("drizzle")) {
    const migrationsSpinner = ora({
      text: "Setting up database...",
      spinner: "dots",
    });
    migrationsSpinner.start();

    let command = `cd "${config.projectName}"`;
    if (config.runMigrations) {
      command += ` && npm run db:setup`;
    } else {
      command += ` && npm run db:generate && npm run rebuild`
    }

    try {
      execaSync(command, { 
        // stdio: 'inherit', 
        shell: true 
      });
      migrationsSpinner.succeed(
        chalk.green("Database setup completed successfully!")
      );
    } catch (err) {
      logger.error(`Failed to execute: ${command}`);
      logger.error(err);
      migrationsSpinner.fail(
        chalk.red("Database setup failed!")
      );
    }
  }

  // 9. initialize git ########################################################
  if (config.initializeGit) {
    const initializeGitSpinner = ora({
      text: "Initializing Git...",
      spinner: "dots",
    });
    initializeGitSpinner.start();

    let command = `cd "${config.projectName}"`;
    command += ` && git init && git add . && git commit -m "Initial Scaffolding : create-electron-foundation"`;

    try {
      execaSync(command, { 
        // stdio: 'inherit', 
        shell: true 
      });
      initializeGitSpinner.succeed(
        chalk.green("Git initialized successfully!")
      );
    } catch (err) {
      logger.error(`Failed to execute: ${command}`);
      logger.error(err);
      initializeGitSpinner.fail(
        chalk.red("Git initialization failed!")
      );
    }
  }

  // 10. open in ide ##########################################################
  if (ide) {
    let command = `cd "${config.projectName}"`;
    command += ` && ${ide} .`;

    try {
      execaSync(command, { 
        // stdio: 'inherit', 
        shell: true 
      });
    } catch (err) {
      logger.error(`Failed to execute: ${command}`);
      logger.error(err);
    }
  }


  logger.success(`${config.projectName} ${chalk.bold.green("Project Initialized Successfully with create-electron-foundation!")}`);
}

main();