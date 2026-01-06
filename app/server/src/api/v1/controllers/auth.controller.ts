import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import { ok } from '../../../utils/ApiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, accessToken } = await authService.register(req.body);
        res.status(201).json(
            ok(
                { user, accessToken },
                'User registered successfully'
            )
        );
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user, accessToken } = await authService.login(req.body);
        res.json(ok({ user, accessToken }, 'Login successful'));
    } catch (err) {
        next(err);
    }
};

export const heartbeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { user, accessToken } = await authService.refreshAccessToken(userId);

        res.json(
            ok(
                {
                    user,
                    accessToken,
                    timestamp: new Date().toISOString()
                },
                'Auth service heartbeat'
            )
        );
    } catch (err) {
        next(err);
    }
};
