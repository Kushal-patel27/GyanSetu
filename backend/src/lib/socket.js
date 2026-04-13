import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
  },
  transports: ["websocket", "polling"],
});

const userSocketMap = {};

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;

  if (process.env.NODE_ENV !== "production") {
    console.log("Socket connected", {
      socketId: socket.id,
      userId: userId || null,
      origin: socket.handshake.headers?.origin || null,
    });
  }

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("Socket disconnected", {
        socketId: socket.id,
        userId: userId || null,
      });
    }
  });
});

export { app, io, server };