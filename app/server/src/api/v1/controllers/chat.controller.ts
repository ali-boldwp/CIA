import { Request, Response, NextFunction } from "express";
import Chat from "../models/chat.model";
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
        const { groupName, users } = req.body;

        if (!groupName) {
            return res.status(400).json({ message: "groupName is required" });
        }

        if (!users || !Array.isArray(users) || users.length < 1) {
            return res.status(400).json({ message: "At least 1 user is required to create a group" });
        }

        // Remove duplicates + ensure creator is added
        const uniqueUsers = Array.from(new Set([creatorId, ...users]));

        // Build participants array according to your model
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

        return res.json({
            success: true,
            message: "Group created successfully",
            data: newGroup
        });

    } catch (err) {
        next(err);
    }
};