import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { Role } from "../../../constants/roles";
import { ok } from "../../../utils/ApiResponse";

// ----------------------
// CREATE USER
// ----------------------
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const currentUser = (req as any).user;

        // Only admin or manager can create users
        if (![Role.ADMIN, Role.MANAGER].includes(currentUser.role)) {
            return res.status(403).json({ message: "Only Admin or Manager can create users." });
        }

        let {
            name,
            isLogin,
            email,
            password,
            role,
            functionName,
            monthlySalary,
            hoursPerMonth,
            hoursPerDay,
            bonus,
            hiringDate,
            notes,
            avatarDotColor
        } = req.body;

        // If login enabled → require credentials
        if (isLogin === true) {
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required when isLogin = true" });
            }

            const exists = await User.findOne({ email });
            if (exists) return res.status(400).json({ message: "Email already exists" });
        }

        // Create user
        const user = new User({
            name,
            isLogin,
            email,
            password,
            role,
            functionName,
            monthlySalary,
            hoursPerMonth,
            hoursPerDay,
            bonus,
            hiringDate,
            notes,
            avatarDotColor: avatarDotColor || undefined
        });

        await user.save();

        return res.json(ok(user));

    } catch (err) {
        next(err);
    }
};





// ----------------------
// LOGIN
// ----------------------
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");
        if (!user) return res.status(400).json({ message: "Invalid email" });

        if (!user.isLogin)
            return res.status(403).json({ message: "This user is not allowed to login" });

        const isMatch = await bcrypt.compare(password, user.password || "");
        if (!isMatch) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
            expiresIn: "7d",
        });

        return res.json(ok({ token, user }));

    } catch (err) {
        next(err);
    }
};


// ----------------------
// GET MY PROFILE
// ----------------------
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const user = await User.findById(userId).select("-password");
        return res.json(ok(user));
    } catch (err) {
        next(err);
    }
};



export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filter: any = {};

        if (req.query.role) {
            filter.role = req.query.role;
        }

        const users = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 });

        return res.json(ok(users));
    } catch (err) {
        next(err);
    }
};



// ----------------------
// UPDATE USER — uses save() to trigger pre-save hook!
// ----------------------
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;
        const data = req.body;

        let user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // LOGIN RULES
        if (data.isLogin === true) {
            if (!data.email || !data.password) {
                return res.status(400).json({ message: "Email + password required for login." });
            }

            const exists = await User.findOne({ email: data.email, _id: { $ne: userId } });
            if (exists) return res.status(400).json({ message: "Email already exists" });
        }


        // Merge + save → triggers pre-save for salary cost calculation
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                (user as any)[key] = data[key];
            }
        });

        await user.save();

        return res.json(ok(user));

    } catch (err) {
        next(err);
    }
};



// ----------------------
// DELETE USER
// ----------------------
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id;

        await User.findByIdAndDelete(userId);

        return res.json(ok("User deleted successfully"));

    } catch (err) {
        next(err);
    }
};
