import { Request, Response, NextFunction } from "express";
import * as projectService from "../services/project.service";
import { ok } from "../../../utils/ApiResponse";
import ProjectRequest from "../models/projectRequest.model";
import * as requestedService from "../services/requested.service";
import Requested from "../models/requested.model";
import User from "../models/user.model"
import {createNotification} from "../services/notification.service";




export const requestProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;
        const body = req.body;
        const status = body.status === "draft" ? "draft" : "requested";


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
            surname: req.body.surname,

            files: files,
            fromRequestId: user.id,

            status,
        };

        console.log( user );

        const projectRequest = await Requested.create(payload);

        if (status === "requested") {
            const adminsAndManagers = await User.find({
                role: {$in: ["admin", "manager"]}
            }).select("_id");

            // ✅ Send notifications
            await Promise.all(
                adminsAndManagers.map((admin) => {
                    const socketRoom = `notification_${user._id}`;

                    return createNotification({
                        user: admin._id.toString(),
                        title: "Cerere nouă de proiect",
                        text: `A fost trimisă o cerere pentru proiectul ${projectRequest.projectName}`,
                        link: `/project/new/${projectRequest._id}`,
                        type: "info",
                        socket: socketRoom,
                    });
                })
            );
        }
        return res.json(ok(projectRequest));

    } catch (err) {
        next(err);
    }
};

export const getAllProjects = async (req, res, next) => {
    const user = req.user;

    let page  = parseInt(req.query.page, 10)  || 1;
    let limit = parseInt(req.query.limit, 10) || 10;

    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    let filter = {};

    if (user.role === "sales") {
        filter = { fromRequestId: user.id };
    }
    else if (user.role === "analyst") {
        filter = {
            $or: [
                { responsibleAnalyst: user.id },
                { assignedAnalysts: user.id }
            ]
        };
    }
    else if (user.role === "admin" || user.role === "manager") {
        filter = {};
    }
    else {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    try {
        const skip = (page - 1) * limit;

        // ⭐ Use mongoose model directly
        const projects = await Requested.find(filter)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Requested.countDocuments(filter);

        res.status(200).json({
            status: "success",
            data: projects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });

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

            const projects = await requestedService.getAllRequestedProjects({ fromRequestId: user.id , status : "requested"});
            res.json(ok(projects));

        } else if ( user.role == 'analyst' ) {

            const projects = await requestedService.getAllRequestedProjects({ responsibleAnalyst: user.id , status : "requested" });
            res.json(ok(projects));

        } else if ( user.role == 'admin' || user.role == 'manager' ) {

            const projects = await requestedService.getAllRequestedProjects({ status : "requested"});
            res.json(ok(projects));

        } else {

            res.json(ok([]));

        }

    } catch (err) {
        next(err);
    }
};


export const getSalesRequestedProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        const search = req.query.search
            ? String(req.query.search).trim()
            : "";

        // 🔎 base filter
        let filter: any = {
            fromRequestId: user.id,
            status: "requested",
        };

        // 🔍 search filter
        if (search) {
            filter.$or = [
                { projectName:         { $regex: search, $options: "i" } },
                { projectSubject:      { $regex: search, $options: "i" } },
                { clientName:          { $regex: search, $options: "i" } },
                { clientContactPerson: { $regex: search, $options: "i" } },
                { referenceRequest:    { $regex: search, $options: "i" } }
            ];
        }

        const requests = await Requested
            .find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            status: "success",
            data: requests
        });

    } catch (err) {
        next(err);
    }
};
