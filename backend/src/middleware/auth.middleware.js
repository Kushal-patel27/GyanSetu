import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.jwt;
  if (cookieToken) return cookieToken;

  const authHeader = req.headers?.authorization || req.headers?.Authorization;
  if (!authHeader || typeof authHeader !== "string") return null;

  const [scheme, token] = authHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token) return null;

  return token;
};

export const protectRoute = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    const tokenSource = req.cookies?.jwt ? "cookie" : "authorization-header";

    if (process.env.NODE_ENV !== "production") {
      console.log("Auth middleware debug", {
        path: req.originalUrl,
        origin: req.headers.origin || null,
        hasCookie: Boolean(req.cookies?.jwt),
        hasAuthHeader: Boolean(req.headers?.authorization),
        tokenSource: token ? tokenSource : null,
      });
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
