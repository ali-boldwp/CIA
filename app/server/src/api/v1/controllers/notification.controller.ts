import { Request, Response } from "express";
import * as notificationService from "../services/notification.service";

export const create = async (req: Request, res: Response) => {
    try {
        const { text, type, user } = req.body;

        const notif = await notificationService.createNotification({
            user,
            text,
            type,
        });

        res.status(201).json({ success: true, data: notif });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const getAll = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;

        const result = await notificationService.getUserNotifications(userId, page, limit);

        res.json({
            success: true,
            page,
            limit,
            total: result.total,
            data: result.notifications
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const unseenCount = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        const count = await notificationService.getUnseenCount(userId);

        res.json({ success: true, unseen: count });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const markAsSeen = async (req: Request, res: Response) => {
    try {
        const notifId = req.params.id;

        const updated = await notificationService.markSeen(notifId);

        res.json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};


export const markAllAsSeen = async (req: Request, res: Response) => {
    try {
        const userId = req.user.id;

        await notificationService.markAllSeen(userId);

        res.json({ success: true, message: "All notifications marked as seen" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
