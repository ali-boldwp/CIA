import env from './config/env';
import { connectDB } from './config/db';
import app from './app';
import logger from './utils/logger';

const start = async () => {
    await connectDB();

    app.listen(env.port, () => {
        logger.info(`Server running on http://localhost:${env.port}`);
    });
};

start().catch((err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
});
