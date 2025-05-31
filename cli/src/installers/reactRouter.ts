import path from "path";
import fs from "fs-extra";
import { logger } from "../utils/logger.js";

import { PKG_ROOT } from "../consts.js";
import type { Installer } from "../types/Installers.js";
import { addPackageDependency } from "../utils/addPackageDependency.js";

export const reactRouterInstaller: Installer = ({ projectDir }) => {
  logger.info("🤑🤑🤑🤑 REACT ROUTER INSTALLER");
  addPackageDependency({
    projectDir,
    // dependencies: ["react-router", "react-router-dom"],
    dependencies: [],
    devMode: true,
  });
}