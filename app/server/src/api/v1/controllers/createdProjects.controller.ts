import { Request, Response, NextFunction } from "express";
import * as createdProjectService from "../services/createdProjects.service";
import { ok } from "../../../utils/ApiResponse";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

  
        const files: string[] = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[]).map((f) => f.filename)
            : [];


        const body = req.body;

        // convert to array when needed
        const toArray = (val: any) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return [val];
        };


        const payload = {
            projectName: body.projectName,
            projectSubject: body.projectSubject,
            reportType: body.reportType,
            entityType: body.entityType,

            deadline: body.deadline ? new Date(body.deadline) : undefined,

            priority: body.priority,
            deliverableLanguage: body.deliverableLanguage,

            projectDescription: body.projectDescription,

            responsibleAnalyst: body.responsibleAnalyst || undefined,

            assignedAnalysts: toArray(body.assignedAnalysts),

            clientName: body.clientName,
            clientContactPerson: body.clientContactPerson,
            clientPosition: body.clientPosition,

            clientEmail: body.clientEmail,
            clientPhone: body.clientPhone,

            contractNumber: body.contractNumber,
            annexNumber: body.annexNumber,

            servicesRequested: toArray(body.servicesRequested),

            projectPrice: body.projectPrice,
            currency: body.currency || "EUR",

            contractInfo: body.contractInfo,
            referenceRequest: body.referenceRequest,
            internalNotes: body.internalNotes,

            files,

            createdBy: user.id,
            fromRequestId: body.fromRequestId || undefined
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
