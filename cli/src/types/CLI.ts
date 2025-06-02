import type { StylePackages, RouterPackages, PackageManager } from "./Packages.js";

export interface CLIDefaults {
  pkgManager: PackageManager;
  initializeGit: boolean;
  installDependencies: boolean;
  packages: {
    router: [RouterPackages];
    styles: [StylePackages] | []; 
  }
}

export interface CLIResults extends CLIDefaults {
  projectName: string;
  projectDir: string;
}