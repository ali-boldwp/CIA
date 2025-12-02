import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

// 🔥 Create single socket instance
export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
});

socket.on("connect", () => {
    console.log("🟢 Connected to Socket.io:", socket.id);
});

socket.on("disconnect", () => {
    console.log("🔴 Disconnected from Socket.io");
});

export default socket;
