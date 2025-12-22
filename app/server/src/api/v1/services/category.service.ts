import Category ,{ ICategory } from "../models/category.model";


export const createCategory = async (data: Partial<ICategory>) => {
    return await Category.create(data);
};

export const getAllCategory = async () => {
    return await Category.find();
};

export const updateCategory = async (id: string, data: Partial<ICategory>) => {
    return await Category.findByIdAndUpdate(id, data, { new: true });
};


