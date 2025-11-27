// apps/server/src/modules/auth/auth.controller.ts
import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await authService.register(req.body);
        res.status(201).json(data);
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { user, accessToken } = await authService.login(req.body);

        res
            .cookie("access_token", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
            })
            .json({ user });
    } catch (err) {
        next(err);
    }
}

export async function logout(_req: Request, res: Response) {
    res.clearCookie("access_token").status(204).send();
}

export async function me(req: Request, res: Response) {
    res.json({ user: req.user });
}
