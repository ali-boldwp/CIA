import { Request, Response, NextFunction } from "express";
import * as clarificationService from '../services/clarification.service'
import { ok } from "../../../utils/ApiResponse";
import Humint from "../models/humint.model";
import User from "../models/user.model";
import { Types } from "mongoose";

export const createClarification = async (req, res, next) => {
    try {
        const userId = (req as any).user.id;

        console.log("REQ BODY:", req.body);  // DEBUG LINE

        const { humintId } = req.body;

        // Accept multiple possible message field names
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

        // Get the user role
        const user = await User.findById(userId).select("role");
        if (!user) return res.status(404).json({ message: "User not found" });

        const humint = await Humint.findById(humintId);
        if (!humint) return res.status(404).json({ message: "Humint not found" });

        let newStatus = "Requested";
        if (user.role === "admin" || user.role === "manager") {
            newStatus = "Clarification";
        }

        humint.status = newStatus;
        await humint.save({ validateModifiedOnly: true });

        const clarification = await clarificationService.createClarification({
            humintId,
            clarificationText,
            userId: new Types.ObjectId(userId)
        });

        res.json(ok(clarification));
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