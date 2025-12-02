import env from './config/env';
import { connectDB } from './config/db';
import app from './app';
import logger from './utils/logger';

import http from "http";
import { initSocket } from "./socket";   // ⬅️ IMPORT SOCKET INITIALIZER

const start = async () => {
    await connectDB();

    // 🔥 Create HTTP server manually
    const server = http.createServer(app);

    // 🔥 Initialize Socket.IO on the same server
    initSocket(server);

    server.listen(env.port, () => {
        logger.info(`Server running on http://localhost:${env.port}`);
        logger.info(`Socket.IO active on same server`);
    });
};

start().catch((err) => {
    logger.error('Failed to start server', err);
    process.exit(1);
});
