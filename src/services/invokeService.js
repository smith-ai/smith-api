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

const parseCommand = (command) => {
    const instructions = command.split(' to ');

    const module = instructions[0].split(' ')[1];
    const task = instructions[1];

    return {
        module,
        task,
    };
};

export { handle };