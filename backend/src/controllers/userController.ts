import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel";
import { LoginInput, SignupInput } from "../types/IUser";
import { nanoid } from "nanoid";
import urlModel from "../models/urlModel";
dotenv.config();
import validator from "validator";

interface AuthRequest extends Request {
  user?: { userId: string };
}
class UserController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as SignupInput;

      if (!name || !email || !password) {
        res.status(400).json({ message: "All fields are required." });
        return;
      }
      if (password.length < 6 || password.length > 10) {
  res.status(400).json({ message: "Password must be between 6 and 10 characters." });
  return;
}

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({ message: "User already exists." });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ name, email, password: hashedPassword });

      res.status(201).json({ message: "User registered successfully." });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).json({ message: "User not found!" });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid credentials." });
        return;
      }

      const payload = { userId: user._id, email: user.email };
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables.");
      }

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(200).json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
static async getUrls(req: Request, res: Response): Promise<void> {
    try {
      
const userId = (req as any).user?.userId;
      if (!userId) {
        res.status(401).json({ message: "Unauthorized. User ID missing." });
        return;
      }

      const urls = await urlModel.find({ userId }).sort({ createdAt: -1 });

      res.status(200).json(urls);
    } catch (error) {
      console.error("Get URLs Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }
static async shorten(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl || !validator.isURL(originalUrl, { protocols: ["http", "https"], require_protocol: true })) {
       res.status(400).json({ message: "A valid URL (with http/https) is required." });
    }

    const userId = req.user?.userId;
    if (!userId) {
       res.status(401).json({ message: "Unauthorized. User ID missing." });
    }
    
  const existingUrl = await urlModel.findOne({ originalUrl, userId }); 
if (existingUrl) {
   res.status(409).json({ message: "URL already shortened." }); 
}

    const shortCode = nanoid(6);
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    const newUrl = new urlModel({
      originalUrl,
      shortCode,
      userId,
      shortUrl,
    });

    await newUrl.save();

     res.status(201).json({
      message: "URL shortened successfully",
      data: {
        originalUrl: newUrl.originalUrl,
        shortUrl: newUrl.shortUrl,
        shortCode: newUrl.shortCode,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Shorten URL Error:", error);
     res.status(500).json({ message: "Internal server error." });
  }
}
static async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
   console.log(shortCode,"code")
      const urlEntry = await urlModel.findOne({ shortCode });

      if (!urlEntry) {
        res.status(404).json({ message: "URL not found." });
        return;
      }

      urlEntry.clicks = (urlEntry.clicks || 0) + 1;
      await urlEntry.save();

      res.redirect(urlEntry.originalUrl);
    } catch (error) {
      console.error("Redirect Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async deleteUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const url = await urlModel.findOne({ _id: id, userId });

      if (!url) {
        res.status(404).json({ message: "URL not found or you do not have permission to delete it." });
        return;
      }

      await urlModel.deleteOne({ _id: id });

      res.status(200).json({ message: "URL deleted successfully." });
    } catch (error) {
      console.error("Delete URL Error:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ message: "Logout failed." });
    }
  }
}

export default UserController;
