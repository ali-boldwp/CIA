import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { ok } from '../../../utils/ApiResponse';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = (req as any).user as { id: string };
        const user = await userService.getMe(currentUser.id);
        res.json(ok(user));
    } catch (err) {
        next(err);
    }
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.json(ok(users));
    } catch (err) {
        next(err);
    }
};
