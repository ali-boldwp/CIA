import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { fail } from '../utils/ApiResponse';
import logger from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
};

export const errorHandler = (
    err: Error | ApiError,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction
) => {
    const statusCode =
        err instanceof ApiError && err.statusCode
            ? err.statusCode
            : httpStatus.INTERNAL_SERVER_ERROR;

    const message = err.message || 'Internal server error';

    logger.error(`[${req.method}] ${req.originalUrl}`, message);

    res.status(statusCode).json(
        fail(message, {
            statusCode
        })
    );
};
