import { Model, model, Schema } from "mongoose";
import { IUser } from "../types/user.type";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true },
    favorites: [{ type: String, default: [] }], // stores custom property IDs like "PROP100"
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.passwordHash);
};

const User = model<IUser, Model<IUser>>("User", userSchema, "User");

export default User;
