import { Request, Response } from 'express';
import { handle } from '../services/invokeService';

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

export default invoke;