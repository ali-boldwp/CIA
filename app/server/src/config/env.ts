import dotenv from 'dotenv';

dotenv.config();

const env = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 4000,
    mongoUri:
        process.env.MONGO_URI ||
        'mongodb://127.0.0.1:27017/advanced_mvc_api',
    jwtAccessSecret:
        process.env.JWT_ACCESS_SECRET || 'change-this-secret',
    jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
};

export default env;
