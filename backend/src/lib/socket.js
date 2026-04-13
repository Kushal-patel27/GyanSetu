import express from "express";
import dotenv from "dotenv";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";

const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const server = createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : []),
  "http://localhost:5173",
  "http://localhost:5174",
]
  .map((origin) => origin?.trim())
  .filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const isLocalhostOrigin = /^http:\/\/localhost:\d+$/i.test(origin);
      if (isLocalhostOrigin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`Socket CORS rejected origin: ${origin}`);
      return callback(null, false);
    },
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

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { app, io, server };