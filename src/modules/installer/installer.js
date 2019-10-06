import { execSync } from 'child_process';
import modules from '../../models/modules';
import moduleService from '../../services/moduleService';

/**
 * Return a full package name for the given module.
 * 
 * @param {string} module Module to include in name
 */
const getModuleInstallName = (module) => `@smith-ai/smith-${module}`;

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
            await execSync(`npm install -g ${moduleToInstall}`, {stdio:[0,1,2], env: process.env});
            await execSync(`npm link ${moduleToInstall}`, {stdio:[0,1,2], env: process.env});

            // Retrieve the module installer function
            ({ install } = require(moduleToInstall));
        } else {
            // If in development, attempt to simply require the module
            // through the local file system.
            ({ install } = require(`/home/node/smith-modules/smith-${module}`));
        }
        
        // Execute the module installer function, which should return
        // a new config object for the module. This config will then be
        // needed to execute any actions of the module.
        const config = await install();

        // Add the module and its config to MongoDB
        await modules.add(module, config);

        // Reload the module index
        await moduleService.load();

        success = true;
    } catch (err) {
        console.error(err);
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

            await execSync(`npm unlink ${moduleToUninstall}`, {stdio:[0,1,2], env: process.env});
            await execSync(`npm uninstall -g ${moduleToUninstall}`, {stdio:[0,1,2], env: process.env});
        }

        // Remove the module from MongoDB
        await modules.remove(module);

        // Reload the module index
        await moduleService.load();

        success = true;
    } catch (err) {
        console.error(err);
    }

    return success;
}

export {
    installModule,
    uninstallModule,
};
