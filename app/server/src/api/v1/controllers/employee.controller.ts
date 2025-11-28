import { Request, Response, NextFunction } from "express";
import * as employeeService from "../services/employee.service";
import { ok } from "../../../utils/ApiResponse";

/* CREATE EMPLOYEE */
export const createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await employeeService.createEmployee(req.body);
        res.json(ok(employee));
    } catch (err) {
        next(err);
    }
};

/* GET ALL EMPLOYEES */
export const getAllEmployees = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await employeeService.getAllEmployees();
        res.json(ok(employees));
    } catch (err) {
        next(err);
    }
};

/* GET EMPLOYEE BY ID */
export const getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        res.json(ok(employee));
    } catch (err) {
        next(err);
    }
};

/* UPDATE EMPLOYEE */
export const updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await employeeService.updateEmployee(req.params.id, req.body);
        res.json(ok(employee));
    } catch (err) {
        next(err);
    }
};

/* DELETE EMPLOYEE */
export const deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const employee = await employeeService.deleteEmployee(req.params.id);
        res.json(ok(employee));
    } catch (err) {
        next(err);
    }
};
