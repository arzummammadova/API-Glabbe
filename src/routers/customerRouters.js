import express from "express"
import { authMiddleware } from "../middlewares/authMiddleware.js"
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from "../controllers/customerController.js"

const router = express.Router()

// All customer operations require authentication
router.use(authMiddleware)

router.post("/", createCustomer)
router.get("/", getAllCustomers)
router.get("/:id", getCustomerById)
router.put("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)

export default router
