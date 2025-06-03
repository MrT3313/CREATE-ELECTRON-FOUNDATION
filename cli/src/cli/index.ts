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
import type { CLIDefaults, CLIResults } from "../types/CLI.js";
import type { RouterPackages } from "../types/Packages.js";

const defaultConfig: CLIDefaults = {
  initializeGit: false,
  pkgManager: "npm",
  installDependencies: true,
  packages: {
    router: ["tanstack-router"],
    styles: ["tailwind"],
    // database: ["sqlite", "electric-sql"],
    // tables: ["tanstack-table"],
    // forms: ["tanstack-forms"],
  }
}

export const runUserPromptCli = async (): Promise<CLIResults> => {
  /**
   * prompt the user for preferences on configurable options
   */
  p.intro(`${color.bgCyan(color.black("create-electron-foundation"))}`);  

  try {
    const group = await p.group(
      {
        projectName: () =>
          p.text({
            message: "What is the name of your project?",
            placeholder: DEFAULT_APP_NAME,
            validate(value) {
              if (value.length === 0) return `Project name is required!`;
              // Basic validation for directory/package name
              if (!/^[a-z0-9_.-]+$/.test(value))
                return "Project name can only contain lowercase letters, numbers, underscores, hyphens, and periods.";
            },
          }),
        router: () =>
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
          }),
        useTailwind: () =>
          p.confirm({
            message: "Will you be using Tailwind CSS for styling?",
            initialValue: true,
          }),
        initializeGit: () =>
          p.confirm({
            message:
            "Should we initialize a Git repository and stage the changes?",
            initialValue: true,
          }),
        installDependencies: () =>
          p.confirm({
            message:
              "Should we install dependencies after scaffolding?",
            initialValue: true,
          }),
      },
      {
        onCancel: () => {
          p.cancel("Scaffolding cancelled.");
          process.exit(0);
        },
      }
    );

    const config: CLIResults = {
      projectName: group.projectName,
      projectDir: `./${group.projectName}`,
      ...defaultConfig,
      installDependencies: group.installDependencies,
      packages: {
        router: [group.router as RouterPackages],
        styles: group.useTailwind ? ["tailwind"] : ["css"], 
      }
    }

    const s = p.spinner();
    s.start("Processing your choices");
    await setTimeout(1000); // Simulate work
    s.stop("Choices processed");

    p.note(
      `Project Name: ${config.projectName}`,
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