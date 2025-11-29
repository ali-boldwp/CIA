import { Request, Response, NextFunction } from "express";
import * as projectDetailsService from "../services/projectDetails.service";
import { ok } from "../../../utils/ApiResponse";

export const getProjectCosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectDetailsService.getProjectDetailsById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProjectCosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await projectDetailsService.updateProjectCosts(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};
