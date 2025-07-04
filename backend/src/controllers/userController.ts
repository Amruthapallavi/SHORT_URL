import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/userModel";
import { LoginInput, RequestWithUser, SignupInput } from "../types/IUser";
import { nanoid } from "nanoid";
import urlModel from "../models/urlModel";
dotenv.config();
import validator from "validator";
import { MESSAGES, STATUS_CODES } from "../utils/constants";

interface AuthRequest extends Request {
  user?: { userId: string };
}
class UserController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password } = req.body as SignupInput;

      if (!name || !email || !password) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ERROR.ALL_FIELDS_REQUIRED });
        return;
      }
      if (password.length < 6 || password.length > 10) {
  res.status(STATUS_CODES.BAD_REQUEST).json({ message: MESSAGES.ERROR.INVALID_PASSWORD_FORMAT });
  return;
}

      const existingUser = await User.findOne({ email });
      if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
        
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({ name, email, password: hashedPassword });

      res.status(STATUS_CODES.CREATED).json({ message: MESSAGES.SUCCESS.SIGNUP });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.ERROR.SERVER_ERROR });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as LoginInput;

      if (!email || !password) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ message:MESSAGES.ERROR.INVALID_INPUT});
        return;
      }

      const user = await User.findOne({ email });
      if (!user) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.USER_NOT_FOUND });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.INVALID_CREDENTIALS });
        return;
      }

      const payload = { userId: user._id, email: user.email };
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
      }

      const token = jwt.sign(payload, secret, { expiresIn: "1h" });

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(STATUS_CODES.OK).json({
        message: MESSAGES.SUCCESS.LOGIN,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.ERROR.SERVER_ERROR });
    }
  }
static async getUrls(req: Request, res: Response): Promise<void> {
    try {
      
const reqWithUser = req as RequestWithUser;
    const userId = reqWithUser.user?.userId;   
       if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.UNAUTHORIZED });
        return;
      }

      const urls = await urlModel.find({ userId }).sort({ createdAt: -1 });

      res.status(STATUS_CODES.OK).json(urls);
    } catch (error) {
      console.error("Get URLs Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
    }
  }
static async shorten(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl || !validator.isURL(originalUrl, { protocols: ["http", "https"], require_protocol: true })) {
       res.status(STATUS_CODES.BAD_REQUEST).json({ message:MESSAGES.ERROR.NOT_VALID_URL });
    }

    const userId = req.user?.userId;
    if (!userId) {
       res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.UNAUTHORIZED});
    }
    
  const existingUrl = await urlModel.findOne({ originalUrl, userId }); 
if (existingUrl) {
   res.status(STATUS_CODES.CONFLICT).json({ message:MESSAGES.ERROR.URL_ALREADY_EXISTS }); 
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

     res.status(STATUS_CODES.CREATED).json({
      message: MESSAGES.SUCCESS.URL_SHORTENED_SUCCESSFUL,
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
     res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.SERVER_ERROR });
  }
}
static async redirect(req: Request, res: Response): Promise<void> {
    try {
      const { shortCode } = req.params;
      const urlEntry = await urlModel.findOne({ shortCode });

      if (!urlEntry) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message:MESSAGES.ERROR.URL_NOT_FOUND});
        return;
      }

      urlEntry.clicks = (urlEntry.clicks || 0) + 1;
      await urlEntry.save();

      res.redirect(urlEntry.originalUrl);
    } catch (error) {
      console.error("Redirect Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.ERROR.SERVER_ERROR });
    }
  }

  static async deleteUrl(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
const reqWithUser = req as RequestWithUser;
    const userId = reqWithUser.user?.userId;
      if (!userId) {
        res.status(STATUS_CODES.UNAUTHORIZED).json({ message: MESSAGES.ERROR.UNAUTHORIZED});
        return;
      }

      const url = await urlModel.findOne({ _id: id, userId });

      if (!url) {
        res.status(STATUS_CODES.NOT_FOUND).json({ message:MESSAGES.ERROR.URL_NOT_FOUND });
        return;
      }

      await urlModel.deleteOne({ _id: id });

      res.status(STATUS_CODES.OK).json({ message: MESSAGES.SUCCESS.DELETED_SUCCESSFUL });
    } catch (error) {
      console.error("Delete URL Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message:MESSAGES.ERROR.SERVER_ERROR });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(STATUS_CODES.OK).json({ message:MESSAGES.SUCCESS.LOGOUT });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.ERROR.LOGOUT });
    }
  }
}

export default UserController;
