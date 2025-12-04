import { Request, Response, NextFunction } from "express";
import * as humintService from "../services/humint.service";
import { ok } from "../../../utils/ApiResponse";

// CREATE
export const createHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const humint = await humintService.createHumint(req.body);
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

// MANAGER: APPROVE
export const approveHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== "manager" || req.user.role !== "admin") {
            return res.status(403).json({ message: "Managers and admin can approve requests" });
        }

        const managerId = req.user.id;

        const updated = await humintService.approveHumint(req.params.id, managerId);

        return res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};



// MANAGER: REJECT
export const rejectHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== "manager" || req.user.role !== "admin") {
            return res.status(403).json({ message: "Managers and admin can reject requests" });
        }

        const managerId = req.user.id;

        const updated = await humintService.rejectHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        return res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};



// MANAGER: REQUEST CLARIFICATION
export const clarificationHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.role !== "manager" || req.user.role !== "admin") {
            return res.status(403).json({ message: "Managers and admin can request clarification" });
        }

        const managerId = req.user.id;

        const updated = await humintService.clarificationHumint(
            req.params.id,
            req.body.managerFeedback,
            managerId
        );

        return res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};



// MARK COMPLETED
export const completeHumint = async (req: Request, res: Response, next: NextFunction) => {
    try {
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
