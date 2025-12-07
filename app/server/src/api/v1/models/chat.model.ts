import { Schema, model, Types, Document } from "mongoose";

export interface IChatParticipant {
    user: Types.ObjectId;
    muted: boolean;
}

export interface IChat extends Document {
    participants: IChatParticipant[];
    isGroup: boolean;
    groupName?: string;
    lastMessage?: Types.ObjectId;
}


const chatSchema = new Schema<IChat>(
    {
        participants: {
            type: [
                {
                    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
                    muted: { type: Boolean, default: false }
                }
            ],
            default: []
        },

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
