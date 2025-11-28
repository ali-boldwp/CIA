import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Role, DEFAULT_ROLE } from '../../../constants/roles';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: Role;
    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: { type: String, required: true, select: false },
        role: {
            type: String,
            enum: Object.values(Role),
            default: DEFAULT_ROLE
        }
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.password;
                delete ret.__v;
                return ret;
            }
        }
    }
);

userSchema.pre('save', async function (next) {
    const user = this as IUser;

    if (!user.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    next();
});

userSchema.methods.comparePassword = async function (
    candidate: string
): Promise<boolean> {
    const user = this as IUser;
    return bcrypt.compare(candidate, user.password);
};

const User = model<IUser>('User', userSchema);

export default User;
