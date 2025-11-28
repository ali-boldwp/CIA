import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = (req as any).user;
        
        const filePaths: string[] = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[]).map((f) => f.filename)
            : [];


        const body = req.body as any;

        // Helper function to ensure array consistency
        const toArray = (val: any) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return [val];
        };


        const data = {
            name: body.name,
            contactPerson: body.contactPerson,
            position: body.position,
            email: body.email,
            phone: body.phone,

            contractNumber: body.contractNumber || "",
            contractDone: body.contractDone === "true" || body.contractDone === true,

            annexNumber: body.annexNumber || "",
            annexDone: body.annexDone === "true" || body.annexDone === true,

            projectSubject: body.projectSubject,
            additionalInfo: body.additionalInfo,

            entityType: body.entityType,
            deadline: body.deadline ? new Date(body.deadline) : undefined,

            category: body.category,
            projectPrice: body.projectPrice,

            priority: body.priority,
            deliverableLanguage: body.deliverableLanguage,

            preferredAnalyst: body.preferredAnalyst || null,

            selectedAnalysts: toArray(body.selectedAnalysts),

            wantedServices: toArray(body.wantedServices),

            referenceRequest: body.referenceRequest || "",

            projectDescription: body.projectDescription,
            internalNotes: body.internalNotes,

            files: filePaths,

            projectRequestedBy: user.id,
            projectCreatedBy: user.id,

            status: body.status || "requested",
        };


        const project = await projectService.createProject(data);

        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const getAllProjects = async (
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(ok(projects));
    } catch (err) {
        next(err);
    }
};

export const getProjectById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await projectService.getProjectById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await projectService.updateProject(
            req.params.id,
            req.body
        );
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProjectStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await projectService.updateProjectStatus(
            req.params.id,
            req.body.status
        );
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const project = await projectService.deleteProject(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};
