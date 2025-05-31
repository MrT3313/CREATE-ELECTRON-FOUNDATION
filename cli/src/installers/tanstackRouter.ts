import path from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger.js";

import { PKG_ROOT } from "../consts.js";
import type { Installer } from "../types/Installers.js";
import { addPackageDependency } from "../utils/addPackageDependency.js";

export const tanstackRouterInstaller: Installer = ({ projectDir }) => {
  logger.info("🤑🤑🤑🤑 TANSTACK ROUTER INSTALLER");
  addPackageDependency({
    projectDir,
    dependencies: ["@tanstack/react-router", "@tanstack/react-router-devtools"],
    devMode: true,
  });
}