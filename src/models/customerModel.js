import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    birthDate: {
        type: Date,
        required: false
    },
    address: {
        type: String,
        required: false
    }
}, { timestamps: true });

export const Customer = mongoose.model("Customer", customerSchema);
