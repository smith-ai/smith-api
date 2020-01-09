import { execSync } from 'child_process';
import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import actionService from './actionService';
import logger from '../lib/logger';
import modules from '../models/modules';
import output from '../lib/output';

/**
 * Get full filesystem path for default modules
 */
const getDefaultModulePath = () => resolve('dist/modules');

/**
 * Return a full package name for the given module.
 *
 * @param {string} module Module to include in name
 */
const getModuleInstallName = (module) => `@smith-ai/smith-${module}`;

/**
 * Require the given module
 *
 * @param {string} module Name of module to require
 * @param {bool} isDefault Boolean flag indicating if module is a default module
 */
const requireModule = (module, isDefault = false) => {
  // If default, then just require from the default path
  if (isDefault) {
    const defaultModulePath = getDefaultModulePath();

    return require(`${defaultModulePath}/${module}`);
  }

  // If in development, require from local filesystem
  if (process.env.NODE_ENV === 'development') {
    return require(`/home/node/smith-modules/smith-${module}`);
  }

  // Else, require via NPM
  return require(getModuleInstallName(module));
};

/**
 * Load the given modules into the action service.
 *
 * @param {object[]} modules Modules to load
 * @param {bool} isDefault Boolean flag indicating if loading default modules
 */
const loadModules = (modulesToLoad, isDefault = false) => {
  modulesToLoad.forEach((module) => {
    try {
      const modulePath = isDefault ? module : module.name;

      // Retrieve actions from the corresponding NPM package for the module
      const { actions } = requireModule(modulePath, isDefault);

      // Load all retrieved actions into the action service
      actions.forEach((action) => {
        actionService.add(module, { ...action }, isDefault);
        return true;
      });

      return true;
    } catch (err) {
      logger.error(err);
      return [];
    }
  });
};

/**
 * Load all default and installed Smith modules, creating
 * an index of actions in the action service. This index will then
 * be scanned on every command invocation for the corresponding action
 * to execute.
 */
const load = async () => {
  const defaultModulePath = getDefaultModulePath();

  // Load all default modules, which will already be
  // included within the local modules directory
  const defaultModules = readdirSync(defaultModulePath)
    .filter((f) => statSync(join(defaultModulePath, f)).isDirectory());
  loadModules(defaultModules, true);

  // Load all installed modules from MongoDB
  const installedModules = await modules.all();
  loadModules(installedModules);
};

/**
 * Complete authentication with the given module.
 * Expects a request object containing auth details
 * relevant to the module.
 *
 * @param {string} module Name of module to auth with
 * @param {Request} req Express request object
 */
const authModule = async (module, req) => {
  const { auth } = requireModule(module);

  const config = await auth(req);

  await modules.update(module, config);

  return true;
};


/**
 * Install a new Smith module by the given module name.
 *
 * @param {string} module Name of module to install
 */
const installModule = async (module) => {
  let install;
  let success = false;

  try {
    // If not in development, attempt to install the module via NPM
    if (process.env.NODE_ENV !== 'development') {
      const moduleToInstall = getModuleInstallName(module);

      // Install the module globally then link it, as installing locally while the
      // API is running appears to break NPM as it loses scope of other installed packages
      await execSync(`npm install -g ${moduleToInstall}`, { stdio: [0, 1, 2], env: process.env });
      await execSync(`npm link ${moduleToInstall}`, { stdio: [0, 1, 2], env: process.env });
    }

    // Retrieve the module installer function
    ({ install } = requireModule(module));

    // Execute the module installer function, which should return
    // a new config object for the module. This config will then be
    // needed to execute any actions of the module.
    const config = install !== undefined ? await install(output) : {};

    // Add the module and its config to MongoDB
    await modules.add(module, config);

    // Reload the module index
    await load();

    success = true;
  } catch (err) {
    logger.error(err);
  }

  return success;
};

/**
 * Uninstall an existing Smith module by the given module name.
 *
 * @param {string} module Name of module to uninstall
 */
const uninstallModule = async (module) => {
  let success = false;

  try {
    // If not in development, unlink and uninstall the module via NPM
    if (process.env.NODE_ENV !== 'development') {
      const moduleToUninstall = getModuleInstallName(module);

      await execSync(`npm unlink ${moduleToUninstall}`, { stdio: [0, 1, 2], env: process.env });
      await execSync(`npm uninstall -g ${moduleToUninstall}`, { stdio: [0, 1, 2], env: process.env });
    }

    // Remove the module from MongoDB
    await modules.remove(module);

    // Reload the module index
    await load();

    success = true;
  } catch (err) {
    logger.error(err);
  }

  return success;
};

export default {
  authModule,
  installModule,
  uninstallModule,
  load,
};
