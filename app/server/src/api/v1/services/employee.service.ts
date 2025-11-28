import Employee, { IEmployee } from "../models/employee.model";

export const createEmployee = async (data: Partial<IEmployee>) => {
    return await Employee.create(data);
};

export const getAllEmployees = async () => {
    return await Employee.find().sort({ createdAt: -1 });
};

export const getEmployeeById = async (id: string) => {
    return await Employee.findById(id);
};

export const updateEmployee = async (id: string, data: Partial<IEmployee>) => {
    return await Employee.findByIdAndUpdate(id, data, { new: true });
};

export const deleteEmployee = async (id: string) => {
    return await Employee.findByIdAndDelete(id);
};
