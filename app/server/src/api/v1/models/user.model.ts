import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { Role, DEFAULT_ROLE } from '../../../constants/roles';

export interface IUser extends Document {
    name: string;

    isLogin: boolean;

    email?: string;
    password?: string;
    avatarDotColor? : string;

    role: Role;

    // Analyst-only fields
    functionName: string;
    monthlySalary?: number;
    hoursPerMonth?: number;
    hoursPerDay?: number;
    bonus?: number;
    hiringDate?: Date;
    notes?: string;
    costPerHour?: number;
    costPerDay?: number;

    comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },

        // NEW FIELD
        isLogin: {
            type: Boolean,
            default: false
        },

        // Email & Password only required when isLogin = TRUE
        email: {
            type: String,
            sparse: true,
            lowercase: true,
            trim: true
        },


        password: {
            type: String,
            required: false,
            select: false
        },

        avatarDotColor: {
            type: String,
        },


        role: {
            type: String,
            enum: Object.values(Role),
            default: DEFAULT_ROLE
        },


        functionName: {
            type: String,
            required: true,
        },



        monthlySalary: Number,
        hoursPerMonth: Number,
        hoursPerDay: Number,
        bonus: { type: Number, default: 0 },
        hiringDate: Date,
        notes: String,

        costPerHour: Number,
        costPerDay: Number
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

// PRE-SAVE HOOK
userSchema.pre('save', async function (next) {
    const user = this as IUser;

    // Hash password only if needed
    if (user.isLogin && user.password && user.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    // Cost calculation for ALL roles
    if (user.monthlySalary && user.hoursPerMonth) {
        user.costPerHour = user.monthlySalary / user.hoursPerMonth;
    }

    if (user.costPerHour && user.hoursPerDay) {
        user.costPerDay = user.costPerHour * user.hoursPerDay;
    }

    next();
});


// Compare Password
userSchema.methods.comparePassword = async function (candidate: string) {
    return bcrypt.compare(candidate, this.password);
};

export default model<IUser>('User', userSchema);
