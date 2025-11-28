import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import env from '../../../config/env';
import User, { IUser } from '../models/user.model';
import ApiError from '../../../utils/ApiError';
import { Role } from '../../../constants/roles';

interface LoginResult {
    user: IUser;
    accessToken: string;
}

const signAccessToken = (user: IUser): string => {
    return jwt.sign(
        {
            sub: user.id,
            role: user.role as Role
        },
        env.jwtAccessSecret,
        { expiresIn: env.jwtAccessExpiresIn }
    );
};

export const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role?: Role;
}): Promise<LoginResult> => {
    const exists = await User.findOne({ email: payload.email });
    if (exists) {
        throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
    }

    const user = await User.create({
        name: payload.name,
        email: payload.email,
        password: payload.password,
        role: payload.role
    });

    const accessToken = signAccessToken(user);

    return { user, accessToken };
};

export const login = async (payload: {
    email: string;
    password: string;
}): Promise<LoginResult> => {
    const user = await User.findOne({ email: payload.email }).select('+password');

    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const isMatch = await user.comparePassword(payload.password);

    if (!isMatch) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const accessToken = signAccessToken(user);

    return { user, accessToken };
};
