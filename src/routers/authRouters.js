import { 
    registerUser, 
    verifyEmail, 
    loginUser, 
    getMe, 
    updateMe, 
    forgotPassword, 
    resetPassword,
    getAllUsers,
    updateUserPlan
} from "../controllers/authController.js";
import { validate } from "../middlewares/validateMiddleware.js";
import { authMiddleware, adminMiddleware } from "../middlewares/authMiddleware.js";
import { 
    registerSchema, 
    loginSchema, 
    forgotPasswordSchema, 
    resetPasswordSchema, 
    updateMeSchema 
} from "../validations/authValidation.js";
import express from "express";

const authRouter = express.Router();

// Public routes
authRouter.post("/register", validate(registerSchema), registerUser);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/login", validate(loginSchema), loginUser);
authRouter.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
authRouter.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

// User routes (Required Auth)
authRouter.get("/me", authMiddleware, getMe);
authRouter.put("/me", authMiddleware, validate(updateMeSchema), updateMe);

// Admin routes (Required Admin)
authRouter.get("/users", authMiddleware, adminMiddleware, getAllUsers);
authRouter.put("/users/:id/plan", authMiddleware, adminMiddleware, updateUserPlan);

export default authRouter;