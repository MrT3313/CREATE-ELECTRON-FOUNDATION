import path from "path";
import fs from "fs-extra";
import sortPackageJson from "sort-package-json";
import { type PackageJson } from "type-fest";

// UTILS
import { logger } from "./logger.js";

// INSTALLERS
import {
  dependencyVersionMap,
  type AvailableDependencies,
} from "../installers/dependencyVersionMap.js";

export const addPackageDependency = (opts: {
  dependencies: AvailableDependencies[];
  devMode: boolean;
  projectDir: string;
}) => {
  logger.info(`🤑🤑🤑🤑 ADDING PACKAGE DEPENDENCY: ${opts.dependencies.join(", ")}`);
  const { dependencies, devMode, projectDir } = opts;

  const pkgJson = fs.readJSONSync(
    path.join(projectDir, "package.json")
  ) as PackageJson;
  logger.debug(`🥁🥁 PACKAGE.JSON: ${JSON.stringify(pkgJson, null, 2)}`);

  dependencies.forEach((pkgName) => {
    logger.debug(`🥁🥁 PKG NAME: ${pkgName}`);
    const version = dependencyVersionMap[pkgName];
    logger.debug(`🥁🥁 VERSION: ${version}`);

    if (devMode && pkgJson.devDependencies) {
      pkgJson.devDependencies[pkgName] = version;
    } else if (pkgJson.dependencies) {
      pkgJson.dependencies[pkgName] = version;
    }
  });
  const sortedPkgJson = sortPackageJson(pkgJson);

  fs.writeJSONSync(path.join(projectDir, "package.json"), sortedPkgJson, {
    spaces: 2,
  });

  const finalPkgJson = fs.readJSONSync(
    path.join(projectDir, "package.json")
  ) as PackageJson;
  logger.debug(`🥁🥁 FINAL PACKAGE.JSON: ${JSON.stringify(finalPkgJson, null, 2)}`);
};