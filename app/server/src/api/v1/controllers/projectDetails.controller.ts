import { Request, Response, NextFunction } from "express";
import * as projectDetailsService from "../services/projectDetails.service";
import { ok } from "../../../utils/ApiResponse";

// Create
export const createProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectDetailsService.createProjectDetails(req.body);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

// Get all
export const getAllProjectDetails = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await projectDetailsService.getAllProjectDetails();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

// Get one
export const getProjectDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectDetailsService.getProjectDetailsById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

// Update
export const updateProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await projectDetailsService.updateProjectDetails(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

// Delete
export const deleteProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await projectDetailsService.deleteProjectDetails(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};
