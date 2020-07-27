import actionService from './actionService';
import logger from '../lib/logger';

/**
 * Handle the given command. This will attempt to
 * execute the command via the action service.
 *
 * @param {string} command Full command to handle
 */
const handle = async (command) => {
  try {
    const result = await actionService.execute(command);

    return result;
  } catch (err) {
    logger.error(err);
    return `Sorry, I could not do that.`;
  }
};

export { handle };
