import Notification from "../models/notification.model";
import { emitNotificationToUser } from "../../../socket"

export const createNotification = async (data: {
    user: string;
    title?:string;
    link?:string;
    text: string;
    type?: string;
    socket?: string;
    data?: any;
}) => {

    // 🔹 DB save (data field REQUIRED)
    const notification = await Notification.create({
        user: data.user,
        text: data.text,
        title:data.title,
        link: data.link,
        type: data.type || "info",
        data: data.data || {},
    });

    // 🔹 Socket emit
    emitNotificationToUser( data.user, notification );

    return notification;
};

export const getUserNotifications = async (userId: string, page = 1, limit = 20) => {
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ user: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const total = await Notification.countDocuments({ user: userId });

    return { notifications, total };
};

export const getUnseenCount = async (userId: string) => {
    return await Notification.countDocuments({ user: userId, seen: false });
};

export const markSeen = async (notificationId: string) => {
    return await Notification.findByIdAndUpdate(notificationId, { seen: true }, { new: true });
};

export const markAllSeen = async (userId: string) => {
    return await Notification.updateMany(
        { user: userId, seen: false },
        { $set: { seen: true } }
    );
};
