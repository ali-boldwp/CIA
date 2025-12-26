import {Schema, model, Document, Types} from "mongoose";

export interface ITask extends Document {
    name: string;
    chapterId:Types.ObjectId;
    completed:Boolean,
    analyst: Types.ObjectId;
    isPaused: boolean;

    totalSeconds: number;
    lastStartTimestamp?: number;
    data: Record<string, any>;
}

const taskSchema = new Schema<ITask>(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        chapterId: {
            type: Schema.Types.ObjectId,
            ref: "Chapter",

        },
        completed:{
            type : Boolean,
            required :false,

        },
        analyst: {
            type : Schema.Types.ObjectId,
            ref: "User",
        },
        isPaused: { type: Boolean, default: false },

        totalSeconds: { type: Number, default: 0 },


        lastStartTimestamp: { type: Number },

        data: {
            type: Schema.Types.Mixed,
            default: {}, // important
        },

    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            }
        }
    }
);

const Task = model<ITask>("Task", taskSchema);

export default Task;
