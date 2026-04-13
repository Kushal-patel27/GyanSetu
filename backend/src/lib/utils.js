import jwt from "jsonwebtoken";

/**
 * Cookie options configured for production CORS + cookies
 * 
 * httpOnly: true - Prevents JavaScript access (security best practice)
 * secure: true (production) - Only sends over HTTPS
 * sameSite: "none" (production) - Allows cross-origin cookie sending
 * sameSite: "lax" (dev) - Development-friendly CORS
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    httpOnly: true, // Prevents XSS attacks - cookies not accessible via JS
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? "none" : "lax", // "none" requires secure: true
  };
};

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, getCookieOptions());

  return token;
};

export const clearTokenCookie = (res) => {
  res.clearCookie("jwt", {
    ...getCookieOptions(),
    maxAge: 0,
  });
};
