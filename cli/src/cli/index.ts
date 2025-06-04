import { setTimeout } from "node:timers/promises";
import color from "picocolors";

// TERMINAL > user prompting
import * as p from "@clack/prompts";

// CONSTS
import { DEFAULT_APP_NAME } from "../consts.js";
// TYPES
import type { CLIDefaults, CLIResults, CLIArgs } from "../types/CLI.js";
import type { DatabasePackages, ORMPackages, RouterPackages } from "../types/Packages.js";

// UTILS
import { logger } from "../utils/logger.js";

const defaultConfig: CLIDefaults = {
  pkgManager: "npm",
  initializeGit: false,
  installDependencies: true,
  runMigrations: true,
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

    prompts.initializeDatabase = () =>
      p.confirm({
        message: "Should we initialize a database?",
        initialValue: true,
      });

    if (!cliArgs.database) {
      prompts.database = ({ results }: { results: any }) => {
        if (results.initializeDatabase) {
          return p.select({
            message: "Which database would you like to use?",
            options: [
              {
                value: "sqlite",
                label: "SQLite",
              },
            ],
            initialValue: "sqlite",
          });
        }
        return Promise.resolve(null);
      };
    }

    prompts.initializeORM = ({ results }: { results: any }) => {
      if (results.initializeDatabase) {
        return p.confirm({
          message: "Should we initialize an ORM?",
          initialValue: true,
        });
      }
      return Promise.resolve(false);
    };

    if (!cliArgs.orm) {
      prompts.orm = ({ results }: { results: any }) => {
        if (results.initializeDatabase && results.initializeORM) {
          return p.select({
            message: "Which ORM would you like to use?",
            options: [
              {
                value: "drizzle", 
                label: "Drizzle",
              },
            ],
            initialValue: "drizzle",
          });
        }
        return Promise.resolve(null);
      };
    }

    if (!cliArgs.styles) {
      prompts.useTailwind = () =>
        p.confirm({
          message: "Will you be using Tailwind CSS for styling?",
          initialValue: true,
        });
    }

    if (cliArgs.initializeGit === undefined) {
      prompts.initializeGit = () =>
        p.confirm({
          message:
          "Should we initialize a Git repository and stage the changes?",
          initialValue: true,
        });
    }

    if (cliArgs.installDependencies === undefined) {
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
    const initializeDatabase = (group as any).initializeDatabase ?? false;
    const database = cliArgs.database || (initializeDatabase ? ((group as any).database || "sqlite") : null);
    const initializeORM = (group as any).initializeORM ?? false;
    const orm = cliArgs.orm || (initializeDatabase && initializeORM ? ((group as any).orm || "drizzle") : null);
    const useTailwind = cliArgs.styles === "tailwind" || (cliArgs.styles === undefined && ((group as any).useTailwind ?? true));
    const initializeGit = cliArgs.initializeGit !== undefined ? cliArgs.initializeGit : ((group as any).initializeGit ?? false);
    const installDependencies = cliArgs.installDependencies !== undefined ? cliArgs.installDependencies : ((group as any).installDependencies ?? true);
    const runMigrations = cliArgs.runMigrations !== undefined ? cliArgs.runMigrations : ((group as any).runMigrations ?? true);

    const config: CLIResults = {
      projectName,
      projectDir: `./${projectName}`,
      ...defaultConfig,
      initializeGit,
      installDependencies,
      runMigrations,
      packages: {
        router: [router as RouterPackages],
        styles: useTailwind ? ["tailwind"] : ["css"], 
        ...(database && { database: [database as DatabasePackages] }),
        ...(orm && { orm: [orm as ORMPackages] }),
      }
    }

    p.note(`
      Project Name: ${config.projectName}
      Router: ${config.packages.router}
      Styles: ${config.packages.styles}${database ? `
      Database: ${config.packages.database}` : ''}${orm ? `
      ORM: ${config.packages.orm}` : ''}
      Install Dependencies: ${config.installDependencies}
      Run Migrations: ${config.runMigrations}
      Initialize Git: ${config.initializeGit}`,
      "Summary of your choices:"
    );

    const s = p.spinner();
    s.start("Processing your choices");
    await setTimeout(1000); // Simulate work
    s.stop("Choices processed");

    return config;
  } catch (e) {
    if (e === Symbol.for("clack:cancel")) {
      p.cancel("Scaffolding cancelled by user.");
    } else {
      p.cancel("An unexpected error occurred.");
      console.error(e);
    }
    logger.error("🚨🚨 Error running prompt cli", e);
    process.exit(1);
  }  
}