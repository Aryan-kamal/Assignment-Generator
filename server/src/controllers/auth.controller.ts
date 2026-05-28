import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User } from "../models/User.model";
import { env } from "../config/env";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

function generateToken(userId: string): string {
  return jwt.sign({ userId }, env.JWT_SECRET, { expiresIn: "7d" });
}

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400).json({ success: false, error: "Email already registered" });
      return;
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(String(user._id));

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Register error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, error: "Invalid email or password" });
      return;
    }

    const token = generateToken(String(user._id));

    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      res.status(400).json({ success: false, errors: error.errors });
      return;
    }
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}

export async function getMe(req: Request, res: Response) {
  try {
    const userId = (req as any).userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({ success: false, error: "User not found" });
      return;
    }
    res.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
}
