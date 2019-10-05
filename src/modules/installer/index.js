import { action, actions} from '@smith-ai/smith-actions';
import { execSync } from 'child_process';
import modules from '../../models/modules';
import moduleService from '../../services/moduleService';

const getModuleInstallName = (module) => `@smith-ai/smith-${module}`;

action('uninstall', async (module) => {
    try {
        await modules.remove(module);

        const moduleToUninstall = getModuleInstallName(module);

        await execSync(`npm unlink ${moduleToUninstall}`, {stdio:[0,1,2], env: process.env});
        await execSync(`npm uninstall -g ${moduleToUninstall}`, {stdio:[0,1,2], env: process.env});

        await moduleService.load();

        return `Successfully uninstalled ${module}`;
    } catch (err) {
        console.error(err);

        return `Sorry, I could not uninstall ${module}`;
    }
});

action('install', async (module) => {
    let install;

    if (process.env.NODE_ENV !== 'development') {
        const moduleToInstall = getModuleInstallName(module);

        await execSync(`npm install -g ${moduleToInstall}`, {stdio:[0,1,2], env: process.env});
        await execSync(`npm link ${moduleToInstall}`, {stdio:[0,1,2], env: process.env});

        ({ install } = require(moduleToInstall));
    } else {
        ({ install } = require(`/home/node/smith-modules/smith-${module}`));
    }

    try {
        const config = await install();

        await modules.add(module, config);

        await moduleService.load();

        return `Successfully installed ${module}`;
    } catch (err) {
        console.error(err);

        return `Sorry, I could not install ${module}`;
    }
});

module.exports = {
    actions,
};