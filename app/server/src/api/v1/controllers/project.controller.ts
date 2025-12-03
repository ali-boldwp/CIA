import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";
import ProjectRequest from "../models/projectRequest.model";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const body = req.body;

        const files = Array.isArray(req.files)
            ? (req.files as Express.Multer.File[]).map(f => f.filename)
            : [];

        const toArray = (v: any) => {
            if (!v) return [];
            return Array.isArray(v) ? v : [v];
        };

        // STEP 1 → Load RequestProject if provided
        let requestData: any = {};
        if (body.fromRequestId) {
            const reqProject = await ProjectRequest.findById(body.fromRequestId);
            if (reqProject) {
                requestData = reqProject.toObject();
            }
        }

        // STEP 2 → Merge: Form2 fields override Form1 fields
        const payload: any = {
            // Required fields auto-filled
            projectName: body.projectName || requestData.projectName,
            projectSubject: body.projectSubject || requestData.projectSubject,
            reportType: body.reportType || requestData.reportType,
            entityType: body.entityType || requestData.entityType,
            priority: body.priority || requestData.priority,
            deliverableLanguage: body.deliverableLanguage || requestData.deliverableLanguage,
            projectDescription: body.projectDescription || requestData.projectDescription,

            clientName: body.clientName || requestData.clientName,
            clientContactPerson: body.clientContactPerson || requestData.clientContactPerson,
            clientEmail: body.clientEmail || requestData.clientEmail,
            clientPhone: body.clientPhone || requestData.clientPhone,

            projectPrice: body.projectPrice
                ? Number(body.projectPrice)
                : Number(requestData.projectPrice),

            currency: body.currency || requestData.currency || "EUR",

            // Optional fields
            deadline: body.deadline
                ? new Date(body.deadline)
                : requestData.deadline,

            clientPosition: body.clientPosition || requestData.clientPosition,

            responsibleAnalyst: body.responsibleAnalyst || requestData.responsibleAnalyst,

            assignedAnalysts: toArray(body.assignedAnalysts || requestData.assignedAnalysts),

            contractNumber: body.contractNumber || requestData.contractNumber,
            annexNumber: body.annexNumber || requestData.annexNumber,

            servicesRequested: toArray(body.servicesRequested || requestData.servicesRequested),

            contractInfo: body.contractInfo || requestData.contractInfo,
            referenceRequest: body.referenceRequest || requestData.referenceRequest,
            internalNotes: body.internalNotes || requestData.internalNotes,

            files: [...(requestData.files || []), ...files],

            // createdBy: user.id,

            fromRequestId: body.fromRequestId,

            status: "requested"

        };

        if ( req.user.role == 'admin' || req.user.role == 'manager' ) {

            payload.status = "approved";

        }

        // FINAL SAVE
        const project = await projectService.createProject(payload);

        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};



export const getAllProjects = async (_req, res, next) => {
    try {
        const projects = await projectService.getAllProjects();
        res.json(ok(projects));
    } catch (err) {
        next(err);
    }
};

export const getProjectById = async (req, res, next) => {
    try {
        const project = await projectService.getProjectById(req.params.id);

        // if ( project.status == 'requested' && ( req.user.role !== 'admin' || req.user.role !== 'manager' ) ) {
        //
        //     res.json({ error: true, message: "Unauthorized" });
        //
        // }
        //
        // if ( project.status !== 'requested' && ( req.user.role !== 'admin' || req.user.role !== 'manager' || req.user._id !== project.fromRequestId
        //     || req.user._id !== project.responsibleAnalyst  ) ) {
        //
        //     res.json({ error: true, message: "Unauthorized" });
        //
        // }

        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req, res, next) => {
    try {

        const updated = await projectService.updateProject(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const approveProject = async (req, res, next) => {
    try {

        if ( ( req.user.role !== 'admin' && req.user.role !== 'manager' ) ) {

            res.json({ error: true, message: "Unauthorized" });

        }

        const user = (req as any).user;
        const data = req.body;

        data.status = 'approved';
        data.createdBy = user._id;

        const updated = await projectService.updateProject(req.params.id, data );

        res.json(ok(updated));

    } catch (err) {
        next(err);
    }
};

export const updateProjectStatus = async (req, res, next) => {
    try {
        const updated = await projectService.updateProjectStatus(
            req.params.id, req.body.status
        );
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req, res, next) => {
    try {
        const deleted = await projectService.deleteProject(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};
