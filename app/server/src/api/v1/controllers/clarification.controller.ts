import { Request, Response, NextFunction } from "express";
import * as clarificationService from '../services/clarification.service'
import { ok } from "../../../utils/ApiResponse";


export const createClarification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const clarification = await clarificationService.createClarification({
            ...req.body,
            userId: userId
        });
        res.json(ok(clarification));
    } catch (err) {
        next(err);
    }
};

export const getClarificationHumintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clarificationById  = await clarificationService.getClarificationHumintById(req.params.id);
        res.json(ok(clarificationById));
    } catch (err) {
        next(err);
    }
};