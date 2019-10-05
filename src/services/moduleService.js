import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import actionService from './actionService';
import modules from '../models/modules';

const load = async () => {
    const defaultModulePath = resolve('dist/modules');

    const defaultModules = readdirSync(defaultModulePath)
        .filter((f) => statSync(join(defaultModulePath, f)).isDirectory());
    loadModules(defaultModules, (module) => ({
        modulePath: `${defaultModulePath}/${module}`,
        isDefault: true,
    }));

    const installedModules = await modules.all();
    loadModules(installedModules, (module) => ({
        modulePath: `@smith-ai/smith-${module.name}`,
        isDefault: false,
    }));
};

const loadModules = (modules, cb) => {
    modules.forEach((module) => {
        try {
            const { modulePath, isDefault } = cb(module);
            const { actions } = require(modulePath);

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
