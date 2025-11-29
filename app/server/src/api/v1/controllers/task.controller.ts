import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/task.service";
import { ok } from "../../../utils/ApiResponse";

// Create new task
export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = (req as any).user;

        const body = req.body;

        const payload: any = {
            projectId: body.projectId || undefined,
            title: body.title,
            taskType: body.taskType, // "Societate"

            responsible: body.responsible || user?.id, // fallback to current user

            status: body.status || "In progress",
            deadline: body.deadline ? new Date(body.deadline) : undefined,

            // sections can be sent as JSON string (from form-data) or as plain object
            sections:
                typeof body.sections === "string"
                    ? JSON.parse(body.sections)
                    : body.sections || []
        };

        const task = await taskService.createTask(payload);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

// Get all tasks
export const getAllTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.json(ok(tasks));
    } catch (err) {
        next(err);
    }
};

// Get single task
export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

// Update task (used for "Save progress" and structure changes)
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

        const data: any = {
            ...body
        };

        // If frontend sends sections as JSON string (form-data)
        if (typeof body.sections === "string") {
            data.sections = JSON.parse(body.sections);
        }

        const task = await taskService.updateTask(req.params.id, data);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

// Finalize task
export const finalizeTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.finalizeTask(req.params.id);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

// Delete task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.deleteTask(req.params.id);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

export const getTasksByProjectId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tasks = await taskService.getTasksByProjectId(req.params.projectId);
        res.json(ok(tasks));
    } catch (err) {
        next(err);
    }
};

