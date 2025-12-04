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
            status: "approved"
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

        await Chat.create({
            participants: Array.from(groupMembers),
            isGroup: true,
            groupName: `Project: ${payload.projectName}`
        });

        return res.json(ok(project));

    } catch (err) {
        next(err);
    }
};

export const getAllProjects = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await createdProjectService.getAllProjects();
        res.json(ok(projects));
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
