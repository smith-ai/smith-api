import { action, actions } from '@smith-ai/smith-actions';
import { installModule, uninstallModule } from './installer';

action('uninstall', async (module) => {
    const success = await uninstallModule(module);

    return success
        ? `Successfully uninstalled ${module}`
        : `Sorry, I could not uninstall ${module}`;
});

action('install', async (module) => {
    const success = await installModule(module);

    return success
        ? `Successfully installed ${module}`
        : `Sorry, I could not install ${module}`;
});

export {
    actions,
};