import { Request, Response, NextFunction } from "express";
import * as categoryService from '../services/category.service'
import { ok } from "../../../utils/ApiResponse";




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
