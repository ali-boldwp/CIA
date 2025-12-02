import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    console.log("🔥 Socket.io initialized");

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        // JOIN CHAT
        socket.on("join_chat", (chatId) => {
            socket.join(chatId);
            console.log(`User joined chat: ${chatId}`);
        });

        // SEND MESSAGE
        socket.on("send_message", (msg) => {
            io.to(msg.chatId).emit("new_message", msg);
        });

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
