import { Request, Response, NextFunction } from "express";
import * as taskService from '../services/task.service'
import { ok } from "../../../utils/ApiResponse";
import Task from "../models/task.model";
import * as chapterService from "../services/chapter.service";



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

// export const updatetask = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const updateTask = await taskService.updatetask(req.params.id, req.body);
//         res.json(ok(updateTask));
//     } catch (err) {
//         next(err);
//     }
// };

export const getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const task = await taskService.getTaskById(req.params.id);
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

    // time difference
    const diffMs = Date.now() - task.lastStartTimestamp;
    const diffSec = Math.floor(diffMs / 1000);

    // add to total time
    task.totalSeconds += diffSec;

    task.isPaused = true;
    task.lastStartTimestamp = undefined;

    await task.save();
    task = await Task.findById(task._id).populate("analyst", "name");

    res.json({ message: "Task paused", totalSeconds: task.totalSeconds });
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

    
    if (task.lastStartTimestamp) {
        const diffMs = Date.now() - task.lastStartTimestamp;
        const diffSec = Math.floor(diffMs / 1000);

        task.totalSeconds += diffSec;
    }



    task.completed = true;
    task.isPaused = false;
    task.lastStartTimestamp = undefined;

    await task.save();
    task = await Task.findById(task._id).populate("analyst", "name");

    res.json({ message: "Task completed", totalSeconds: task.totalSeconds });
};

