import { Request, Response, NextFunction } from "express";
import * as createdProjectService from "../services/createdProjects.service";
import ProjectRequest from "../models/projectRequest.model";
import User from "../models/user.model";
import Chat from "../models/chat.model";
import Chapter from "../models/chapter.model";
import Task from "../models/task.model";
import projectData from "../data/data.js"
import Requested from "../models/requested.model"
import Humint from "../models/humint.model";
import { ok } from "../../../utils/ApiResponse";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;

        const body = req.body;
        const { humintId } = body;

        const files = Array.isArray(req.files)
            ? req.files.map((f: any) => f.filename)
            : [];

        const toArray = (v: any) => Array.isArray(v) ? v : v ? [v] : [];

        let requestData: any = {};


        // Load request data if ID provided
        if (body.requestedId) {
            const reqProject = await Requested.findById(body.requestedId);
            console.log(reqProject)

            if (reqProject) {
                // Update request status to "approved"
                reqProject.status = "approved";
                await reqProject.save();

                requestData = reqProject.toObject();
                delete requestData._id;
                delete requestData.__v;
                delete requestData.createdAt;
                delete requestData.updatedAt;
            }
        }


        // Merge payload
        const payload = {
            ...requestData,
            ...body,
            humintId: humintId || requestData.humintId || null,
            assignedAnalysts: toArray(body.assignedAnalysts ?? requestData.assignedAnalysts),
            servicesRequested: toArray(body.servicesRequested ?? requestData.servicesRequested),
            createdBy: userId,
            files: [...(requestData.files || []), ...files],
            status: body.status ? body.status : "approved"
        };

        const project = await createdProjectService.createProject(payload);


        if (humintId) {
            await Humint.findByIdAndUpdate(
                humintId,
                {
                    projectId: project._id,
                    isLinkedToProject: true
                },
                { new: true }
            );
        }

        const reportType = project.reportType;

        if (projectData[reportType]) {
            const chaptersForProject = projectData[reportType];

            for (const chapterObj of chaptersForProject) {

                // Create chapter linked to project
                const chapter = await Chapter.create({
                    name: chapterObj.name,
                    projectId: project._id
                });

                // Create tasks belonging to this chapter
                if (chapterObj.tasks?.length) {
                    for (const t of chapterObj.tasks) {
                        await Task.create({
                            name: t.name,
                            chapterId: chapter._id,
                            completed: false
                        });
                    }
                }
            }
        }

        // CHAT GROUP CREATION
        const admins = await User.find({ role: "admin" }).select("_id");
        const managers = await User.find({ role: "manager" }).select("_id");

        const groupMembers = new Set<string>();
        admins.forEach(a => groupMembers.add(String(a._id)));
        managers.forEach(m => groupMembers.add(String(m._id)));

        if (payload.responsibleAnalyst)
            groupMembers.add(String(payload.responsibleAnalyst));

        (payload.assignedAnalysts || []).forEach((a: any) =>
            groupMembers.add(String(a))
        );


        const chatGroup = await Chat.create({
            participants: Array.from(groupMembers).map(id => ({
                user: id,
                muted: false,
                pinned: false
            })),
            isGroup: true,
            groupName: `Project: ${payload.projectName}`
        });


        project.groupChatId = chatGroup._id;
        await project.save();


        return res.json(ok(project));

    } catch (err) {
        next(err);
    }
};



