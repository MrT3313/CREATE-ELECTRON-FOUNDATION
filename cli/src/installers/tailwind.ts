import path from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger.js";

import { PKG_ROOT } from "../consts.js";
import type { Installer } from "../types/Installers.js";
import { addPackageDependency } from "../utils/addPackageDependency.js";

export const tailwindInstaller: Installer = ({ projectDir }) => {
  logger.info("🤑🤑🤑🤑 TAILWIND INSTALLER");
  addPackageDependency({
    projectDir,
    dependencies: ["tailwindcss", "@tailwindcss/vite"],
    devMode: true,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");
  logger.debug(`Copying Tailwind template from: ${extrasDir}`);

  const cssSrc = path.join(extrasDir, "styles/tailwind-index.css");
  const cssDest = path.join(projectDir, "src/styles/index.css");
  logger.debug(`Copying Tailwind index.css from: ${cssSrc}`);
  logger.debug(`Copying Tailwind index.css to: ${cssDest}`);
  fs.copySync(cssSrc, cssDest);

  const tailwindConfigSrc = path.join(extrasDir, "styles/tailwind.config.ts");
  const tailwindConfigDest = path.join(projectDir, "tailwind.config.ts");
  logger.debug(`Copying Tailwind config from: ${tailwindConfigSrc}`);
  logger.debug(`Copying Tailwind config to: ${tailwindConfigDest}`);
  fs.copySync(tailwindConfigSrc, tailwindConfigDest);
};