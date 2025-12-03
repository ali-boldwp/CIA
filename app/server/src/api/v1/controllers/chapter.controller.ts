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
        const chapter = await chapterService.getChapterByProjectId(req.params.id);
        res.json(ok(chapter));
    } catch (err) {
        next(err);
    }
};