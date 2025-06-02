import path from "path";
import fs from "fs-extra";

// FUNCTIONS
import { addPackageDependency } from "../utils/addPackageDependency.js";

// TYPES
import type { Installer } from "../types/Installers.js";

export const tanstackRouterInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: [
      "@tanstack/react-router", 
      "@tanstack/react-router-devtools", 
      "@tanstack/router-plugin",
    ],
    devMode: true,
  });
}