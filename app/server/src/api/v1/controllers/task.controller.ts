import { Request, Response, NextFunction } from "express";
import * as taskService from '../services/task.service'
import { ok } from "../../../utils/ApiResponse";
import Task from "../models/task.model";



export const createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.createTask(req.body);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

export const getAllTasks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await taskService.getAllTasks();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const updateTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const updatedTask = await taskService.updateTask(
            req.params.id,
            {
                name: req.body.name,
                data: req.body.data,
            }
        );

        res.json(ok(updatedTask));
    } catch (err) {
        next(err);
    }
};

export const updateTaskData = async (req, res) => {
    try {
        const { id } = req.params;
        const { data } = req.body; // dynamic data object

        if (!data) return res.status(400).json({ success: false, message: "Data is required" });

        const task = await Task.findById(id);
        if (!task) return res.status(404).json({ success: false, message: "Task not found" });

        // Merge old data with new
        task.data = { ...task.data, ...data };

        await task.save();

        res.json({ success: true, task });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};



export const deleteTask = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const deletedTask = await taskService.deleteTask(req.params.id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(ok(deletedTask));
    } catch (err) {
        next(err);
    }
};


export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTask(req.params.id);
        res.json(ok(task));
    } catch (err) {
        next(err);
    }
};

export const startTask = async (req, res) => {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    console.log("USER:", req.user);


    task.analyst = req.user.id;

    task.isPaused = false;
    task.lastStartTimestamp = Date.now();

    await task.save();

    task = await Task.findById(task._id).populate("analyst", "name");

    res.json({ message: "Task started", task });
};


export const pauseTask = async (req, res) => {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (!task.lastStartTimestamp)
        return res.status(400).json({ message: "Task was not running" });

    const diffMs = Date.now() - task.lastStartTimestamp;
    const diffSec = Math.floor(diffMs / 1000);

    task.totalSeconds += diffSec;
    task.isPaused = true;
    task.lastStartTimestamp = undefined;
    await task.save();

    // ✅ FIX: correct function name
    const projectId = await taskService.getProjectIdByTaskId(task._id);

    // update expanse
    if (projectId && task.analyst) {
        await taskService.addTimeToAnalystExpanse(task.analyst, projectId, diffSec);
    }

    res.json({
        message: "Task paused",
        totalSeconds: task.totalSeconds
    });
};



export const resumeTask = async (req, res) => {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.isPaused = false;

    // again start time
    task.lastStartTimestamp = Date.now();
    console.log( "task",task.lastStartTimestamp)

    await task.save();
    task = await Task.findById(task._id).populate("analyst", "name");

    res.json({ message: "Task resumed", task });
};


export const completeTask = async (req, res) => {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    let diffSec = 0;

    if (task.lastStartTimestamp) {
        const diffMs = Date.now() - task.lastStartTimestamp;
        diffSec = Math.floor(diffMs / 1000);

        task.totalSeconds += diffSec;
    }

    task.completed = true;
    task.isPaused = false;
    task.lastStartTimestamp = undefined;

    await task.save();

    // ✅ Get Project ID
    const projectId = await taskService.getProjectIdByTaskId(task._id);
    await taskService.addTimeToAnalystExpanse(task.analyst, projectId, diffSec);


    res.json({
        message: "Task completed",
        totalSeconds: task.totalSeconds
    });
};



