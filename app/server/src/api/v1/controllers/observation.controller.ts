import { Request, Response, NextFunction } from "express";
import * as observationService from '../services/observation.service'
import { ok } from "../../../utils/ApiResponse";
import ProjectRequest from "../models/projectRequest.model";
import Observation from "../models/observation.model";

export const createObservation = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { projectId, text } = req.body;

        if (!projectId) {
            return res.status(400).json({ success: false, message: "projectId is required" });
        }

        if (!text || !text.trim()) {
            return res.status(400).json({ success: false, message: "text is required" });
        }

        // 1️⃣ Validate project exists
        const project = await ProjectRequest.findById(projectId);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }

        // 2️⃣ Create Observation
        const obs = await Observation.create({
            text,
            userId,
            projectId
        });

        // 3️⃣ Update project status → observation
        project.status = "observation";
        await project.save({ validateModifiedOnly: true });

        return res.status(201).json({
            success: true,
            message: "Observation added & project moved to observation status",
            data: obs
        });

    } catch (err) {
        next(err);
    }
};




export const getObservationProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const observationById  = await observationService.getObservationProjectById(req.params.id);
        res.json(ok(observationById));
    } catch (err) {
        next(err);
    }
};