import { Schema, model, Types, Document } from "mongoose";

export interface IAuditLog extends Document {
    chatId: Types.ObjectId;
    userId: Types.ObjectId;
    action: string;     // Text description
    timestamp: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
    {
        chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        action: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    },
    { timestamps: false }
);

export default model<IAuditLog>("AuditLog", auditLogSchema);
