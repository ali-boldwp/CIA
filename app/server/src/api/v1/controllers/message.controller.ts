import { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";
import Chat from "../models/chat.model";
import { getIO } from "../../../socket";

export const sendMessage = async (req, res, next) => {
    try {
        const sender = (req as any).user.id;
        let { chatId } = req.params;
        const { text } = req.body;

        // 🔥 Emit instantly — NO DELAY
        const instantMsg = {
            _id: Date.now(),      // temporary ID for socket
            chatId,
            text,
            sender
        };

        getIO().to(chatId).emit("new_message", instantMsg);

        if ( chatId == 'open' ) {

            chatId = null;

        }

        let data = {
            sender,
            text,
            chatId
        }



        // 🔥 Now save in background
        const savedMessage = await Message.create(data);

        await Chat.findByIdAndUpdate(chatId, {
            lastMessage: savedMessage._id
        });

        // Send final DB response to API caller
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
