import { Request, Response, NextFunction } from "express";
import * as humintService from "../services/humint.service";
import { ok } from "../../../utils/ApiResponse";

export const createHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.createHumint(req.body);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

export const getAllHumints = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await humintService.getAllHumints();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const getHumintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.getHumintById(req.params.id);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

export const updateHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.updateHumint(req.params.id, req.body);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

export const updateHumintStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.updateHumintStatus(req.params.id, req.body.status);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

export const deleteHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.deleteHumint(req.params.id);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};
