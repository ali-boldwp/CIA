import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Role } from '../constants/roles';
import ApiError from '../utils/ApiError';

export const authorizeRoles =
    (...allowedRoles: Role[]) =>
        (req: Request, _res: Response, next: NextFunction) => {
            const user = (req as any).user as { id: string; role: Role } | undefined;

            if (!user) {
                return next(ApiError.unauthorized('Unauthorized'));
            }

            if (!allowedRoles.includes(user.role)) {
                return next(
                    new ApiError(
                        httpStatus.FORBIDDEN,
                        `Access denied for role "${user.role}"`
                    )
                );
            }

            return next();
        };
