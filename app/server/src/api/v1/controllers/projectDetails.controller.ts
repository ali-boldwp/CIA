import { Request, Response, NextFunction } from "express";
import * as projectDetailsService from "../services/projectDetails.service";
import { ok } from "../../../utils/ApiResponse";

export const createProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        const attachments = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[]).map((f) => ({
                fileName: f.originalname,
                size: `${Math.round(f.size / 1024)} KB`,
                url: f.filename
            }))
            : [];

        const toArray = (val: any) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            return [val];
        };

        const payload: any = {
            projectName: body.projectName,
            projectSubject: body.projectSubject,
            reportType: body.reportType,
            entityType: body.entityType,
            priority: body.priority,
            language: body.language,
            description: body.description,

            actions: toArray(body.actions),

            createdAtRequest: body.createdAtRequest ? new Date(body.createdAtRequest) : undefined,
            projectStart: body.projectStart ? new Date(body.projectStart) : undefined,
            deadline: body.deadline ? new Date(body.deadline) : undefined,
            status: body.status || "In progress",

            attachments,

            responsible: body.responsible,
            assignedAnalysts: toArray(body.assignedAnalysts),

            clientName: body.clientName,
            contactPerson: body.contactPerson,
            contactRole: body.contactRole,
            contactEmail: body.contactEmail,
            contactPhone: body.contactPhone,

            contractNumber: body.contractNumber,
            annexNumber: body.annexNumber,

            projectPrice: Number(body.projectPrice),
            currency: body.currency || "EUR",

            confidentialContractInfo: body.confidentialContractInfo,
            supplementaryRequest: body.supplementaryRequest,
            internalNotes: body.internalNotes,

            fixedCosts: Number(body.fixedCosts) || 0,
            osintCosts: Number(body.osintCosts) || 0,
            employeeCostItems: body.employeeCostItems
                ? JSON.parse(body.employeeCostItems)
                : [],
            humintCostItems: body.humintCostItems
                ? JSON.parse(body.humintCostItems)
                : []
        };

        const project = await projectDetailsService.createProjectDetails(payload);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const getAllProjectDetails = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await projectDetailsService.getAllProjectDetails();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const getProjectDetailsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await projectDetailsService.getProjectDetailsById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await projectDetailsService.updateProjectDetails(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteProjectDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await projectDetailsService.deleteProjectDetails(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};
