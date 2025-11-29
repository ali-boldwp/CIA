import { Request, Response, NextFunction } from "express";
import * as analystService from "../services/analyst.service";
import { ok } from "../../../utils/ApiResponse";

export const createAnalyst = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const analyst = await analystService.createAnalyst(req.body);
        res.json(ok(analyst));
    } catch (err) {
        next(err);
    }
};

export const getAllAnalysts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await analystService.getAllAnalysts();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const getAnalystById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const analyst = await analystService.getAnalystById(req.params.id);
        res.json(ok(analyst));
    } catch (err) {
        next(err);
    }
};

export const updateAnalyst = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const analyst = await analystService.updateAnalyst(req.params.id, req.body);
        res.json(ok(analyst));
    } catch (err) {
        next(err);
    }
};

export const deleteAnalyst = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const analyst = await analystService.deleteAnalyst(req.params.id);
        res.json(ok(analyst));
    } catch (err) {
        next(err);
    }
};
