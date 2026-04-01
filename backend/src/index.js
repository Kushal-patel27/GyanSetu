import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";


const __dirname = path.resolve();
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.PORT || 5001; // Added a fallback PORT

const allowedOrigins = [
	"http://localhost:5173",
	"https://gyansetu-be4p.onrender.com",
	process.env.FRONTEND_URL,
	...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",") : []),
]
	.map((origin) => origin?.trim())
	.filter(Boolean);

const corsOptions = {
	origin: (origin, callback) => {
		// Allow non-browser requests (no Origin header) and configured frontend origins.
		if (!origin || allowedOrigins.includes(origin)) {
			return callback(null, true);
		}
		return callback(new Error(`CORS not allowed for origin: ${origin}`));
	},
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json({ limit: '10mb' })); // Example: increased limit for all JSON bodies
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
 app.use(express.static(path.join(__dirname, "../frontend/dist")));

 app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("✅ Server is running on PORT:", PORT);
  connectDB();
});