import type { 
  StylePackages, 
  RouterPackages, 
  PackageManager, 
  DatabasePackages,
  ORMPackages, AvailablePackages,
} from "./Packages.js";

export interface CLIArgs {
  projectName?: string;
  router?: RouterPackages;
  styles?: StylePackages;
  database?: DatabasePackages;
  orm?: ORMPackages;
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
    database: [DatabasePackages] | [];
    orm: [ORMPackages] | [];
  }
}

export interface CLIResults extends CLIDefaults {
  projectName: string;
  projectDir: string;
}