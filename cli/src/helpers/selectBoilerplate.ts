import path from "path";
import fs from "fs-extra"
import assert from "assert";
import sort from "sort-package-json";

// TERMINAL
import ora from "ora";
import chalk from "chalk";

// UTILS
import { logger } from "../utils/logger.js";

// CONSTS
import { PKG_ROOT } from "../consts.js";

// TYPES
import type { CLIResults } from "../types/CLI.js";

export const selectBoilerplate = (config: CLIResults) => {
  const spinner = ora(`${config.projectName} ${chalk.bold("Selecting Boilerplate")}...`).start();
  const srcDir = path.join(PKG_ROOT, "template/extras");

  try {
    if (config.packages.router.includes("tanstack-router")) {
      // TANSTACK ROUTER ######################################################
      for (let i = 0; i < config.packages.styles.length; i++) {
        const style = config.packages.styles[i];

        switch(style) {
          case "tailwind":
            // TANSTACK ROUTER > with tailwind ################################
            // copy tanstack router "routes" directory (with tailwind) into the scaffolded src/ directory
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "with-tailwind", "routes"),
              path.join(config.projectDir, "src", "routes")
            );
  
            // copy the vite.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "with-tailwind", "config", "vite.config.ts"),
              path.join(config.projectDir, "vite.config.ts")
            );
  
            // copy the tailwind.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "config", "tailwind.config.ts"),
              path.join(config.projectDir, "tailwind.config.ts")
            );
            fs.copySync(
              path.join(srcDir, "styles", "tailwind-index.css"),
              path.join(config.projectDir, "tailwind-index.css")
            );
            fs.renameSync(
              path.join(config.projectDir, "tailwind-index.css"),
              path.join(config.projectDir, "index.css")
            );
  
            // @ts-ignore
            if (config.packages.orm.includes("drizzle")) {
              fs.copySync(
                path.join(srcDir, "drizzle", "config", "vite.config.tsr-withtailwind.ts"),
                path.join(config.projectDir, "vite.config.ts")
              );
            }
  
            break;
          default:
            // TANSTACK ROUTER > base (no tailwind) ###########################
            // copy tanstack router "routes" directory (no tailwind) into the scaffolded src/ directory
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "base", "routes"),
              path.join(config.projectDir, "src", "routes")
            );
  
            // copy the vite.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "base", "config", "vite.config.ts"),
              path.join(config.projectDir, "vite.config.ts")
            );

            // copy the index.css file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "styles", "index.css"),
              path.join(config.projectDir, "index.css")
            );

            // @ts-ignore
            if (config.packages.orm.includes("drizzle")) {
              fs.copySync(
                path.join(srcDir, "drizzle", "config", "vite.config.tsr-base.ts"),
                path.join(config.projectDir, "vite.config.ts")
              );
            }
        }
      }
    } else if (config.packages.router.includes("react-router")) {
      for (let i = 0; i < config.packages.styles.length; i++) {
        // REACT ROUTER #######################################################
        const style = config.packages.styles[i];

        switch(style) {
          case "tailwind":
            // REACT ROUTER > with tailwind ###################################
            // copy react router "routes" directory (with tailwind) into the scaffolded src/ directory
            fs.copySync(
              path.join(srcDir, "reactRouter", "with-tailwind", "routes"),
              path.join(config.projectDir, "src", "routes")
            );

            fs.copySync(
              path.join(srcDir, "reactRouter", "with-tailwind", "App.tsx"),
              path.join(config.projectDir, "src", "App.tsx")
            );

            fs.copySync(
              path.join(srcDir, "reactRouter", "with-tailwind", "main.tsx"),
              path.join(config.projectDir, "src", "main.tsx")
            );

            // copy the vite.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "reactRouter", "with-tailwind", "config", "vite.config.ts"),
              path.join(config.projectDir, "vite.config.ts")
            );

            // copy the tailwind.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "config", "tailwind.config.ts"),
              path.join(config.projectDir, "tailwind.config.ts")
            );
            fs.copySync(
              path.join(srcDir, "styles", "tailwind-index.css"),
              path.join(config.projectDir, "tailwind-index.css")
            );
            fs.renameSync(
              path.join(config.projectDir, "tailwind-index.css"),
              path.join(config.projectDir, "index.css")
            );

            // @ts-ignore
            if (config.packages.orm.includes("drizzle")) {
              fs.copySync(
                path.join(srcDir, "drizzle", "config", "vite.config.rr-withtailwind.ts"),
                path.join(config.projectDir, "vite.config.ts")
              );
            }

            break;
          default:
            // REACT ROUTER > base (no tailwind) ##############################
            // copy react router "routes" directory (with tailwind) into the scaffolded src/ directory
            fs.copySync(
              path.join(srcDir, "reactRouter", "base", "routes"),
              path.join(config.projectDir, "src", "routes")
            );

            fs.copySync(
              path.join(srcDir, "reactRouter", "base", "App.tsx"),
              path.join(config.projectDir, "src", "App.tsx")
            );

            fs.copySync(
              path.join(srcDir, "reactRouter", "base", "main.tsx"),
              path.join(config.projectDir, "src", "main.tsx")
            );

            // copy the vite.config.ts file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "reactRouter", "base", "config", "vite.config.ts"),
              path.join(config.projectDir, "vite.config.ts")
            );

            // copy the index.css file into the scaffolded project
            fs.copySync(
              path.join(srcDir, "styles", "index.css"),
              path.join(config.projectDir, "index.css")
            );

            // @ts-ignore
            if (config.packages.orm.includes("drizzle")) {
              fs.copySync(
                path.join(srcDir, "drizzle", "config", "vite.config.rr-base.ts"),
                path.join(config.projectDir, "vite.config.ts")
              );
            }
        }
      }
    } else {
      logger.error("🚨🚨 Invalid Routing Selection");
      throw new Error("Invalid Routing Selection");
    }

    // @ts-ignore
    if (config.packages.orm.includes("drizzle")) {
      fs.copySync(
        path.join(srcDir, "drizzle", "config", "drizzle.config.ts"),
        path.join(config.projectDir, "drizzle.config.ts")
      );

      fs.copySync(
        path.join(srcDir, "drizzle", "api"),
        path.join(config.projectDir, "src", "api")
      );

      const drizzleScripts = {
        "drizzle:rebuild": "npm rebuild better-sqlite3",
        "drizzle:generate": "drizzle-kit generate",
        "drizzle:migrate": "drizzle-kit migrate",
        "drizzle:studio": "drizzle-kit studio"
      };
      
      const workflowScripts = {
        "db:setup": "npm run drizzle:rebuild && npm run drizzle:generate && npm run drizzle:migrate"
      };
      
      const pkgJson = fs.readJSONSync(path.join(config.projectDir, "package.json"));
      pkgJson.scripts = {
        ...pkgJson.scripts,
        // "postinstall": "electron-rebuild -f -w better-sqlite3",
        ...drizzleScripts,
        ...workflowScripts
      };
      
      const sortedPkgJson = sort(pkgJson);
      fs.writeFileSync(
        path.join(config.projectDir, "package.json"), 
        JSON.stringify(sortedPkgJson, null, 2) + '\n'
      );
    }
    spinner.succeed(`${config.projectName} ${chalk.bold.green("Boilerplate selected")} successfully`);
  } catch (e) {
    spinner.fail(`${config.projectName} ${chalk.red("Error selecting boilerplate")}`);
    logger.error("🚨🚨 Error selecting boilerplate", e);
    process.exit(1);
  }
}