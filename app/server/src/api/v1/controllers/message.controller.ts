import { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";
import Chat from "../models/chat.model";
import ProjectRequest from "../models/projectRequest.model";
import { getIO } from "../../../socket";

export const sendMessage = async (req, res, next) => {
    try {
        const sender = req.user.id;
        let { chatId } = req.params;
        const { text } = req.body;

        // 1️⃣ Instant socket emit (client sees message immediately)
        const instantMsg = {
            _id: Date.now(),     // temporary ID
            chatId,
            text,
            sender,
            seenBy: [sender]     // 👈 VERY IMPORTANT
        };

        getIO().to(chatId).emit("new_message", instantMsg);

        // 2️⃣ Handle 'open' chat
        if (chatId === "open") {
            chatId = null;
        }

        // 3️⃣ Save to DB — sender must be first viewer
        const savedMessage = await Message.create({
            chatId,
            sender,
            text,
            seenBy: [sender]     // 👈 VERY IMPORTANT
        });

        // 4️⃣ Update chat lastMessage
        if (chatId) {
            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: savedMessage._id
            });
        }
        const project = await ProjectRequest.findOne({
            groupChatId: chatId
        }).select("files");

        // 5️⃣ Return final DB message
        res.json({ success: true, data: savedMessage });

    } catch (err) {
        next(err);
    }
};




export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10;
        const before = req.query.before as string | undefined;

        let filter: any = { chatId };

        // If "before" is provided → load messages older than that ID
        if (before) {
            const beforeMsg = await Message.findById(before);
            if (!beforeMsg) return res.json({ success: true, data: [] });

            filter.createdAt = { $lt: beforeMsg.createdAt };
        }

        const messages = await Message.find(filter)
            .populate("sender", "name role")
            .sort({ createdAt: -1 }) // newest first
            .limit(limit);

        const project = await ProjectRequest.findOne({
            groupChatId: chatId
        }).select("files");
        // Return in normal order (old → new)
        res.json({
            success: true,
            data: messages.reverse(),
            projectFiles: project?.files || []
        });

    } catch (err) {
        next(err);
    }
};

