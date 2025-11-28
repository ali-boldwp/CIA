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

        const filePaths =
            ((req.files as Express.Multer.File[]) || []).map(
                (file) => file.filename
            ) || [];

        const body = req.body as any;

        const data = {
            // saari basic fields body se:
            name: body.name,
            contactPerson: body.contactPerson,
            position: body.position,
            email: body.email,
            phone: body.phone,

            contractNumber: body.contractNumber,
            contractDone: body.contractDone === "true" || body.contractDone === true,

            annexNumber: body.annexNumber,
            annexDone: body.annexDone === "true" || body.annexDone === true,

            projectSubject: body.projectSubject,
            additionalInfo: body.additionalInfo,

            entityType: body.entityType,
            deadline: body.deadline ? new Date(body.deadline) : undefined,

            category: body.category,
            projectPrice: body.projectPrice,

            priority: body.priority, // e.g. "Normal" | "Urgent" | "Confidențial" | "Bench Task"
            deliverableLanguage: body.deliverableLanguage, // "Romanian" / "English"

            preferredAnalyst: body.preferredAnalyst || undefined, // 🔥 ab String hai (no ObjectId cast)
            selectedAnalysts: Array.isArray(body.selectedAnalysts)
                ? body.selectedAnalysts.filter((id: string) => !!id)
                : [],

            wantedServices: Array.isArray(body.wantedServices)
                ? body.wantedServices
                : [],

            referenceRequest: body.referenceRequest,

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
