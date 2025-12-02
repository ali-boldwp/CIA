import { Schema, model, Types, Document } from "mongoose";

export interface IChat extends Document {
    participants: Types.ObjectId[];
    isGroup: boolean;
    groupName?: string;
    lastMessage?: Types.ObjectId;
}

const chatSchema = new Schema<IChat>(
    {
        participants: [
            { type: Schema.Types.ObjectId, ref: "User", required: true }
        ],

        isGroup: { type: Boolean, default: false },

        groupName: { type: String },

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message"
        }
    },
    { timestamps: true }
);

export default model<IChat>("Chat", chatSchema);
