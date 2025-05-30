import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import { AuthRequest } from "../types/auth.type";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
      // just return void, do NOT return res
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Invalid token format" });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    (req as any).user = user; // attach user to request
    next(); // call next to proceed
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }
};
