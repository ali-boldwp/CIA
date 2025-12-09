import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat.model";
import Message from "../models/message.model";
import { logAudit} from "../../../utils/logAudit";
import { Types } from "mongoose";


// Create chat (1-to-1 OR group)
export const createChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { participants, groupName } = req.body;

        if (!participants || participants.length < 2)
            return res.status(400).json({ message: "At least 2 participants required" });

        // ✔ Backend auto-decide chat type
        const isGroup = participants.length > 2;

        // ✔ If NOT group → check if direct chat already exists
        if (!isGroup) {
            const existing = await Chat.findOne({
                isGroup: false,
                participants: { $all: participants, $size: 2 }
            });

            if (existing) return res.json({ success: true, data: existing });
        }

        // ✔ Create chat (backend decides group or direct)
        const chat = await Chat.create({
            participants,
            isGroup,
            groupName: isGroup ? groupName : undefined
        });

        res.json({ success: true, data: chat });

    } catch (err) {
        next(err);
    }
};



// Get all chats of logged-in user
export const getMyChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = new Types.ObjectId((req as any).user.id);

        const chats = await Chat.aggregate([

            // Match only chats where user is a participant
            { $match: { "participants.user": userId } },

            // Extract pinned field for this user
            {
                $addFields: {
                    currentUserInfo: {
                        $filter: {
                            input: "$participants",
                            as: "p",
                            cond: { $eq: ["$$p.user", userId] }
                        }
                    }
                }
            },

            {
                $addFields: {
                    isPinned: {
                        $arrayElemAt: ["$currentUserInfo.pinned", 0]
                    }
                }
            },

            // Lookup last message
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    as: "lastMessage"
                }
            },

            { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

            // 📌 Sort logic:
            // 1. pinned first
            // 2. inside unpinned -> latest message first
            {
                $sort: {
                    isPinned: -1,                     // pinned first
                    "lastMessage.createdAt": -1,      // among unpinned → latest msg first
                    updatedAt: -1                     // fallback sorting
                }
            }
        ]);

        res.json({ success: true, data: chats });
    } catch (err) {
        next(err);
    }
};




// Get a single chat
export const getChatById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate("participants", "name role")
            .populate("lastMessage");

        res.json({ success: true, data: chat });
    } catch (err) {
        next(err);
    }
};


export const muteChat = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { chatId } = req.params;
        const { mute } = req.body;

        if (typeof mute !== "boolean") {
            return res.status(400).json({ message: "mute must be boolean" });
        }

        const userStr = userId.toString();

        const chat = await Chat.findOne({
            _id: chatId,
            $or: [
                { "participants.user": userStr },
                { "participants.user": new Types.ObjectId(userStr) }
            ]
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found or access denied" });
        }

        const participant = chat.participants.find(
            (p) => p?.user && p.user.toString() === userStr
        );

        if (!participant) {
            return res.status(403).json({ message: "You are not in this chat" });
        }

        participant.muted = mute;
        await chat.save();

        return res.json({ chatId, muted: participant.muted });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};




