import { Request, Response } from 'express';
import { handle } from '../services/invokeService';
import output from '../lib/output';

/**
 * Entrypoint for invoking a command. This will pass
 * the given command to the invoke service to be handled.
 * 
 * @param {Request} req Express request object
 * @param {Response} res Express response object
 */
const invoke = async (req, res) => {
    const command = req.body.command.toLowerCase();
    
    const result = await handle(command);

    res.json(result);
};

/**
 * Entrypoint for invoking a command via WebSockets. This will pass
 * the given command to the invoke service to be handled.
 * @param {mixed} ws WebSocket instance
 */
const invokeSocket = async (ws) => {
    output.set(ws);

    ws.on('message', async (msg) => {
        const result = await handle(msg);

        output.write(result, true);
    });
}

export {
    invoke,
    invokeSocket,
};
