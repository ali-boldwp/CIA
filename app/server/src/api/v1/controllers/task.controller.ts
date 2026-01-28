import { Request, Response, NextFunction } from "express";
import * as taskService from '../services/task.service'
import { ok } from "../../../utils/ApiResponse";
import Task from "../models/task.model";
import Chapter from "../models/chapter.model";



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

type ShortcodeResult =
    | { type: "value"; value: any }
    | { type: "grid"; columns: any[]; rows: any[] }
    | { type: "list"; items: any[] }
    | { type: "object"; value: Record<string, any> };

function isGridTable(v: any): v is { columns: any[]; rows: any[] } {
    return (
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        Array.isArray(v.columns) &&
        Array.isArray(v.rows)
    );
}

// supports "a.b.0.c"
function getByPath(obj: any, path: string): any {
    if (!obj || !path) return undefined;
    const parts = path.split(".").map(p => p.trim()).filter(Boolean);

    let cur: any = obj;
    for (const p of parts) {
        if (cur == null) return undefined;

        // array index
        if (Array.isArray(cur) && /^\d+$/.test(p)) {
            cur = cur[Number(p)];
            continue;
        }

        cur = cur[p];
    }
    return cur;
}

function toResult(v: any): ShortcodeResult | null {
    if (v === undefined) return null;

    if (isGridTable(v)) return { type: "grid", columns: v.columns, rows: v.rows };
    if (Array.isArray(v)) return { type: "list", items: v };
    if (v && typeof v === "object") return { type: "object", value: v };
    return { type: "value", value: v };
}

/**
 * Resolve ONE token inside ONE task
 * token examples:
 *  - "shareholders" (table)
 *  - "chronology" (table)
 *  - "historyText" (simple value)
 *  - "Denumire societate" (label in 2D arrays)
 *  - "istoric.historyText" (dot-path inside data)
 */
function resolveTokenFromTask(task: any, token: string): ShortcodeResult | null {
    const key = String(token).trim();
    if (!key) return null;

    // 0) dot-path support (inside task OR inside task.data)
    const direct1 = getByPath(task, key);
    if (direct1 !== undefined) return toResult(direct1);

    const direct2 = getByPath(task?.data, key);
    if (direct2 !== undefined) return toResult(direct2);

    // 1) direct task field (name, completed, slug, etc.)
    if (task?.[key] !== undefined) return toResult(task[key]);

    // 2) search inside task.data (ALL sections: generalInfo, istoric, dateFinanciare, etc.)
    const dataObj = task?.data;
    if (!dataObj || typeof dataObj !== "object") return null;

    for (const sectionKey of Object.keys(dataObj)) {
        const section = dataObj[sectionKey];
        if (!section) continue;

        // 2a) direct match: token == key inside section
        // e.g. section["shareholders"], section["chronology"], section["historyText"]
        if (section[key] !== undefined) return toResult(section[key]);

        // 2b) search inside 2D label/value arrays in that section
        // example: generalProfile: [ ["Denumire societate","data"], ... ]
        for (const tableName of Object.keys(section)) {
            const table = section[tableName];

            if (Array.isArray(table)) {
                for (const row of table) {
                    if (Array.isArray(row) && row.length >= 2) {
                        const label = String(row[0]).trim();
                        if (label === key) {
                            return { type: "value", value: row[1] };
                        }
                    }
                }
            }
        }
    }

    return null;
}

export const fetchProjectShortcode = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;
        let { keys } = req.body;

        // allow single key OR array
        if (typeof keys === "string") keys = [keys];

        if (!Array.isArray(keys) || keys.length === 0) {
            return res.status(400).json({ success: false, message: "Keys array is required" });
        }

        // ✅ 1) get chapters of project
        const chapters = await Chapter.find({ projectId }).select("_id").lean();
        if (!chapters.length) {
            return res.status(404).json({ success: false, message: "No chapters found for this project" });
        }

        // ✅ 2) get tasks under those chapters
        const chapterIds = chapters.map((c: any) => c._id);
        const tasks = await Task.find({ chapterId: { $in: chapterIds } }).lean();
        if (!tasks.length) {
            return res.status(404).json({ success: false, message: "No tasks found for this project" });
        }

        // ✅ 3) resolve keys across all tasks - FIRST MATCH WINS
        const finalData: Record<string, any> = {};

        for (const rawKey of keys) {
            const token = String(rawKey).trim();
            let value: any = null;

            for (const t of tasks) {
                const hit = resolveTokenFromTask(t, token);
                if (!hit) continue;

                // return raw JSON only (as you want)
                if (hit.type === "value") value = hit.value;
                else if (hit.type === "grid") value = { columns: hit.columns, rows: hit.rows };
                else if (hit.type === "list") value = hit.items;
                else if (hit.type === "object") value = hit.value;

                break; // ✅ stop at first match in project
            }

            finalData[token] = value; // null if not found
        }

        return res.json({
            success: true,
            data: finalData
        });
    } catch (err) {
        next(err);
    }
};