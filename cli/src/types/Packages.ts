import { Installer } from './Installers.js'

// PACKAGE MANAGER
export type PackageManager = 'npm'

// STYLES
export type StylePackage = 'tailwind' | 'css'
export type StylePackages = StylePackage

export type RouterPackage = 'tanstack-router' | 'react-router'
export type RouterPackages = RouterPackage

export type DatabasePackage = 'sqlite'
export type DatabasePackages = DatabasePackage

export type ORMPackage = 'drizzle'
export type ORMPackages = ORMPackage

export type AvailablePackages =
  | StylePackages
  | RouterPackages
  | DatabasePackages
  | ORMPackages

// PACKAGE INSTALLER MAP
export type PkgInstallerMap = Record<
  AvailablePackages,
  {
    inUse: boolean
    installer: Installer
  }
>
