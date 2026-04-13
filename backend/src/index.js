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

const PORT = process.env.PORT || 5001;

/**
 * CORS Configuration for Production Deployment
 * 
 * Allowed Origins:
 * - Localhost: http://localhost:5173, http://localhost:5174 (development)
 * - Frontend Render URL: loaded from FRONTEND_URL env variable
 * - Additional URLs: FRONTEND_URLS (comma-separated, optional)
 * 
 * Production Setup (Render):
 * Set FRONTEND_URL=https://gyansetu-be4p.onrender.com
 * 
 * Credentials: true enables cookie transmission in cross-origin requests
 */
const getAllowedOrigins = () => {
	const origins = [
		"http://localhost:5173",
		"http://localhost:5174",
		process.env.FRONTEND_URL,
		...(process.env.FRONTEND_URLS ? process.env.FRONTEND_URLS.split(",").map((url) => url.trim()) : []),
	];
	return origins.filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

console.log("✅ Allowed CORS Origins:", allowedOrigins);

const corsOptions = {
	origin: (origin, callback) => {
		// Allow requests without origin header (e.g., mobile apps, tools)
		if (!origin) {
			return callback(null, true);
		}

		// Allow localhost on any port in development
		const isLocalhostOrigin = /^http:\/\/localhost:\d+$/i.test(origin);
		if (isLocalhostOrigin) {
			return callback(null, true);
		}

		// Allow configured frontend origins
		if (allowedOrigins.includes(origin)) {
			return callback(null, true);
		}

		// IMPORTANT: Do NOT throw error here during preflight
		// Just return false to let browser handle it
		console.warn(`CORS rejected origin: ${origin}`);
		callback(new Error("CORS not allowed"));
	},
	credentials: true, // Enable cookies, authorization headers, credentials
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 200, // For compatibility with older browsers
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

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