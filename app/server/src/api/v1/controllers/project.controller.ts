import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";
import ProjectRequest from "../models/projectRequest.model";
import * as requestedService from "../services/requested.service";
import Requested from "../models/requested.model";


export const requestProject = async (req: Request, res: Response, next: NextFunction) => {
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

        // Client request form → Only simple save
        const payload: any = {
            projectName: body.projectName,
            projectSubject: body.projectSubject,
            reportType: body.reportType,
            entityType: body.entityType,
            priority: body.priority,
            deliverableLanguage: body.deliverableLanguage,
            projectDescription: body.projectDescription,

            clientName: body.clientName,
            clientContactPerson: body.clientContactPerson,
            clientEmail: body.clientEmail,
            clientPhone: body.clientPhone,

            projectPrice: body.projectPrice ? Number(body.projectPrice) : 0,
            currency: body.currency || "EUR",

            deadline: body.deadline ? new Date(body.deadline) : undefined,
            clientPosition: body.clientPosition,
            responsibleAnalyst: body.responsibleAnalyst,

            assignedAnalysts: toArray(body.assignedAnalysts),
            contractNumber: body.contractNumber,
            annexNumber: body.annexNumber,

            servicesRequested: toArray(body.servicesRequested),
            contractInfo: body.contractInfo,
            referenceRequest: body.referenceRequest,
            internalNotes: body.internalNotes,

            files: files,
            fromRequestId: user.id,

            status: "requested",
        };

        console.log( user );

        const projectRequest = await Requested.create(payload);

        return res.json(ok(projectRequest));

    } catch (err) {
        next(err);
    }
};

export const getAllProjects = async ( req, res, next) => {

    const user = (req as any).user;

    try {

        if ( user.role == 'sales' ) {

            const projects = await projectService.getAllProjects({ fromRequestId: user.id });
            res.json(ok(projects));

        } else if ( user.role == 'analyst' ) {

            const projects = await projectService.getAllProjects({ responsibleAnalyst: user.id });
            res.json(ok(projects));

        } else if ( user.role == 'admin' || user.role == 'manager' ) {

            const projects = await projectService.getAllProjects({});
            res.json(ok(projects));

        } else {

            res.json(ok([]));

        }

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

        // const user = (req as any).user;
        const data = req.body;

        data.status = 'approved';
        // data.createdBy = user._id;

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


export const getRequestedProjectById = async (req, res, next) => {
    try {
        const requestedProject = await requestedService.getRequestedProjectById(req.params.id);

        res.json(ok(requestedProject));
    } catch (err) {
        next(err);
    }
};

export const getAllRequestedProjects = async ( req, res, next) => {

    const user = (req as any).user;

    try {

        if ( user.role == 'sales' ) {

            const projects = await requestedService.getAllRequestedProjects({ fromRequestId: user.id });
            res.json(ok(projects));

        } else if ( user.role == 'analyst' ) {

            const projects = await requestedService.getAllRequestedProjects({ responsibleAnalyst: user.id });
            res.json(ok(projects));

        } else if ( user.role == 'admin' || user.role == 'manager' ) {

            const projects = await requestedService.getAllRequestedProjects({});
            res.json(ok(projects));

        } else {

            res.json(ok([]));

        }

    } catch (err) {
        next(err);
    }
};