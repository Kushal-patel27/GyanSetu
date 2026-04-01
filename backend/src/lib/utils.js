import jwt from "jsonwebtoken";

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
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
