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
        const { id: categoryId } = req.params;
        const { chapters } = req.body;

        // 🔹 Update chapters index
        for (const ch of chapters) {
            await ChapterTemplate.findByIdAndUpdate(ch._id, {
                index: ch.index,
            });

            // 🔹 Update tasks index
            if (ch.tasks) {
                for (const task of ch.tasks) {
                    await TaskTemplate.findByIdAndUpdate(task._id, {
                        index: task.index,
                    });

                    // 🔹 Update foam fields index
                    if (task.foamFields) {
                        for (const field of task.foamFields) {
                            await FoamFields.findByIdAndUpdate(field._id, {
                                index: field.index,
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
