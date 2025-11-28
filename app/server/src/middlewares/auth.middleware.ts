import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import env from '../config/env';
import ApiError from '../utils/ApiError';
import { Role } from '../constants/roles';

export interface JwtPayload {
    sub: string;
    role: Role;
    iat?: number;
    exp?: number;
}

export const auth = (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        return next(ApiError.unauthorized('Missing authorization header'));
    }

    const token = header.substring(7);

    try {
        const payload = jwt.verify(token, env.jwtAccessSecret) as JwtPayload;
        (req as any).user = { id: payload.sub, role: payload.role };
        return next();
    } catch {
        return next(
            new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token')
        );
    }
};
