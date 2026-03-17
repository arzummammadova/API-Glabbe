import { registerUser, verifyEmail, loginUser, getMe } from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import express from "express";

const authRouter = express.Router();

authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.get("/me", authMiddleware, getMe);

export default authRouter;