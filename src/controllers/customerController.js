import { Customer } from "../models/customerModel.js";

export const createCustomer = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, note, birthDate, address } = req.body;
        const userId = req.user.userId;

        const newCustomer = new Customer({
            userId,
            firstName,
            lastName,
            email,
            phone,
            note,
            birthDate,
            address
        });

        await newCustomer.save();
        res.status(201).json({ message: "Müştəri uğurla yaradıldı", customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: "Müştəri yaradılarkən xəta baş verdi", error: error.message });
    }
};

export const getAllCustomers = async (req, res) => {
    try {
        const userId = req.user.userId;
        const customers = await Customer.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Müştərilər gətirilərkən xəta baş verdi", error: error.message });
    }
};

export const getCustomerById = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const customer = await Customer.findOne({ _id: id, userId });
        if (!customer) {
            return res.status(404).json({ message: "Müştəri tapılmadı" });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: "Müştəri məlumatları gətirilərkən xəta baş verdi", error: error.message });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const updateData = req.body;

        const updatedCustomer = await Customer.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true }
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: "Müştəri tapılmadı və ya yeniləmək üçün icazəniz yoxdur" });
        }

        res.status(200).json({ message: "Müştəri məlumatları yeniləndi", customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: "Müştəri yenilənərkən xəta baş verdi", error: error.message });
    }
};

export const deleteCustomer = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const deletedCustomer = await Customer.findOneAndDelete({ _id: id, userId });
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Müştəri tapılmadı və ya silmək üçün icazəniz yoxdur" });
        }

        res.status(200).json({ message: "Müştəri uğurla silindi" });
    } catch (error) {
        res.status(500).json({ message: "Müştəri silinərkən xəta baş verdi", error: error.message });
    }
};