export const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // pagination
    let page  = parseInt(req.query.page as string, 10) || 1;
    let limit = parseInt(req.query.limit as string, 10) || 10;
    if (page < 1) page = 1;
    if (limit < 1) limit = 1;

    const search = req.query.search ? String(req.query.search).trim() : "";

    // 👉 yeh query param use karenge
    const onlyWithoutHumint = req.query.onlyWithoutHumint === "true";

    // -------- ROLE FILTER ----------
    let roleFilter: any;
    if (user.role === "sales") {
        roleFilter = {
            fromRequestId: user._id,
            status: { $in: ["approved", "revision", "observation", "finished"] }
        };

    } else if (user.role === "analyst") {
        roleFilter = {
            $or: [
                { responsibleAnalyst: user.id },
                { assignedAnalysts: user.id },

            ]
        };
    } else if (user.role === "admin" || user.role === "manager") {
        roleFilter = {};      // no restriction
    } else {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    // -------- SEARCH FILTER ----------
    let baseFilter: any = roleFilter;

    if (search) {
        const searchFilter = {
            $or: [
                { projectName:         { $regex: search, $options: "i" } },
                { projectSubject:      { $regex: search, $options: "i" } },
                { clientName:          { $regex: search, $options: "i" } },
                { clientContactPerson: { $regex: search, $options: "i" } },
                { referenceRequest:    { $regex: search, $options: "i" } },
                { projectDescription:  { $regex: search, $options: "i" } }
            ]
        };

        baseFilter = { $and: [roleFilter, searchFilter] };
    }

    // -------- OPTIONAL HUMINT FILTER ----------
    let finalFilter: any = baseFilter;

    if (onlyWithoutHumint) {
        const humintFilter = {
            $or: [
                { humintId: { $exists: false } },
                { humintId: null }
            ]
        };

        finalFilter = { $and: [baseFilter, humintFilter] };
    }

    try {
        const skip = (page - 1) * limit;
        const projects = await createdProjectService.getAllProjects(finalFilter, { skip, limit });
        const total = await createdProjectService.countProjects(finalFilter);

        const enrichedProjects = [];

        for (const project of projects) {
            const chapters = await Chapter.find({ projectId: project._id }).select("_id");
            const chapterIds = chapters.map(c => c._id);

            const tasks = await Task.find({ chapterId: { $in: chapterIds } });

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(t => t.completed).length;

            const progress = totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

            enrichedProjects.push({
                ...(project.toObject ? project.toObject() : project),
                totalTasks,
                completedTasks,
                progress
            });
        }

        return res.status(200).json({
            status: "success",
            data: enrichedProjects,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (err) {
        next(err);
    }
};




export const getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const project = await createdProjectService.getProjectById(req.params.id);
        res.json(ok(project));
    } catch (err) {
        next(err);
    }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await createdProjectService.updateProject(req.params.id, req.body);
        res.json(ok(updated));
    } catch (err) {
        next(err);
    }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleted = await createdProjectService.deleteProject(req.params.id);
        res.json(ok(deleted));
    } catch (err) {
        next(err);
    }
};


export const getAnalystsProgress = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Get all analysts
        const analysts = await User.find({ role: "analyst" });

        // Get all approved projects
        const projects = await ProjectRequest.find({ status: "approved" });

        const result = [];

        for (const analyst of analysts) {

            // Find projects where this analyst is responsible
            const assignedProjects = projects.filter((p: any) =>
                p.responsibleAnalyst?.toString() === analyst._id.toString()
            );

            // No projects → progress = 0
            if (assignedProjects.length === 0) {
                result.push({
                    analystId: analyst._id,
                    name: analyst.name,
                    status: "liber",
                    progress: 0,
                    totalTasks: 0,
                    completedTasks: 0,
                    assignedProjects: 0
                });
                continue;
            }

            let totalTasks = 0;
            let completedTasks = 0;

            // LOOP ALL PROJECTS AND CALCULATE TASK PROGRESS
            for (const proj of assignedProjects) {
                const chapters = await Chapter.find({ projectId: proj._id }).select("_id");
                const chapterIds = chapters.map(c => c._id);

                const tasks = await Task.find({ chapterId: { $in: chapterIds } });

                totalTasks += tasks.length;
                completedTasks += tasks.filter(t => t.completed).length;
            }

            const progress = totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

            result.push({
                analystId: analyst._id,
                name: analyst.name,
                assignedProjects: assignedProjects.length,
                status: assignedProjects.length > 0 ? "în lucru" : "liber",
                progress,
                totalTasks,
                completedTasks
            });
        }

        res.json({ success: true, data: result });

    } catch (err) {
        next(err);
    }
};

export const updateEditableStatus = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { isEditable } = req.body;

        if (typeof isEditable !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isEditable must be a boolean (true/false)"
            });
        }

        const updatedProject = await ProjectRequest.findByIdAndUpdate(
            projectId,
            { isEditable },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.json({
            success: true,
            message: "Editable status updated successfully",
            data: updatedProject
        });

    } catch (error) {
        next(error);
    }
};


export const updateProjectStatus = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const { status } = req.body;

        // Allowed statuses
        const allowedStatuses = ["revision", "observation"];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Allowed: revision, observation"
            });
        }

        const project = await ProjectRequest.findByIdAndUpdate(
            projectId,
            { status },
            { new: true }
        );

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.json({
            success: true,
            message: `Project status updated to '${status}'`,
            data: project
        });

    } catch (err) {
        next(err);
    }
};


export const projectFinancialSummary = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { projectId } = req.params;

        const summary = await createdProjectService.getProjectFinancialSummary(projectId);

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error) {
        next(error);
    }
};
