import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;

try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connected successfully");
} catch (error) {
    console.error("Database connection failed:", error.message);
}


