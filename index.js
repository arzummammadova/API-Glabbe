import express from "express";
import dotenv from "dotenv";

import './src/db/connectDB.js';
const app = express();

const PORT = process.env.PORT || 5000;
dotenv.config();  
app.get("/",(req,res)=>{
    res.send("salam dostlar run olur ")
})
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})