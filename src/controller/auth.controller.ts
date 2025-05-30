
import { Request, Response } from "express";
import { loginUser,registerUser } from "../services/auth.service";
class AuthController{
    public login= async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({
            error:
              "email and password are required for Authenication",
          });
        }

        const token = await loginUser(email, password);
        return res.json({message: "login successful",email, token });
      } catch (err: any) {
        return  res.status(400).json({ error: err.message });
      }
    }

    public register=async (req: Request, res: Response) => {
      try {
        const {  email, password } = req.body;
        if ( !email || !password) {
          return res
            .status(400)
            .json({
              error:
                " email and password are required for Authentication",
            });
        }

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: "Enter Valid email format" });
        }
        const token = await registerUser(email, password);
        return res.status(201).json({ message: "Registered successfully",token });
      } catch (err: any) {
        return res.status(400).json({ error: err.message });
      }
    }
}

export default new AuthController();