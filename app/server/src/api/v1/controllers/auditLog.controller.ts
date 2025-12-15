import { Request, Response, NextFunction } from "express";
import AuditLog from "../models/auditLog.model";

export const getAuditLogs = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { chatId } = req.params;

        const logs = await AuditLog.find({ chatId })
            .populate("userId", "name")
            .sort({ timestamp: -1 });

        return res.json({
            success: true,
            data: logs,
        });
    } catch (err) {
        next(err);
    }
};
