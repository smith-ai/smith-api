import * as express from 'express';
import * as invokeController from '../controllers/invokeController';
import * as moduleController from '../controllers/moduleController';

/**
 * Retrieve API routes
 */
const getRoutes = async () => {
    const router = express.Router();

    router.post('/invoke', invokeController.invoke);
    router.ws('/invoke', invokeController.invokeSocket);

    router.get('/:module/auth', moduleController.auth);
    router.post('/:module/auth', moduleController.auth);

    return router;
}

export default {
    getRoutes,
};
