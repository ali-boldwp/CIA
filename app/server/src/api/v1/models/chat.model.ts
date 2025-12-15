import { Schema, model, Types, Document } from "mongoose";

export interface IChatParticipant {
    user: Types.ObjectId;
    muted: boolean;
    pinned: boolean;
}

export interface IChat extends Document {
    participants: IChatParticipant[];
    isGroup: boolean;
    groupName?: string;
    lastMessage?: Types.ObjectId;
    projectId?: Types.ObjectId;
}


const chatSchema = new Schema<IChat>(
    {
        participants: {
            type: [
                {
                    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
                    muted: { type: Boolean, default: false },
                    pinned: { type: Boolean, default: false }
                }
            ],
            default: []
        },

        isGroup: { type: Boolean, default: false },

        groupName: { type: String },

        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: "Message"
        },

        projectId: {
            type: Schema.Types.ObjectId,
            ref: "ProjectRequest",
            default: null
        },
    },
    { timestamps: true }
);


export default model<IChat>("Chat", chatSchema);
