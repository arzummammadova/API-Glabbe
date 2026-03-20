import express from "express";
import { 
    createReservationByUser, 
    createReservationByCustomer, 
    getMyReservations, 
    updateReservationStatus, 
    deleteReservation 
} from "../controllers/reservationController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const reservationRouter = express.Router();

// Routes for customers (No auth required, but uses userURL lookup)
reservationRouter.post("/customer/:userURL", createReservationByCustomer);

// Routes for providers (Auth required)
reservationRouter.post("/", authMiddleware, createReservationByUser);
reservationRouter.get("/", authMiddleware, getMyReservations);
reservationRouter.put("/:id/status", authMiddleware, updateReservationStatus);
reservationRouter.delete("/:id", authMiddleware, deleteReservation);

export default reservationRouter;
