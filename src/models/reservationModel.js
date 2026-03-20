import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    customerPhone: {
        type: String,
        required: false
    },
    note: {
        type: String,
        required: false
    },
    service: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String, // format "HH:mm"
        required: true
    },
    endTime: {
        type: String, // format "HH:mm"
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending"
    },
    createdBy: {
        type: String,
        enum: ["user", "customer"],
        default: "customer"
    }
}, { timestamps: true });

export const Reservation = mongoose.model("Reservation", reservationSchema);
