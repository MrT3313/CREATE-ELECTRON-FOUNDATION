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
      logger.debug(`Copying Tanstack Router template from: ${path.join(srcDir, "tanstackRouter")}`);
      logger.debug(`To: ${path.join(config.projectDir, "src")}`);

      for (let i = 0; i < config.packages.styles.length; i++) {
        const style = config.packages.styles[i];

        switch(style) {
          case "tailwind":
            // copy tanstack router "routes" directory (with tailwind) into the scaffolded src/ directory
            logger.debug(`Copying Tanstack Router template with Tailwind from: ${path.join(srcDir, "tanstackRouter", "with-tailwind")}`);
            logger.debug(`To: ${path.join(config.projectDir, "src")}`);
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "with-tailwind"),
              path.join(config.projectDir, "src")
            );
  
            // copy the vite.config.ts file into the scaffolded project
            logger.debug(`Copying Vite config with Tailwind from: ${path.join(srcDir, "config", "vite-config-tailwind.ts")}`);
            logger.debug(`To: ${path.join(config.projectDir, "vite.config.ts")}`);
            fs.copySync(
              path.join(srcDir, "config", "vite-config-tailwind.ts"),
              path.join(config.projectDir, "vite-config-tailwind.ts")
            );
  
            fs.renameSync(
              path.join(config.projectDir, "vite-config-tailwind.ts"),
              path.join(config.projectDir, "vite.config.ts")
            );
  
            // copy the tailwind.config.ts file into the scaffolded project
            logger.debug(`Copying Tailwind config from: ${path.join(srcDir, "config", "tailwind.config.ts")}`);
            logger.debug(`To: ${path.join(config.projectDir, "tailwind.config.ts")}`);
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
            fs.copySync(
              path.join(srcDir, "tanstackRouter", "base"),
              path.join(config.projectDir, "src")
            );
        }
      }
    } else {
      logger.error("🚨🚨 React Router is not supported yet");
      process.exit(1);
    }
  } catch (e) {
    logger.error("🚨🚨 Error selecting boilerplate", e);
    process.exit(1);
  }
}