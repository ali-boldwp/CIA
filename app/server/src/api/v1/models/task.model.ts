import { Schema, model, Document, Types } from "mongoose";

export interface ITaskItem {
    _id?: Types.ObjectId;
    title: string;
    checked: boolean;
    order: number;
    isEditableTitle: boolean;
}

export interface ITaskSection {
    _id?: Types.ObjectId;
    title: string;
    type: "company" | "person" | "chapter" | "relationalMap" | "executiveSummary";
    personName?: string;
    order: number;
    items: ITaskItem[];
}

export interface ITask extends Document {
    projectId?: Types.ObjectId;   // ✔ Correct simplified type
    title: string;
    taskType: string;
    responsible: Types.ObjectId;
    status: "In progress" | "Completed" | "On hold";
    deadline?: Date;

    totalPoints: number;
    completedPoints: number;
    progressPercent: number;

    sections: ITaskSection[];
    finalizedAt?: Date;
}

const taskItemSchema = new Schema<ITaskItem>(
    {
        title: { type: String, required: true },
        checked: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        isEditableTitle: { type: Boolean, default: false }
    },
    { _id: true }
);

const taskSectionSchema = new Schema<ITaskSection>(
    {
        title: { type: String, required: true },
        type: {
            type: String,
            enum: ["company", "person", "chapter", "relationalMap", "executiveSummary"],
            required: true
        },
        personName: { type: String },
        order: { type: Number, default: 0 },
        items: [taskItemSchema]
    },
    { _id: true }
);

const taskSchema = new Schema<ITask>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "CreatedProject",  // 🔥 FIXED
            required: false
        },

        title: { type: String, required: true },
        taskType: { type: String, required: true },

        responsible: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        status: {
            type: String,
            enum: ["In progress", "Completed", "On hold"],
            default: "In progress"
        },

        deadline: { type: Date },

        totalPoints: { type: Number, default: 0 },
        completedPoints: { type: Number, default: 0 },
        progressPercent: { type: Number, default: 0 },

        sections: [taskSectionSchema],

        finalizedAt: { type: Date }
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

// Auto-calc progress
taskSchema.pre("save", function (next) {
    let total = 0;
    let completed = 0;

    this.sections.forEach(section => {
        section.items.forEach(item => {
            total++;
            if (item.checked) completed++;
        });
    });

    this.totalPoints = total;
    this.completedPoints = completed;
    this.progressPercent = total > 0 ? Number(((completed / total) * 100).toFixed(1)) : 0;

    next();
});

const Task = model<ITask>("Task", taskSchema);
export default Task;
