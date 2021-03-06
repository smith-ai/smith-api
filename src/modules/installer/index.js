import { action, actions } from '@smith-ai/smith-actions';
import moduleService from '../../services/moduleService';

action('uninstall', async (module, config, output) => {
  output.write(`Uninstalling ${module}`);

  const success = await moduleService.uninstallModule(module);

  return success
    ? `Successfully uninstalled ${module}`
    : `Sorry, I could not uninstall ${module}`;
});

action('install', async (module, config, output) => {
  output.write(`Installing ${module}`);

  const success = await moduleService.installModule(module);

  return success
    ? `Successfully installed ${module}`
    : `Sorry, I could not install ${module}`;
});

export {
  actions,
};
