import User, { IUser } from '../models/user.model';

export const getMe = async (userId: string): Promise<IUser | null> => {
    return User.findById(userId);
};

export const getAllUsers = async (): Promise<IUser[]> => {
    return User.find().sort({ createdAt: -1 });
};

export const updateUser = async (
    userId: string,
    data: Partial<IUser>
): Promise<IUser | null> => {
    return User.findByIdAndUpdate(userId, data, {
        new: true,
        runValidators: true
    });
};
