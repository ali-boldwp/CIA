import User, { IUser } from "../models/user.model";


// =========================
// GET LOGGED IN USER
// =========================
export const getMe = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId).select("-password"); // hide password always
};


// =========================
// GET ALL USERS
// =========================
export const getAllUsers = async (): Promise<IUser[]> => {
    return User.find()
        .select("-password") // hide password
        .sort({ createdAt: -1 });
};


// =========================
// UPDATE USER
// =========================
export const updateUser = async (
    userId: string,
    data: Partial<IUser>
): Promise<IUser | null> => {

    // Do not allow email/password update if isLogin = false
    if (data.isLogin === false) {
        data.email = undefined;
        data.password = undefined;
    }

    // Employee can never login
    if (data.role === "user") {
        data.isLogin = false;
        data.email = undefined;
        data.password = undefined;
    }

    // Only analyst can have analyst fields
    if (data.role !== "analyst") {
        delete data.monthlySalary;
        delete data.hoursPerMonth;
        delete data.hoursPerDay;
        delete data.bonus;
        delete data.hiringDate;
        delete data.notes;
    }

    return User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true
    }).select("-password");
};