export const pinChat = async (req, res) => {
    try {
        const userId = req.user?._id || req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const { chatId } = req.params;
        const { pin } = req.body;

        if (typeof pin !== "boolean") {
            return res.status(400).json({ message: "pin must be boolean" });
        }

        const userStr = userId.toString();

        // Match both string AND ObjectId stored users
        const chat = await Chat.findOne({
            _id: chatId,
            $or: [
                { "participants.user": userStr },
                { "participants.user": new Types.ObjectId(userStr) }
            ]
        });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found or access denied" });
        }

        // SAFE: check that p.user exists before calling toString()
        const participant = chat.participants.find(
            (p) => p?.user && p.user.toString() === userStr
        );

        if (!participant) {
            return res.status(403).json({ message: "You are not in this chat" });
        }

        participant.pinned = pin;
        await chat.save();

        return res.json({
            chatId,
            pinned: participant.pinned
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


export const createGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const creatorId = (req as any).user.id;
        const { users, groupName, isGroup } = req.body;

        if (!users || !Array.isArray(users) || users.length < 1) {
            return res.status(400).json({ message: "At least 1 user is required" });
        }

        // ------------------------------------
        // DIRECT CHAT (1-to-1)
        // ------------------------------------
        if (!isGroup) {
            if (users.length !== 1) {
                return res.status(400).json({ message: "Direct chat requires exactly 1 user" });
            }

            const otherUserId = users[0];

            // Check if direct chat exists
            const existing = await Chat.findOne({
                isGroup: false,
                "participants.user": {
                    $all: [
                        new Types.ObjectId(creatorId),
                        new Types.ObjectId(otherUserId)
                    ]
                }
            });

            if (existing) {
                return res.json({
                    success: true,
                    message: "Direct chat already exists",
                    data: existing
                });
            }

            // Create direct chat
            const participants = [
                { user: new Types.ObjectId(creatorId), muted: false, pinned: false },
                { user: new Types.ObjectId(otherUserId), muted: false, pinned: false }
            ];

            const newChat = await Chat.create({
                isGroup: false,
                participants
            });

            // LOGS — for direct chat
            await logAudit(
                newChat._id,
                creatorId,
                `A creat un chat direct`
            );

            return res.json({
                success: true,
                message: "Direct chat created successfully",
                data: newChat
            });
        }

        // ------------------------------------
        // GROUP CHAT
        // ------------------------------------

        if (!groupName) {
            return res.status(400).json({ message: "groupName is required for group chat" });
        }

        const uniqueUsers = Array.from(new Set([creatorId, ...users]));

        const participants = uniqueUsers.map(id => ({
            user: new Types.ObjectId(id),
            muted: false,
            pinned: false
        }));

        const newGroup = await Chat.create({
            isGroup: true,
            groupName,
            participants
        });

        // LOGS — for group creation
        await logAudit(
            newGroup._id,
            creatorId,
            `A creat grupul „${groupName}”`
        );

        return res.json({
            success: true,
            message: "Group created successfully",
            data: newGroup
        });

    } catch (err) {
        next(err);
    }
};

// ---------------- ADD MEMBERS ------------------

export const addMembersToGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;
        const { users } = req.body;

        if (!users || !Array.isArray(users) || users.length < 1) {
            return res.status(400).json({ message: "Users array is required" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat.isGroup) {
            return res.status(400).json({ message: "Cannot add members to a direct chat" });
        }

        const existingUserIds = chat.participants.map(p => p.user.toString());
        const newUsers = users.filter(id => !existingUserIds.includes(id));

        newUsers.forEach(id => {
            chat.participants.push({
                user: new Types.ObjectId(id),
                muted: false,
                pinned: false
            });
        });

        // LOG — Add members
        await logAudit(chatId, req.user.id, `A adăugat membri: ${newUsers.join(", ")}`);

        await chat.save();

        return res.json({
            success: true,
            message: "Members added successfully",
            data: chat
        });

    } catch (err) {
        next(err);
    }
};

// ---------------- REMOVE MEMBER ------------------

export const removeMemberFromGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: "userId is required" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat.isGroup) {
            return res.status(400).json({ message: "Cannot remove user from direct chat" });
        }

        chat.participants = chat.participants.filter(p => p.user.toString() !== userId);

        // LOG — Remove member
        await logAudit(chatId, req.user.id, `A eliminat membrul: ${userId}`);

        await chat.save();

        return res.json({
            success: true,
            message: "Member removed successfully",
            data: chat
        });

    } catch (err) {
        next(err);
    }
};

// ---------------- LEAVE GROUP ------------------

export const leaveGroup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;
        const { chatId } = req.params;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat.isGroup) {
            return res.status(400).json({ message: "Cannot leave a direct chat" });
        }

        chat.participants = chat.participants.filter(
            p => p.user.toString() !== userId
        );

        // LOG — Leave group
        await logAudit(chatId, userId, `A părăsit grupul`);

        await chat.save();

        return res.json({
            success: true,
            message: "You left the group",
            data: chat
        });

    } catch (err) {
        next(err);
    }
};

// ---------------- DELETE GROUP ------------------

export const deleteGroupChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const chatId = req.params.chatId;
        const userId = (req as any).user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found" });

        if (!chat.isGroup) {
            return res.status(400).json({ message: "Cannot delete a direct chat" });
        }

        // Only creator (first participant) can delete
        const groupCreator = chat.participants[0].user.toString();

        if (groupCreator !== userId.toString()) {
            return res.status(403).json({ message: "Only the group creator can delete the group" });
        }

        // LOG — Delete group
        await logAudit(chatId, userId, `A șters grupul`);

        await Chat.findByIdAndDelete(chatId);

        return res.json({
            success: true,
            message: "Group deleted successfully"
        });

    } catch (err) {
        next(err);
    }
};


export const getAllUnseenCounts = async (req, res) => {
    try {
        const userId = req.user.id;

        const unseen = await Message.aggregate([
            {
                $match: {
                    sender: { $ne: new Types.ObjectId(userId) },
                    seenBy: { $ne: new Types.ObjectId(userId) }
                }
            },
            {
                $group: {
                    _id: "$chatId",
                    count: { $sum: 1 }
                }
            }
        ]);

        return res.json({ success: true, unseen });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};



export const markMessagesSeen = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        // Mark ALL messages as seen for this user
        await Message.updateMany(
            {
                chatId,
                sender: { $ne: userId },     // user should not mark their own messages
                seenBy: { $ne: userId }      // not already seen
            },
            {
                $push: { seenBy: userId }
            }
        );

        return res.json({ success: true, message: "Messages marked as seen" });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};


export const getUnseenCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { chatId } = req.params;

        const unseenCount = await Message.countDocuments({
            chatId,
            sender: { $ne: userId },  // messages from others
            seenBy: { $ne: userId }   // user has not seen them
        });

        return res.json({
            success: true,
            chatId,
            unseen: unseenCount
        });

    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};



