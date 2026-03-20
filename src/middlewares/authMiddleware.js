import jwt from "jsonwebtoken";
import { User } from "../models/authModel.js";

export const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "İcazə yoxdur, token tapılmadı" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Fetch user to check plan status in real-time
        let user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        const now = new Date();

        // Check if PRO has expired, downgrade to 'adi'
        if (user.plan === "pro" && user.subscriptionExpiration < now) {
            user.plan = "adi";
            // NOTE: Here we could reset subscriptionExpiration to trial end if we want, 
            // but for simplicity, once pro ends, if expiration is in the past, they stay blocked on adi.
            await user.save();
        }

        // Check if trial/adi has expired
        if (user.plan === "adi" && user.subscriptionExpiration < now) {
            return res.status(403).json({ 
                message: "İstifadə müddətiniz (sınaq və ya PRO) başa çatıb. Zəhmət olmasa PRO plana keçid etmək üçün bizimlə əlaqə saxlayın.",
                expired: true,
                subscriptionExpiration: user.subscriptionExpiration
            });
        }

        // Set req.user with latest DB data (ensures latest role/plan)
        req.user = { 
            userId: user._id.toString(), 
            role: user.role,
            plan: user.plan 
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "Token etibarsızdır" });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Bu əməliyyat üçün admin səlahiyyəti lazımdır" });
    }
};
