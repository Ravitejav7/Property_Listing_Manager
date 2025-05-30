import jwt from "jsonwebtoken";

export const generateToken = (userId: string, email: string) => {
  return jwt.sign(
    { userId, email }, 
    process.env.JWT_SECRET!,
    { expiresIn: "20m" }
  );
};
