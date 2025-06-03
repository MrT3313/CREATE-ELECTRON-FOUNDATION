import type { StylePackages, RouterPackages, PackageManager } from "./Packages.js";

export interface CLIArgs {
  projectName?: string;
  router?: RouterPackages;
  styles?: StylePackages;
  git?: boolean;
  install?: boolean;
}

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