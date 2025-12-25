import { Request, Response, NextFunction } from "express";
import * as categoryService from '../services/category.service'
import { ok } from "../../../utils/ApiResponse";
import ChapterTemplate from "../models/chapterTemplate.model";
import TaskTemplate from "../models/taskTemplate.model";
import FoamFields from "../models/foamFields.model";
import Category from "../models/category.model";




export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.json(ok(category));
    } catch (err) {
        next(err);
    }
};

export const getAllCategory = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const list = await categoryService.getAllCategory();
        res.json(ok(list));
    } catch (err) {
        next(err);
    }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateCategory = await categoryService.updateCategory(req.params.id, req.body);
        res.json(ok(updateCategory));
    } catch (err) {
        next(err);
    }
};

export const getCategoryById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const categoryId = req.params.id;

        const category = await categoryService.getCategoryById(categoryId);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json(ok(category));
    } catch (err) {
        next(err);
    }
};


export const reorderCategoryTree = async (req, res) => {
    try {
        const { chapters } = req.body;

        // 🔹 Chapters order → index map
        for (let chIndex = 0; chIndex < chapters.length; chIndex++) {
            const ch = chapters[chIndex];

            await ChapterTemplate.findByIdAndUpdate(ch._id, {
                index: chIndex, // 🔥 index = position
            });

            // 🔹 Tasks order → index map
            if (Array.isArray(ch.tasks)) {
                for (let taskIndex = 0; taskIndex < ch.tasks.length; taskIndex++) {
                    const task = ch.tasks[taskIndex];

                    await TaskTemplate.findByIdAndUpdate(task._id, {
                        index: taskIndex,
                    });

                    // 🔹 FoamFields order → index map
                    if (Array.isArray(task.foamFields)) {
                        for (
                            let fieldIndex = 0;
                            fieldIndex < task.foamFields.length;
                            fieldIndex++
                        ) {
                            const field = task.foamFields[fieldIndex];

                            await FoamFields.findByIdAndUpdate(field._id, {
                                index: fieldIndex,
                            });
                        }
                    }
                }
            }
        }

        return res.json({
            success: true,
            message: "Order updated successfully",
        });
    } catch (err) {
        console.error("Reorder error:", err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};



export const getCategoryTree = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id)
            .populate({
                path: "chapters",
                options: { sort: { index: 1 } },
                populate: {
                    path: "tasks",
                    options: { sort: { index: 1 } },
                    populate: {
                        path: "foamFields",
                        options: { sort: { index: 1 } },
                    },
                },
            });

        res.json({
            success: true,
            data: category,
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
