import express, { Application } from 'express';
import path from "path";
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import env from './config/env';
import v1Routes from './api/v1/routes';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';


const app: Application = express();

const allowedOrigins = [
    'http://localhost:3000',
    'https://cia.devregion.com/'
];

/* Security & basics */
app.use(helmet());
app.use(cors({
    origin(origin, callback) {
        // allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));



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

app.use(express.static(path.join(__dirname, 'client')));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

/* 404 + error */
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
