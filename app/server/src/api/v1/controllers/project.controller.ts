import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";


export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        const filePaths = (req.files as Express.Multer.File[])?.map(
            (file) => file.filename
        ) || [];

        const data = {
            ...req.body,
            preferredAnalyst: req.body.preferredAnalyst || undefined,   // ✅ FIX
            selectedAnalysts: req.body.selectedAnalysts?.filter(id => id) || [],  // remove empty
            files: filePaths,
            projectRequestedBy: user.id,
            projectCreatedBy: user.id,
        };

        const project = await projectService.createProject(data);
        res.json(ok(project));

    } catch (err) {
        next(err);
    }
};




export const getAllProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(ok(projects));
    } catch (err) {
        next(err);
    }
};


export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};


export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};


export const updateProjectStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.updateProjectStatus(req.params.id, req.body.status);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};


export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.deleteProject(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};
