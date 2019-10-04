import { handle } from '../services/invokeService';

const invoke = async (req, res) => {
    const command = req.body.command.toLowerCase();
    
    const result = await handle(command);

    res.json(result);
};

export default invoke;