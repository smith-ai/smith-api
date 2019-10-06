// Persistent store of an output instance, intended to be a WebSocket
let output;

/**
 * Set a new output instance.
 * 
 * @param {mixed} newOutput Output to override
 */
const set = (newOutput) => output = newOutput;

/**
 * Write a new message to the output instance.
 * 
 * @param {string} message Message to write
 * @param {bool} complete Boolean flag indicating if this is the final 'completed' message of an action
 */
const write = (message, complete = false) => {
    if (output === null) return;

    output.send(JSON.stringify({
        message,
        complete,
    }));
};

export default {
    set,
    write,
};
