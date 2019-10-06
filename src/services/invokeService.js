import actionService from './actionService';

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