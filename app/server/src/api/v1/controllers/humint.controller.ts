import { Request, Response, NextFunction } from "express";
import * as humintService from "../services/humint.service";
import ProjectRequest from "../models/projectRequest.model";
import { ok } from "../../../utils/ApiResponse";
import { createNotification } from "../services/notification.service";
import User from "../models/user.model";
import Humint from "../models/humint.model";

export const createHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const { projectId, briefObjective, ...rest } = req.body;

        // 🔹 Load analyst name (JWT me name nahi hota)
        const analyst = await User.findById(userId).select("name");

        // 1️⃣ If projectId provided → check if already linked
        let project: any = null;

        if (projectId) {
            project = await ProjectRequest.findById(projectId);

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }

            if (project.humintId) {
                return res.status(400).json({
                    message: "This project already has a HUMINT assigned."
                });
            }
        }

        // 2️⃣ Create HUMINT
        const humint = await humintService.createHumint({
            ...rest,
            briefObjective,
            createdBy: userId,
            projectId: projectId || undefined,
            isLinkedToProject: !!projectId
        });

        // 3️⃣ Save HUMINT ID to Project
        if (projectId) {
            await ProjectRequest.findByIdAndUpdate(
                projectId,
                { humintId: humint._id },
                { new: true }
            );
        }

        /* ============================
           🔔 NOTIFY MANAGERS
        ============================ */
        const managers = await User.find({ role: "manager" }).select("_id");

        await Promise.all(
            managers.map((manager) =>
                createNotification({
                    user: manager._id.toString(),
                    title: "Solicitare HUMINT nouă",
                    text: project
                        ? `Analistul ${analyst?.name || "analist"} a solicitat o solicitări HUMINT pentru proiectul „${project.projectName}”`
                        : `Analistul ${analyst?.name || "analist"} a solicitat o solicitări HUMINT`,
                    link: project
                        ? `/humint`
                        : `/humint`,
                    type: "info",
                })
            )
        );

        return res.json(ok(humint));

    } catch (err) {
        next(err);
    }
};



// GET ALL
export const getAllHumints = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = (req as any).user; // auth middleware se

        if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const list = await humintService.getAllHumints(
            req.query,
            user
        );

        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};


// GET ONE
export const getHumintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.getHumintById(req.params.id);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

// UPDATE (Draft or Clarification)
export const updateHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.updateHumint(req.params.id, req.body);
        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};

// SUBMIT FOR APPROVAL
export const submitHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await humintService.submitHumint(req.params.id);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

const requireManagerOrAdmin = (req: Request, res: Response) => {
    if (req.user.role !== "manager" && req.user.role !== "admin" && req.user.role !== "analyst") {
        res.status(403).json({ message: "Only managers and admins can perform this action" });
        return false;
    }
    return true;
};

/* -------------------------------------------------------
   APPROVE
-------------------------------------------------------- */
export const approveHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!requireManagerOrAdmin(req, res)) return;

        const managerId = req.user.id;

        const humint = await humintService.approveHumint(req.params.id, managerId);

        const manager = await User.findById(managerId).select("name");
        const freshHumint = await Humint.findById(humint._id).select("createdBy");

        if (freshHumint?.createdBy) {
            await createNotification({
                user: freshHumint.createdBy.toString(),
                title: "HUMINT aprobat",
                text: `Managerul ${manager?.name || "manager"} a aprobat solicitarea HUMINT`,
                link: `/humint/view/${humint._id}`,
                type: "info",
            });
        }

        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};


/* -------------------------------------------------------
   REJECT
-------------------------------------------------------- */
export const rejectHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!requireManagerOrAdmin(req, res)) return;

        const managerId = req.user.id;

        const humint = await humintService.rejectHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        const manager = await User.findById(managerId).select("name");
        const freshHumint = await Humint.findById(humint._id).select("createdBy");

        if (freshHumint?.createdBy) {
            await createNotification({
                user: freshHumint.createdBy.toString(),
                title: "HUMINT respins",
                text: `Managerul ${manager?.name || "manager"} a respins solicitarea HUMINT`,
                link: `/humint/request/${humint._id}`,
                type: "alert",
            });
        }

        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};


/* -------------------------------------------------------
   CLARIFICATION
-------------------------------------------------------- */
export const clarificationHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!requireManagerOrAdmin(req, res)) return;

        const managerId = req.user.id;

        const humint = await humintService.clarificationHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        const manager = await User.findById(managerId).select("name");
        const freshHumint = await Humint.findById(humint._id).select("createdBy");

        if (freshHumint?.createdBy) {
            await createNotification({
                user: freshHumint.createdBy.toString(),
                title: "Clarificare necesară HUMINT",
                text: `Managerul ${manager?.name || "manager"} solicită clarificări pentru activitatea HUMINT`,
                link: `/humint/request/${humint._id}`,
                type: "info",
            });
        }

        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};


/* -------------------------------------------------------
   COMPLETE HUMINT
-------------------------------------------------------- */
export const completeHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!requireManagerOrAdmin(req, res)) return;

        const managerId = req.user.id;

        const humint = await humintService.completeHumint(req.params.id);

        const manager = await User.findById(managerId).select("name");
        const freshHumint = await Humint.findById(humint._id).select("createdBy");

        if (freshHumint?.createdBy) {
            await createNotification({
                user: freshHumint.createdBy.toString(),
                title: "HUMINT finalizat",
                text: `Managerul ${manager?.name || "manager"} a finalizat activitatea HUMINT`,
                link: `/humint/view/${humint._id}`,
                type: "system",
            });
        }

        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};


// DELETE
export const deleteHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await humintService.deleteHumint(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};
