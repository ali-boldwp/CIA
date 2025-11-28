import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";

/* CREATE */
export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        const data = {
            ...req.body,
            projectRequestedBy: user.id,
            projectCreatedBy: user.id
        };

        const project = await projectService.createProject(data);

        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

/* GET ALL */
export const getAllProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(ok(projects));
    } catch (err) {
        next(err);
    }
};

/* GET ONE */
export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

/* UPDATE FULL */
export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

/* UPDATE STATUS */
export const updateProjectStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.updateProjectStatus(req.params.id, req.body.status);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

/* DELETE */
export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectService.deleteProject(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};
