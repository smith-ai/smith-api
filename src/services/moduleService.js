import { readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import actionService from './actionService';

const load = () => {
    const modulePath = resolve('../smith-modules');

    const modules = readdirSync(modulePath)
        .filter((f) => statSync(join(modulePath, f)).isDirectory());

    modules.forEach((module) => {
        try {
            const actions = require(`${modulePath}/${module}`);

            actions.forEach((action) => {
                actionService.add(module, { ...action });
            });
        } catch (err) {
            console.error(err);
            return [];
        }
    });
};

export default {
    load,
};
