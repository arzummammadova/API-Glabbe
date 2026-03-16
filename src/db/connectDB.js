import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;

try {
mongoose.connect(MONGODB_URI)
console.log("Database connected");

} catch (error) {
    console.log(error);
}


