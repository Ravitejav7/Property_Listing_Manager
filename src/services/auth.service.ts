import User from "../models/user.model";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/auth.util";

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = generateToken(user._id.toString(), user.email);
  return token;
}

export async function registerUser(email: string, password: string) {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("Email already in use");

  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ email, passwordHash });
  await newUser.save();

  const token = generateToken(newUser._id.toString(), newUser.email);
  return token;
}
