import { Request, Response, NextFunction } from "express";
import * as createdProjectService from "../services/createdProjects.service";
import ProjectRequest from "../models/projectRequest.model";
import User from "../models/user.model";
import Chat from "../models/chat.model";
import Chapter from "../models/chapter.model";
import Task from "../models/task.model";
import projectData from "../data/data.js"
import Requested from "../models/requested.model"
import { ok } from "../../../utils/ApiResponse";

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;

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
            assignedAnalysts: toArray(body.assignedAnalysts ?? requestData.assignedAnalysts),
            servicesRequested: toArray(body.servicesRequested ?? requestData.servicesRequested),
            files: [...(requestData.files || []), ...files],
            status: body.status ? body.status : "approved"
        };

        const project = await createdProjectService.createProject(payload);


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

    // Build role filter
    let roleFilter: any;
    if (user.role === "sales") {
        roleFilter = { fromRequestId: user.id };
    } else if (user.role === "analyst") {
        roleFilter = {
            $or: [
                { responsibleAnalyst: user.id },
                { assignedAnalysts: user.id }
            ]
        };
    } else if (user.role === "admin" || user.role === "manager") {
        roleFilter = {};      // no restriction
    } else {
        return res.status(403).json({ status: "error", message: "Forbidden" });
    }

    // Build search filter (if search provided)
    let finalFilter: any = roleFilter;
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

        finalFilter = { $and: [ roleFilter, searchFilter ] };
    }

    try {
        const skip = (page - 1) * limit;
        const projects = await createdProjectService.getAllProjects(finalFilter, { skip, limit });
        const total = await createdProjectService.countProjects(finalFilter);

        res.status(200).json({
            status: "success",
            data: projects,
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
