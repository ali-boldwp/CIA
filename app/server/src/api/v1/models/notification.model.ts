import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
    user: mongoose.Types.ObjectId; 
    text: string;
    type: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;

}

const NotificationSchema = new Schema<INotification>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["info", "message", "alert", "task", "system"],
            default: "info",
        },

        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<INotification>(
    "Notification",
    NotificationSchema
);
