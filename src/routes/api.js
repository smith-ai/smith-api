import * as express from 'express';
import invoke from '../controllers/invokeController';

/**
 * Retrieve API routes
 */
const getRoutes = async () => {
    const router = express.Router();

    router.post('/invoke', invoke);

    return router;
}

export default {
    getRoutes,
};
