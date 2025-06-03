import { setTimeout } from "node:timers/promises";
import color from "picocolors";

// TERMINAL
import ora from "ora";
import chalk from "chalk";

// TERMINAL > user prompting
import * as p from "@clack/prompts";

// CONSTS
import { DEFAULT_APP_NAME } from "../consts.js";
// TYPES
import type { CLIDefaults, CLIResults, CLIArgs } from "../types/CLI.js";
import type { DatabasePackages, ORMPackages, RouterPackages } from "../types/Packages.js";

const defaultConfig: CLIDefaults = {
  initializeGit: false,
  pkgManager: "npm",
  installDependencies: true,
  packages: {
    router: ["tanstack-router"],
    styles: ["tailwind"],
    database: ["sqlite"],
    orm: ["drizzle"],
    // tables: ["tanstack-table"],
    // forms: ["tanstack-forms"],
  }
}

export const runUserPromptCli = async (cliArgs: CLIArgs = {}): Promise<CLIResults> => {
  /**
   * prompt the user for preferences on configurable options
   */
  p.intro(`${color.bgCyan(color.black("create-electron-foundation"))}`);  

  try {
    const prompts: any = {};

    if (!cliArgs.projectName) {
      prompts.projectName = () =>
        p.text({
          message: "What is the name of your project?",
          placeholder: DEFAULT_APP_NAME,
          validate(value) {
            if (value.length === 0) return `Project name is required!`;
            // Basic validation for directory/package name
            if (!/^[a-z0-9_.-]+$/.test(value))
              return "Project name can only contain lowercase letters, numbers, underscores, hyphens, and periods.";
          },
        });
    }

    if (!cliArgs.router) {
      prompts.router = () =>
        p.select({
          message: "Which router would you like to use?",
          options: [
            {
              value: "tanstack-router",
              label: "Tanstack Router",
            },
            {
              value: "react-router", 
              label: "React Router",
            }
          ],
          initialValue: "tanstack-router",
        });
    }

    // if (!cliArgs.database) {
    //   prompts.database = () =>
    //     p.select({
    //       message: "Which database would you like to use?",
    //       options: [
    //         {
    //           value: "sqlite",
    //           label: "SQLite",
    //         },
    //       ],
    //       initialValue: "sqlite",
    //     });
    // }

    // if (!cliArgs.orm) {
    //   prompts.orm = () =>
    //     p.select({
    //       message: "Which ORM would you like to use?",
    //       options: [
    //         {
    //           value: "drizzle", 
    //           label: "Drizzle",
    //         },
    //       ],
    //       initialValue: "drizzle",
    //     });
    // }

    if (!cliArgs.styles) {
      prompts.useTailwind = () =>
        p.confirm({
          message: "Will you be using Tailwind CSS for styling?",
          initialValue: true,
        });
    }

    if (cliArgs.git === undefined) {
      prompts.initializeGit = () =>
        p.confirm({
          message:
          "Should we initialize a Git repository and stage the changes?",
          initialValue: true,
        });
    }

    if (cliArgs.install === undefined) {
      prompts.installDependencies = () =>
        p.confirm({
          message:
            "Should we install dependencies after scaffolding?",
          initialValue: true,
        });
    }

    const group = await p.group(prompts, {
      onCancel: () => {
        p.cancel("Scaffolding cancelled.");
        process.exit(0);
      },
    });

    // Get values from CLI args or prompts with fallbacks
    const projectName = cliArgs.projectName || (group as any).projectName || DEFAULT_APP_NAME;
    const router = cliArgs.router || (group as any).router || "tanstack-router";
    const database = cliArgs.database || (group as any).database || "sqlite"
    const orm = cliArgs.orm || (group as any).database || "drizzle"
    const useTailwind = cliArgs.styles === "tailwind" || (cliArgs.styles === undefined && ((group as any).useTailwind ?? true));
    const initializeGit = cliArgs.git !== undefined ? cliArgs.git : ((group as any).initializeGit ?? false);
    const installDependencies = cliArgs.install !== undefined ? cliArgs.install : ((group as any).installDependencies ?? true);

    const config: CLIResults = {
      projectName,
      projectDir: `./${projectName}`,
      ...defaultConfig,
      initializeGit,
      installDependencies,
      packages: {
        router: [router as RouterPackages],
        styles: useTailwind ? ["tailwind"] : ["css"], 
        database: [database as DatabasePackages],
        orm: [orm as ORMPackages],
      }
    }

    const s = p.spinner();
    s.start("Processing your choices");
    await setTimeout(1000); // Simulate work
    s.stop("Choices processed");

    p.note(`
      Project Name: ${config.projectName}\n
      Router: ${config.packages.router}\n
      Styles: ${config.packages.styles}\n
      Database: ${config.packages.database}\n
      ORM: ${config.packages.orm}\n
      Install Dependencies: ${config.installDependencies}\n
      Initialize Git: ${config.initializeGit}`,
      "Summary of your choices:"
    );

    return config;
  } catch (e) {
    if (e === Symbol.for("clack:cancel")) {
      p.cancel("Scaffolding cancelled by user.");
    } else {
      p.cancel("An unexpected error occurred.");
      console.error(e);
    }
    process.exit(1);
  }  
}