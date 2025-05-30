import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";
import authController from "../controller/auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
