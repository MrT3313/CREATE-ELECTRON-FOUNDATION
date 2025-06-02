import { Installer } from "./Installers.js";

export type PackageManager = "npm"

export type StylePackages = "tailwind";
export type RouterPackages = "tanstack-router" | "react-router";
export type AvailablePackages = StylePackages | RouterPackages;

export type PkgInstallerMap = Record<
  AvailablePackages,
  {
    inUse: boolean;
    installer: Installer;
  }
>;
