import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';
import ApiError from '../utils/ApiError';

type Segment = 'body' | 'query' | 'params';

export const validate =
    (schema: ObjectSchema, segment: Segment = 'body') =>
        (req: Request, _res: Response, next: NextFunction) => {
            const { error, value } = schema.validate((req as any)[segment], {
                abortEarly: false,
                stripUnknown: true
            });

            if (error) {
                const message = error.details.map((d) => d.message).join(', ');
                return next(ApiError.badRequest(message));
            }

            (req as any)[segment] = value;
            next();
        };
