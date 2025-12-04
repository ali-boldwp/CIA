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

    // If login disabled, clear credentials
    if (data.isLogin === false) {
        data.email = undefined;
        data.password = undefined;
    }

    // Analyst-only field
    if (data.role !== "analyst") {
        delete data.analystRole;
    }

    return User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true
    }).select("-password");
};
