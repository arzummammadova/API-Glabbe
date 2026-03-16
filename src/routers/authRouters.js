import registerUser from "../controllers/authController.js";
import express from "express";
const authRouter=express.Router();

authRouter.post("/register",registerUser);

export default authRouter;