import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import env from './config/env';
import v1Routes from './api/v1/routes';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

const app: Application = express();

/* Security & basics */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
}

/* Rate limiting */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api', limiter);

/* API v1 */
app.use('/api/v1', v1Routes);

/* 404 + error */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
