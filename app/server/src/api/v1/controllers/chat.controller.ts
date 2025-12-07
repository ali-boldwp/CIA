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
        const userId = (req as any).user.id;

        const chats = await Chat.aggregate([
            { $match: { "participants.user": new Types.ObjectId(userId) } },


            // Join the lastMessage document
            {
                $lookup: {
                    from: "messages",
                    localField: "lastMessage",
                    foreignField: "_id",
                    as: "lastMessage"
                }
            },

            { $unwind: { path: "$lastMessage", preserveNullAndEmptyArrays: true } },

            // Sort by last message timestamp (or updatedAt fallback)
            {
                $sort: {
                    "lastMessage.createdAt": -1,
                    updatedAt: -1
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
        const userId = req.user._id; // from auth middleware
        const { chatId } = req.params;
        const { mute } = req.body;

        if (typeof mute !== "boolean") {
            return res.status(400).json({ message: "mute must be boolean" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }

        // Find participant
        const participant = chat.participants.find(
            (p) => p.user === userId
        );

        if (!participant) {
            return res.status(403).json({ message: "You are not in this chat" });
        }

        // Update mute state
        participant.muted = mute;

        await chat.save();

        return res.json({
            chatId,
            muted: participant.muted
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

