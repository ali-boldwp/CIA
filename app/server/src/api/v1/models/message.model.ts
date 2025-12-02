import { Schema, model, Types, Document } from "mongoose";

export interface IMessage extends Document {
    chatId: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
}

const messageSchema = new Schema<IMessage>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },

        sender: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        text: { type: String, required: true }
    },
    { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);
