import { Request, Response, NextFunction } from "express";
import * as chapterService from '../services/chapter.service'
import { ok } from "../../../utils/ApiResponse";




export const createChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chapter = await chapterService.createChapter(req.body);
        res.json(ok(chapter));
    } catch (err) {
        next(err);
    }
};

export const getAllChapter = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await chapterService.getAllChapter();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const updateChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateChapter = await chapterService.updateChapter(req.params.id, req.body);
        res.json(ok(updateChapter));
    } catch (err) {
        next(err);
    }
};

export const getChapterByProjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.id;

        // Validate ID
        if (!projectId) {
            return res.status(400).json({ success: false, message: "Project ID is required" });
        }

        const chapters = await chapterService.getChapterByProjectId(projectId);

        // If no chapter found
        if (!chapters || chapters.length === 0) {
            return res.status(404).json({ success: false, message: "No chapters found for this project" });
        }

        return res.json(ok(chapters));
    } catch (err) {
        next(err);
    }
};
