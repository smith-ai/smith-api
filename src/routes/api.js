import * as express from 'express';
import { invoke, invokeSocket } from '../controllers/invokeController';

/**
 * Retrieve API routes
 */
const getRoutes = async () => {
    const router = express.Router();

    router.post('/invoke', invoke);

    router.ws('/invoke', invokeSocket);

    return router;
}

export default {
    getRoutes,
};
