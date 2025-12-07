import AuditLog from "../api/v1/models/auditLog.model";
import  { Types } from "mongoose";

export const logAudit = async (chatId: string, userId: string, action: string) => {
    await AuditLog.create({
        chatId: new Types.ObjectId(chatId),
        userId: new Types.ObjectId(userId),
        action
    });
};