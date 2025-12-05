import { Request, Response, NextFunction } from "express";
import * as humintService from "../services/humint.service";
import { ok } from "../../../utils/ApiResponse";

// CREATE
export const createHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const humint = await humintService.createHumint({
            ...req.body,
            briefObjective: req.body.briefObjective,
            createdBy: userId
        });

        res.json(ok(humint));
    } catch (err) {
        next(err);
    }
};


// GET ALL
export const getAllHumints = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await humintService.getAllHumints(req.query);
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
    if (req.user.role !== "manager" && req.user.role !== "admin" && req.user.role !== "aanalyst") {
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

        const updated = await humintService.approveHumint(req.params.id, managerId);
        res.json(ok(updated));

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

        const updated = await humintService.rejectHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        res.json(ok(updated));

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

        const updated = await humintService.clarificationHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        res.json(ok(updated));

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

        const updated = await humintService.completeHumint(req.params.id);
        res.json(ok(updated));

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
