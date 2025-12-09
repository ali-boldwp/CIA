import { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";
import Chat from "../models/chat.model";
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

        // 5️⃣ Return final DB message
        res.json({ success: true, data: savedMessage });

    } catch (err) {
        next(err);
    }
};




export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { chatId } = req.params;

        const messages = await Message.find({ chatId })
            .populate("sender", "name role")
            .sort({ createdAt: 1 });

        res.json({ success: true, data: messages });
    } catch (err) {
        next(err);
    }
};
