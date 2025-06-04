import type { 
  StylePackages, 
  RouterPackages, 
  PackageManager, 
  DatabasePackages,
  ORMPackages, AvailablePackages,
} from "./Packages.js";

export interface CLIArgs {
  projectName?: string;
  initializeGit?: boolean;
  installDependencies?: boolean;
  runMigrations?: boolean;
  router?: RouterPackages;
  styles?: StylePackages;
  database?: DatabasePackages;
  orm?: ORMPackages;
}

export interface CLIDefaults {
  pkgManager: PackageManager; // "npm"
  initializeGit: boolean;
  installDependencies: boolean;
  runMigrations: boolean;
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