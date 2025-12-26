import { Request, Response, NextFunction } from "express";
import * as foamFieldService from "../services/foamFields.service";
import { ok } from "../../../utils/ApiResponse";

export const createFoamField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const field = await foamFieldService.createFoamField(req.body);
        res.json(ok(field));
    } catch (err) {
        next(err);
    }
};


export const updateFoamField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await foamFieldService.updateFoamField(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteFoamField = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await foamFieldService.deleteFoamField(req.params.id);
        res.json(ok(result));
    } catch (err) {
        next(err);
    }
};

export const getFoamFieldsByTaskId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const taskId = req.params.id;
        const fields = await foamFieldService.getFoamFieldsByTaskId(taskId);
        res.json(ok(fields));
    } catch (err) {
        next(err);
    }
};
