import { Installer } from "./Installers.js";

export type PackageManager = "npm"

export type StylePackages = "tailwind" | "css";
export type RouterPackages = "tanstack-router" | "react-router";
export type DatabasePackages = "sqlite";
export type ORMPackages = "drizzle";
export type AvailablePackages = StylePackages | RouterPackages | DatabasePackages | ORMPackages;

export type PkgInstallerMap = Record<
  AvailablePackages,
  {
    inUse: boolean;
    installer: Installer;
  }
>;
