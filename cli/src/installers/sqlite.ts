import path from "path";
import fs from "fs-extra";

// UTILS
import { PKG_ROOT } from "../consts.js";

// FUNCTIONS 
import { addPackageDependency } from "../utils/addPackageDependency.js";

// TYPES
import type { Installer } from "../types/Installers.js";

export const sqliteInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["better-sqlite3"],
    devMode: false,
  });
  addPackageDependency({
    projectDir,
    dependencies: ["@types/better-sqlite3"],
    devMode: true,
  });
};