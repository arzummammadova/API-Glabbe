import "dotenv/config";
import express from "express";
import authRouter from "./src/routers/authRouters.js";
import './src/db/connectDB.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth", authRouter);
app.get("/",(req,res)=>{
    res.send("salam dostlar run olur ")
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})