import mongoose from "mongoose";
import { User } from "./src/models/authModel.js";
import "dotenv/config";

async function checkUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");
        const users = await User.find({}, 'username email role');
        console.log("Users in DB:");
        users.forEach(u => console.log(`- ${u.username} (${u.email}): ${u.role}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUsers();
