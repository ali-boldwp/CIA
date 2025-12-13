import { Request, Response, NextFunction } from "express";
import * as clarificationService from '../services/clarification.service'
import { ok } from "../../../utils/ApiResponse";
import Humint from "../models/humint.model";
import User from "../models/user.model";
import { Types } from "mongoose";
import { createNotification } from "../services/notification.service";

export const createClarification = async (req, res, next) => {
    try {
        const userId = (req as any).user.id;

        const { humintId } = req.body;

        const clarificationText =
            req.body.clarificationText ||
            req.body.message ||
            req.body.text ||
            req.body.description;

        if (!humintId) {
            return res.status(400).json({ message: "humintId is required" });
        }

        if (!clarificationText) {
            return res.status(400).json({ message: "clarificationText/message is required" });
        }

        // 🔹 Get analyst (for name)
        const analyst = await User.findById(userId).select("name role");
        if (!analyst) return res.status(404).json({ message: "User not found" });

        const humint = await Humint.findById(humintId);
        if (!humint) return res.status(404).json({ message: "Humint not found" });

        // 🔹 Status logic
        let newStatus = "Requested";
        if (analyst.role === "admin" || analyst.role === "manager") {
            newStatus = "Clarification";
        }

        humint.status = newStatus;
        await humint.save({ validateModifiedOnly: true });

        const clarification = await clarificationService.createClarification({
            humintId,
            clarificationText,
            userId: new Types.ObjectId(userId)
        });

        /* ============================
           🔔 NOTIFY MANAGER
        ============================ */
        if (humint.managerId) {
            await createNotification({
                user: humint.managerId.toString(),
                title: "Clarificare HUMINT",
                text: `Analistul ${analyst.name || "analist"} a trimis o clarificare pentru solicitarea HUMINT`,
                link: `/humint/request/${humint._id}`,
                type: "info",
            });
        }

        return res.json(ok(clarification));
    } catch (err) {
        next(err);
    }
};



export const getClarificationHumintById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clarificationById  = await clarificationService.getClarificationHumintById(req.params.id);
        res.json(ok(clarificationById));
    } catch (err) {
        next(err);
    }
};