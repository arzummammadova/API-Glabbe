import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRouter from "./src/routers/authRouters.js";
import reservationRouter from "./src/routers/reservationRouters.js";
import customerRouter from "./src/routers/customerRouters.js";
import './src/db/connectDB.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet()); // Sets various HTTP headers for security
// app.use(cors({
//     origin: process.env.BASE_URL || "*", // Allow only the frontend URL to access the API
//     credentials: true
// })); 
app.use(cors()); // Allow all origins to access the API
app.use(morgan("dev")); // Request logging

// Rate Limiting (Prevents Brute Force/DoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per windowMs
    message: "Həddindən artıq müraciət edildi, xahiş edirik 15 dəqiqə sonra yenidən yoxlayın."
});
app.use("/api/", limiter);

app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/customers", customerRouter);

app.get("/", (req, res) => {
    res.send("Glabbe API is running safely 🚀");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Daxili server xətası baş verdi",
        error: process.env.NODE_ENV === "development" ? err.message : {}
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});