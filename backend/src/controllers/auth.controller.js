import { clearTokenCookie, generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { OAuth2Client } from "google-auth-library";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    clearTokenCookie(res);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GOOGLE OAUTH (server-side redirect flow)
const getOAuthClient = () => {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:5001/api/auth/google/callback";
  return new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri,
  });
};

export const googleOAuthStart = (req, res) => {
  try {
    const client = getOAuthClient();
    const url = client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "consent",
    });
    return res.redirect(url);
  } catch (error) {
    console.log("Error in googleOAuthStart", error.message);
    res.status(500).json({ message: "Failed to start Google OAuth" });
  }
};

export const googleOAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing code");

    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    const idToken = tokens.id_token;
    if (!idToken) return res.status(400).send("Missing id_token from Google");

    let payload;
    try {
      const ticket = await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
      payload = ticket.getPayload();
    } catch (e) {
      return res.status(400).send("Invalid id_token");
    }

    const email = payload?.email;
    const fullName = payload?.name || "User";
    const picture = payload?.picture || "";
    if (!email) return res.status(400).send("Google email missing");

    let user = await User.findOne({ email });
    let generatedPasswordPlain = null;
    if (!user) {
      const firstName = (fullName || "User").split(" ")[0];
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      generatedPasswordPlain = `${capitalizedFirstName}@0000`;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(generatedPasswordPlain, salt);
      user = new User({ fullName, email, password: hashedPassword, profilePic: picture });
      await user.save();
    }

    generateToken(user._id, res);

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5173";
    const redirectUrl = new URL(frontendBase);
    if (generatedPasswordPlain) redirectUrl.searchParams.set("pw", generatedPasswordPlain);
    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.log("Error in googleOAuthCallback", error.message);
    res.status(500).send("Google OAuth callback failed");
  }
};
