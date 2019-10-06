import actionService from './actionService';

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
        console.error(err);

        return `Sorry, I cannot ${command}`;
    }
};

export { handle };