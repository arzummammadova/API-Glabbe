import { Reservation } from "../models/reservationModel.js";
import { User } from "../models/authModel.js";
import mongoose from "mongoose";

// Helper to check for overlapping reservations
const isOverlapping = async (userId, date, startTime, endTime) => {
    // Normalizing date to start of day for comparison
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingReservations = await Reservation.find({
        userId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ["pending", "accepted"] } // Ignore rejected ones for overlaps
    });

    return existingReservations.some(res => {
        // (StartA < EndB) && (EndA > StartB)
        return (startTime < res.endTime) && (endTime > res.startTime);
    });
};

// Provider creates a reservation (Automatically accepted)
export const createReservationByUser = async (req, res) => {
    try {
        const { customerName, customerPhone, note, service, price, date, startTime, endTime } = req.body;
        const userId = req.user.userId;

        if (startTime >= endTime) {
            return res.status(400).json({ message: "Bitiş vaxtı başlanğıc vaxtından sonra olmalıdır" });
        }

        if (await isOverlapping(userId, date, startTime, endTime)) {
            return res.status(400).json({ message: "Bu vaxt aralığında artıq başqa bir rezervasiya var" });
        }

        const newReservation = new Reservation({
            userId,
            customerName,
            customerPhone,
            note,
            service,
            price: Number(price) || undefined,
            date,
            startTime,
            endTime,
            status: "accepted",
            createdBy: "user"
        });

        await newReservation.save();
        res.status(201).json({ message: "Rezervasiya yaradıldı", reservation: newReservation });
    } catch (error) {
        console.error("Reservation Creation Error:", error);
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

// Customer creates a reservation via userURL (Pending approval)
export const createReservationByCustomer = async (req, res) => {
    try {
        const { userURL } = req.params;
        const { customerName, customerPhone, note, service, price, date, startTime, endTime } = req.body;

        const user = await User.findOne({ userURL });
        if (!user) {
            return res.status(404).json({ message: "İstifadəçi tapılmadı" });
        }

        if (startTime >= endTime) {
            return res.status(400).json({ message: "Bitiş vaxtı başlanğıc vaxtından sonra olmalıdır" });
        }

        if (await isOverlapping(user._id, date, startTime, endTime)) {
            return res.status(400).json({ message: "Bu vaxt aralığı doludur, zəhmət olmasa başqa vaxt seçin" });
        }

        const newReservation = new Reservation({
            userId: user._id,
            customerName,
            customerPhone,
            note,
            service,
            price,
            date,
            startTime,
            endTime,
            status: "pending",
            createdBy: "customer"
        });

        await newReservation.save();
        res.status(201).json({ message: "Rezervasiya müraciəti göndərildi, təsdiq gözlənilir", reservation: newReservation });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

// Get all reservations for the logged-in provider with filtering and stats
export const getMyReservations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { status } = req.query; // accepted, rejected, pending

        const query = { userId };
        if (status && ["accepted", "rejected", "pending"].includes(status)) {
            query.status = status;
        }

        const reservations = await Reservation.find(query).sort({ date: 1, startTime: 1 });

        // Get counts for all statuses
        const stats = await Reservation.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const formattedStats = {
            total: stats.reduce((acc, curr) => acc + curr.count, 0),
            accepted: stats.find(s => s._id === "accepted")?.count || 0,
            pending: stats.find(s => s._id === "pending")?.count || 0,
            rejected: stats.find(s => s._id === "rejected")?.count || 0
        };

        res.status(200).json({
            stats: formattedStats,
            reservations
        });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

// Update reservation status (Accept/Reject)
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // accepted, rejected, pending
        const userId = req.user.userId;

        if (!["accepted", "rejected", "pending"].includes(status)) {
            return res.status(400).json({ message: "Yanlış status" });
        }

        const reservation = await Reservation.findOne({ _id: id, userId });
        if (!reservation) {
            return res.status(404).json({ message: "Rezervasiya tapılmadı" });
        }

        // If trying to accept, check for overlaps again (to be safe)
        if (status === "accepted") {
            const tempReservations = await Reservation.find({
                userId,
                _id: { $ne: id },
                date: reservation.date,
                status: "accepted"
            });

            const overlapping = tempReservations.some(res => {
                return (reservation.startTime < res.endTime) && (reservation.endTime > res.startTime);
            });

            if (overlapping) {
                return res.status(400).json({ message: "Bu vaxt aralığında artıq başqa bir təsdiqlənmiş rezervasiya var" });
            }
        }

        reservation.status = status;
        await reservation.save();

        res.status(200).json({ message: `Rezervasiya statusu ${status} olaraq dəyişdirildi`, reservation });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};

// Delete a reservation
export const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const reservation = await Reservation.findOneAndDelete({ _id: id, userId });
        if (!reservation) {
            return res.status(404).json({ message: "Rezervasiya tapılmadı" });
        }

        res.status(200).json({ message: "Rezervasiya silindi" });
    } catch (error) {
        res.status(500).json({ message: "Server xətası", error: error.message });
    }
};
