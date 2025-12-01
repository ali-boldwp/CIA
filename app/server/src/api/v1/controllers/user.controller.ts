import { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service";
import { ok } from "../../../utils/ApiResponse";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { Role } from "../../../constants/roles";



export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            name,
            isLogin,
            email,
            password,
            role,
            monthlySalary,
            hoursPerMonth,
            hoursPerDay,
            bonus,
            hiringDate,
            notes
        } = req.body;


        if (isLogin === false) {
            email = undefined;
            password = undefined;
        }

        if (role === Role.EMPLOYEE) {
            isLogin = false;
            email = undefined;
            password = undefined;
        }


        if (isLogin === true) {
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password required when isLogin = true."
                });
            }
        }

        const user = await User.create({
            name,
            role,
            isLogin,
            email,
            password,

            // Analyst Fields
            analystRole: role === Role.ANALYST ? req.body.analystRole : undefined,
            monthlySalary: role === Role.ANALYST ? monthlySalary : undefined,
            hoursPerMonth: role === Role.ANALYST ? hoursPerMonth : undefined,
            hoursPerDay: role === Role.ANALYST ? hoursPerDay : undefined,
            bonus: role === Role.ANALYST ? bonus : 0,
            hiringDate: role === Role.ANALYST ? hiringDate : undefined,
            notes: role === Role.ANALYST ? notes : undefined
        });

        return res.json(ok(user));

    } catch (err) {
        next(err);
    }
};



export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) return res.status(400).json({ message: "Invalid email" });

        if (!user.isLogin)
            return res.status(403).json({ message: "This user cannot login" });

        const isMatch = await bcrypt.compare(password, user.password || "");

        if (!isMatch)
            return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        res.json(ok({ token, user }));

    } catch (err) {
        next(err);
    }
};



export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = (req as any).user as { id: string };
        const user = await userService.getMe(currentUser.id);
        res.json(ok(user));
    } catch (err) {
        next(err);
    }
};



export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if ((req as any).user.role !== Role.ADMIN && (req as any).user.role !== Role.MANAGER) {
            return res.status(403).json({ message: "Access denied" });
        }

        const users = await userService.getAllUsers();
        res.json(ok(users));
    } catch (err) {
        next(err);
    }
};



export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const data = req.body;


        if (data.isLogin === false) {
            data.email = undefined;
            data.password = undefined;
        }


        if (data.role === Role.EMPLOYEE) {
            data.isLogin = false;
            data.email = undefined;
            data.password = undefined;
        }


        // if (data.role !== Role.ANALYST) {
        //     delete data.monthlySalary;
        //     delete data.hoursPerMonth;
        //     delete data.hoursPerDay;
        //     delete data.bonus;
        //     delete data.hiringDate;
        //     delete data.notes;
        // }

        const updatedUser = await User.findByIdAndUpdate(userId, data, {
            new: true
        });

        return res.json(ok(updatedUser));

    } catch (err) {
        next(err);
    }
};


export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        await User.findByIdAndDelete(userId);

        return res.json(ok("User deleted successfully"));

    } catch (err) {
        next(err);
    }
};
