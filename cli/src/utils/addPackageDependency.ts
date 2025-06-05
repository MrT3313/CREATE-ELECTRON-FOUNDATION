import path from 'path'
import fs from 'fs-extra'
import sortPackageJson from 'sort-package-json'
import { type PackageJson } from 'type-fest'

// UTILS
import { logger } from './logger.js'

// INSTALLERS
import {
  dependencyVersionMap,
  type AvailableDependencies,
} from '../installers/dependencyVersionMap.js'

export const addPackageDependency = (opts: {
  dependencies: AvailableDependencies[]
  devMode: boolean
  projectDir: string
  debug?: boolean
}) => {
  const { dependencies, devMode, projectDir, debug = false } = opts

  const pkgJson = fs.readJSONSync(
    path.join(projectDir, 'package.json')
  ) as PackageJson

  dependencies.forEach((pkgName) => {
    const version = dependencyVersionMap[pkgName]

    if (devMode && pkgJson.devDependencies) {
      pkgJson.devDependencies[pkgName] = version
    } else if (pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = version
    }
  })
  const sortedPkgJson = sortPackageJson(pkgJson)

  fs.writeJSONSync(path.join(projectDir, 'package.json'), sortedPkgJson, {
    spaces: 2,
  })

  const finalPkgJson = fs.readJSONSync(
    path.join(projectDir, 'package.json')
  ) as PackageJson

  if (debug)
    logger.info(`Added ${dependencies.length} dependencies to package.json`)
  if (debug) logger.info(`${dependencies.join(', ')}`)

  if (debug)
    logger.info(`Final package.json: ${JSON.stringify(finalPkgJson, null, 2)}`)
}
