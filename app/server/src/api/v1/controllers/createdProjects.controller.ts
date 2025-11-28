import { Request, Response, NextFunction } from "express";
import * as createdProjectService from "../services/createdProjects.service";
import { ok } from "../../../utils/ApiResponse";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        const files = (req.files as Express.Multer.File[])?.map(f => f.filename) || [];

        const payload = {
            ...req.body,
            files,
            createdBy: user.id
        };

        const project = await createdProjectService.createProject(payload);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};


export const getAllProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await createdProjectService.getAllProjects();
        res.json(ok(projects));
    } catch (err) {
        next(err);
    }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await createdProjectService.getProjectById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await createdProjectService.updateProject(req.params.id, req.body);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await createdProjectService.deleteProject(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};
