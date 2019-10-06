import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import actionService from './actionService';
import modules from '../models/modules';

/**
 * Load all default and installed Smith modules, creating
 * an index of actions in the action service. This index will then
 * be scanned on every command invocation for the corresponding action
 * to execute.
 */
const load = async () => {
    const defaultModulePath = resolve('dist/modules');

    // Load all default modules, which will already be 
    // included within the local modules directory
    const defaultModules = readdirSync(defaultModulePath)
        .filter((f) => statSync(join(defaultModulePath, f)).isDirectory());
    loadModules(defaultModules, (module) => ({
        modulePath: `${defaultModulePath}/${module}`,
        isDefault: true,
    }));

    // Load all installed modules from MongoDB
    const installedModules = await modules.all();
    loadModules(installedModules, (module) => ({
        modulePath: `@smith-ai/smith-${module.name}`,
        isDefault: false,
    }));
};

/**
 * Load the given modules into the action service.
 * 
 * @param {object[]} modules Modules to load
 * @param {function} cb Callback function to retrieve module path and default flag from
 */
const loadModules = (modules, cb) => {
    modules.forEach((module) => {
        try {
            // Retrieve the module path and default status from the given callback,
            // as this is dynamic depending on if the module is default or installed
            const { modulePath, isDefault } = cb(module);

            // Retrieve actions from the corresponding NPM package for the module
            const { actions } = require(modulePath);

            // Load all retrieved actions into the action service
            actions.forEach((action) => {
                actionService.add(module, { ...action }, isDefault);
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    });
}

export default {
    load,
};
