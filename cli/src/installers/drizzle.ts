import path from "path";
import fs from "fs-extra";

// UTILS
import { PKG_ROOT } from "../consts.js";

// FUNCTIONS 
import { addPackageDependency } from "../utils/addPackageDependency.js";

// TYPES
import type { Installer } from "../types/Installers.js";

export const drizzleInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["drizzle-orm"],
    devMode: false,
  });
  addPackageDependency({
    projectDir,
    dependencies: ["drizzle-kit"],
    devMode: true,
  });
};