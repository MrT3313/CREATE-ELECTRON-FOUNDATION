import path from "path";
import fs from "fs-extra"
import assert from "assert";

// UTILS
import { logger } from "../utils/logger.js";

// CONSTS
import { PKG_ROOT } from "../consts.js";

// TYPES
import type { CLIResults } from "../types/CLI.js";

export const selectBoilerplate = (config: CLIResults) => {
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
  
  
            break;
          default:
            // TANSTACK ROUTER > base (no tailwind) ###########################
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "base"),
              path.join(config.projectDir, "src")
            );
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
        }
      }
    } else {
      logger.error("🚨🚨 Invalid Routing Selection");
      throw new Error("Invalid Routing Selection");
    }
  } catch (e) {
    logger.error("🚨🚨 Error selecting boilerplate", e);
    process.exit(1);
  }
}