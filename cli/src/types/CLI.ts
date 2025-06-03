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
  pkgManager: PackageManager; // "npm"
  initializeGit: boolean;
  installDependencies: boolean;
  packages: {
    router: [RouterPackages]; // ["tanstack-router"] | ["react-router"]
    styles: [StylePackages] | []; // ["tailwind"] | ["css"] | []
    database: [DatabasePackages] | []; // ["sqlite"] | []
    orm: [ORMPackages] | []; // ["drizzle"] | []
  }
}

export interface CLIResults extends CLIDefaults {
  projectName: string;
  projectDir: string;
}