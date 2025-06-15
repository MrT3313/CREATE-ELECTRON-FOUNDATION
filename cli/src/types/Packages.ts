import { Installer } from './Installers.js'

// PACKAGE MANAGER
export const validPackageManagers = ['npm']
export type PackageManager = 'npm'

// STYLES
export const validRouters = ['tanstack-router', 'react-router']
export type RouterPackage = 'tanstack-router' | 'react-router'

export const validStyles = ['tailwind']
export type StylePackage = 'tailwind'

// DATABASE & ORM
export const validDatabases = ['sqlite']
export type DatabasePackage = 'sqlite'

export const validORMs = ['drizzle']
export type ORMPackage = 'drizzle'

export type AvailablePackages =
  | StylePackage
  | RouterPackage
  | DatabasePackage
  | ORMPackage

// PACKAGE INSTALLER MAP
export type PkgInstallerMap = Record<
  AvailablePackages,
  {
    inUse: boolean
    installer: Installer
  }
>
