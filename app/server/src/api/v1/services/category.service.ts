import Category ,{ ICategory } from "../models/category.model";
import Chapter from "../models/chapter.model";
import Task from "../models/task.model";
import Employee from "../models/employee.model";

export const createCategory = async (data: Partial<ICategory>) => {
    return await Category.create(data);
};

export const getAllCategory = async () => {
    return await Category.find();
};

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};

export const deleteCategory = async (id: string) => {
    return await Category.findByIdAndDelete(id);
};

export const getCategoryById = async (id: string) => {
    return Category.findById(id)
        .populate({
            path: "chapters",
            options: { sort: { index: 1 } },
            populate: {
                path: "tasks",
                options: { sort: { index: 1 } },
                populate: {
                    path: "foamFields",
                    options: { sort: { index: 1 } },
                    model: "FoamFields",
                },
            },
        })
};


