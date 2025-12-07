import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";
import ProjectRequest from "../models/projectRequest.model";
import Requested from "../models/requested.model";
import Humint from "../models/humint.model";
import Message from "../models/message.model";
import Task from "../models/task.model";

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // -------- PROJECT COUNTS --------
        const totalProjects = await ProjectRequest.countDocuments();
        const requestedProjects = await Requested.countDocuments({ status: "requested" });
        const completedProjects = await ProjectRequest.countDocuments({
            status: { $in: ["finished", "completed"] }
        });

        // -------- HUMINT COUNTS --------
        const totalHumints = await Humint.countDocuments();
        const requestedHumints = await Humint.countDocuments({ status: "Requested" });
        const completedHumints = await Humint.countDocuments({ status: "Completed" });

        // -------- ANALYSTS --------
        const totalAnalysts = await User.countDocuments({ role: "analyst" });

        const busyAnalysts = await ProjectRequest.distinct("assignedAnalysts")
            .then(ids => ids.map(id => id.toString()));


        const freeAnalysts = Math.max(totalAnalysts - busyAnalysts.length, 0);


        // -------- MESSAGES --------
        const totalMessages = await Message.countDocuments();

        // ----- FINAL RESPONSE FORMAT -----
        const stats = {
            projects: totalProjects,
            hument: totalHumints,
            analyst: {
                total: totalAnalysts,
                free: freeAnalysts
            },
            completed: completedProjects + completedHumints,
            requested: {
                projects: requestedProjects,
                huments: requestedHumints
            },
            messages: totalMessages
        };

        return res.json({ success: true, data: stats });

    } catch (err) {
        next(err);
    }
};
