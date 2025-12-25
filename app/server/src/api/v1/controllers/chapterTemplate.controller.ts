import { Request, Response, NextFunction } from "express";
import * as chapterTemplateService from "../services/chapterTemplate.service";
import { ok } from "../../../utils/ApiResponse";

export const createChapterTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const chapter = await chapterTemplateService.createChapterTemplate(req.body);
        res.json(ok(chapter));
    } catch (err) {
        next(err);
    }
};

export const updateChapterTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updated = await chapterTemplateService.updateChapterTemplate(
            req.params.id,
            req.body
        );
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteChapterTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deleted = await chapterTemplateService.deleteChapterTemplate(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};

export const getChaptersByCategoryId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = req.params.id;
        const chapters = await chapterTemplateService.getChaptersByCategoryId(categoryId);
        res.json(ok(chapters));
    } catch (err) {
        next(err);
    }
};
