import { Request, Response, NextFunction } from "express";
import * as taskTemplateService from "../services/taskTemplate.service";
import { ok } from "../../../utils/ApiResponse";

export const createTaskTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const task = await taskTemplateService.createTaskTemplate(req.body);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

export const updateTaskTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updated = await taskTemplateService.updateTaskTemplate(
            req.params.id,
            req.body
        );
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteTaskTemplate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await taskTemplateService.deleteTaskTemplate(req.params.id);
        res.json(ok(result));
    } catch (err) {
        next(err);
    }
};

export const getTaskTemplatesByChapterId = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const chapterId = req.params.id;
        const tasks = await taskTemplateService.getTaskTemplatesByChapterId(chapterId);
        res.json(ok(tasks));
    } catch (err) {
        next(err);
    }
};
