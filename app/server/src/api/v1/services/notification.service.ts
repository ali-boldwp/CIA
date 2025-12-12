import Notification from "../models/notification.model";

export const createNotification = async (data: {
    user: string;
    text: string;
    type?: string;
    socket?: string;
}) => {

    const notification = await Notification.create(data);

    if ( data?.socket ) {

        // code...

    }

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
