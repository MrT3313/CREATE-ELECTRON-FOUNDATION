import path from "path";
import fs from "fs-extra";

// UTILS
import { PKG_ROOT } from "../consts.js";

// FUNCTIONS 
import { addPackageDependency } from "../utils/addPackageDependency.js";

// TYPES
import type { Installer } from "../types/Installers.js";

export const tailwindInstaller: Installer = ({ projectDir }) => {
  addPackageDependency({
    projectDir,
    dependencies: ["tailwindcss", "@tailwindcss/vite"],
    devMode: true,
  });

  const extrasDir = path.join(PKG_ROOT, "template/extras");

  const cssSrc = path.join(extrasDir, "styles/tailwind-index.css");
  const cssDest = path.join(projectDir, "src/styles/index.css");
  fs.copySync(cssSrc, cssDest);

  const tailwindConfigSrc = path.join(extrasDir, "styles/tailwind.config.ts");
  const tailwindConfigDest = path.join(projectDir, "tailwind.config.ts");
  fs.copySync(tailwindConfigSrc, tailwindConfigDest);
};