import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { connect } from './lib/db';
import apiRouter from './routes/api';
import moduleService from './services/moduleService';

const app = express();
const PORT = process.env.port || 3500;

connect().then(async () => {
    await moduleService.load();

    // Use body parser to accept JSON input
    app.use(bodyParser.json());

    app.use(function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
        next();
    });

    app.use(async (req, res, next) => {
        const router = express.Router();

        // Load API routes
        router.use('/api', await apiRouter.getRoutes());

        router(req, res, next)
    });

    app.use(function (err, req, res, next) {
        console.error(err.stack);

        res.status(500).send(err.message);
    });

    // Start the app on given port
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
});