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
          useTanstackRouter: () =>
            p.confirm({
              message: "Will you be using Tanstack Router for navigation?",
              initialValue: true,
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
        router: group.useTanstackRouter ? ["tanstack-router"] : ["react-router"],
        // styles: group.useTailwind ? ["tailwind", "@tailwindcss/vite"] : ["css"], // keep all logic based off the single "tailwind" value
        // styles: group.useTailwind ? ["tailwind"] : ["css"], // css is the default we dont need a separate installer to keep the default the same
        styles: group.useTailwind ? ["tailwind"] : [], 
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

// import * as p from "@clack/prompts";
// import { setTimeout } from "node:timers/promises";
// import color from "picocolors";

// import type { RunCliResults } from "../types/cli";

// export const runCli = async (): Promise<RunCliResults> => {
//   console.clear();

//   p.intro(`${color.bgCyan(color.black(" create-electron-foundation "))}`);

//   const projectConfig: Partial<RunCliResults> = {};

//   try {
//     const group = await p.group(
//       {
//         projectName: () =>
//           p.text({
//             message: "What is the name of your project?",
//             placeholder: "my-electron-app",
//             validate(value) {
//               if (value.length === 0) return `Project name is required!`;
//               // Basic validation for directory/package name
//               if (!/^[a-z0-9_.-]+$/.test(value))
//                 return "Project name can only contain lowercase letters, numbers, underscores, hyphens, and periods.";
//             },
//           }),
//         useTailwind: () =>
//           p.confirm({
//             message: "Will you be using Tailwind CSS for styling?",
//             initialValue: true,
//           }),
//         initializeGit: () =>
//           p.confirm({
//             message:
//               "Should we initialize a Git repository and stage the changes?",
//             initialValue: true,
//           }),
//         installDependencies: () =>
//           p.confirm({
//             message:
//               "Should we run 'npm install' for you after scaffolding?",
//             initialValue: true,
//           }),
//       },
//       {
//         onCancel: () => {
//           p.cancel("Scaffolding cancelled.");
//           process.exit(0);
//         },
//       }
//     );

//     // Assign validated and confirmed values
//     projectConfig.projectName = group.projectName;
//     projectConfig.useTailwind = group.useTailwind;
//     projectConfig.initializeGit = group.initializeGit;
//     projectConfig.installDependencies = group.installDependencies;

//     const s = p.spinner();
//     s.start("Processing your choices");
//     await setTimeout(2000); // Simulate work
//     s.stop("Choices processed");

//     p.note(
//       `Project Name: ${projectConfig.projectName}\nTailwind CSS: ${
//         projectConfig.useTailwind ? "Yes" : "No"
//       }\nInitialize Git: ${
//         projectConfig.initializeGit ? "Yes" : "No"
//       }\nInstall Dependencies: ${
//         projectConfig.installDependencies ? "Yes" : "No"
//       }`,
//       "Summary of your choices:"
//     );
//   } catch (e) {
//     if (e === Symbol.for("clack:cancel")) {
//       p.cancel("Scaffolding cancelled by user.");
//     } else {
//       p.cancel("An unexpected error occurred.");
//       console.error(e);
//     }
//     process.exit(1);
//   }

//   // Next steps logic will go here based on projectConfig

//   console.log("<<<<< [cli/index.ts] BEFORE p.outro() >>>>>");
//   p.outro(
//     `You're all set! Next steps will be implemented based on your choices.`
//   );
//   console.log("<<<<< [cli/index.ts] AFTER p.outro(), BEFORE return >>>>>");

//   return projectConfig as RunCliResults;
// };
